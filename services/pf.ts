import { db, wsdb } from "@/db/drizzle";
import { PFLedgerTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PF_TRANSACTION_TYPE } from "@/enum";
import { AppError } from "@/lib/errors";
import { handleErrorWithSlack } from "@/lib/error-handling";
import {
  checkDuplicateProcessingQuery,
  getAllActivePFSettingsQuery,
  getAllUsersPFBalanceSummaryQuery,
  getAlreadyProcessedUserIdsQuery,
  getPFBalanceByUserQuery,
  getPFLedgerByUserQuery,
  getPFMonthlyProcessingHistoryQuery,
  getPFSettingByUserIdQuery,
} from "@/queries/pf";
import type { PFLedgerTableInsertType, PFLedgerTableSelectType } from "@/types";

/* ─────────────────────────────── SETTINGS ────────────────────────────────── */

export async function getPFSettingByUserId(userId: string) {
  try {
    const rows = await getPFSettingByUserIdQuery(userId);
    return rows[0] ?? null;
  } catch (error) {
    handleErrorWithSlack("getPFSettingByUserId failed", error);
    throw error;
  }
}

/* ──────────────────────────── DUPLICATE GUARD ────────────────────────────── */

export async function guardDuplicateProcessing(
  userId: string,
  month: number,
  year: number,
): Promise<void> {
  const cnt = await checkDuplicateProcessingQuery(userId, month, year);
  if (cnt > 0) {
    throw new AppError(`PF already processed.`, {
      status: 409,
      detail: `PF already processed for user ${userId} for ${month}/${year}.`,
    });
  }
}

/* ────────────────────────── MONTHLY PROCESSING ──────────────────────────── */

export interface ProcessMonthlyPFResult {
  processed: number;
  skipped: number;
  totalEmployeeContribution: number;
  totalCompanyContribution: number;
  errors: { userId: string; reason: string }[];
}

export async function processMonthlyPF({
  month,
  year,
  processedBy,
}: {
  month: number;
  year: number;
  processedBy: string;
}): Promise<ProcessMonthlyPFResult> {
  try {
    const settings = await getAllActivePFSettingsQuery();

    if (settings.length === 0) {
      return {
        processed: 0,
        skipped: 0,
        totalEmployeeContribution: 0,
        totalCompanyContribution: 0,
        errors: [],
      };
    }

    const result: ProcessMonthlyPFResult = {
      processed: 0,
      skipped: 0,
      totalEmployeeContribution: 0,
      totalCompanyContribution: 0,
      errors: [],
    };

    const insertRows: PFLedgerTableInsertType[] = [];
    const now = new Date();

    // Single query instead of one SELECT COUNT per employee
    const alreadyProcessed = await getAlreadyProcessedUserIdsQuery(month, year);

    for (const setting of settings) {
      if (alreadyProcessed.has(setting.userId)) {
        result.skipped += 1;
        continue;
      }

      const employeeAmount = parseFloat(setting.employeeMonthlyAmount ?? "0");

      let companyAmount = 0;
      if (setting.companyContributionEnabled) {
        if (setting.companyContributionType === "match_employee") {
          companyAmount = employeeAmount;
        } else {
          companyAmount = parseFloat(setting.companyContributionAmount ?? "0");
        }
      }

      const totalContribution = employeeAmount + companyAmount;

      insertRows.push({
        userId: setting.userId,
        month,
        year,
        transactionType: PF_TRANSACTION_TYPE.monthly_contribution,
        employeeContribution: employeeAmount.toFixed(2),
        companyContribution: companyAmount.toFixed(2),
        totalContribution: totalContribution.toFixed(2),
        withdrawalAmount: "0",
        processedBy,
        processedAt: now,
        referenceId: `PF-${year}-${String(month).padStart(2, "0")}`,
      });

      result.totalEmployeeContribution += employeeAmount;
      result.totalCompanyContribution += companyAmount;
      result.processed += 1;
    }

    // Batch insert inside a transaction for atomicity
    if (insertRows.length > 0) {
      await wsdb.transaction(async (tx) => {
        await tx.insert(PFLedgerTable).values(insertRows);
      });
    }

    return result;
  } catch (error) {
    handleErrorWithSlack("processMonthlyPF failed", error);
    throw error;
  }
}

/* ─────────────────────────────── BALANCE ─────────────────────────────────── */

export async function getPFBalance(userId: string) {
  try {
    return getPFBalanceByUserQuery(userId);
  } catch (error) {
    handleErrorWithSlack("getPFBalance failed", error);
    throw error;
  }
}

export async function getAllUsersPFBalance() {
  try {
    const rows = await getAllUsersPFBalanceSummaryQuery();
    return rows.map((row) => {
      const emp = parseFloat(row.employeeTotal);
      const comp = parseFloat(row.companyTotal);
      const withdrawal = parseFloat(row.withdrawalTotal);
      return {
        ...row,
        balance: emp + comp - withdrawal,
      };
    });
  } catch (error) {
    handleErrorWithSlack("getAllUsersPFBalance failed", error);
    throw error;
  }
}

/* ─────────────────────────────── LEDGER ──────────────────────────────────── */

export async function getUserPFLedger(
  userId: string,
  filters?: { month?: number; year?: number },
) {
  try {
    return getPFLedgerByUserQuery({ userId, ...filters });
  } catch (error) {
    handleErrorWithSlack("getUserPFLedger failed", error);
    throw error;
  }
}

export async function getMonthlyProcessingHistory(month: number, year: number) {
  try {
    return getPFMonthlyProcessingHistoryQuery(month, year);
  } catch (error) {
    handleErrorWithSlack("getMonthlyProcessingHistory failed", error);
    throw error;
  }
}

/* ────────────────────────────── WITHDRAWAL ─────────────────────────────── */

export async function createPFWithdrawal({
  userId,
  amount,
  month,
  year,
  processedBy,
  remarks,
}: {
  userId: string;
  amount: number;
  month: number;
  year: number;
  processedBy: string;
  remarks?: string;
}): Promise<PFLedgerTableSelectType> {
  try {
    return await wsdb.transaction(async (tx) => {
      // Balance check uses tx so read + insert are in the same connection scope,
      // preventing concurrent requests from both passing the check before either inserts.
      const [balanceRow] = await tx
        .select({
          balance: sql<string>`COALESCE(SUM(${PFLedgerTable.employeeContribution}) + SUM(${PFLedgerTable.companyContribution}) - SUM(${PFLedgerTable.withdrawalAmount}), 0)`,
        })
        .from(PFLedgerTable)
        .where(eq(PFLedgerTable.userId, userId));

      const currentBalance = parseFloat(balanceRow?.balance ?? "0");
      if (currentBalance < amount) {
        throw new AppError("Insufficient PF balance for withdrawal.", {
          status: 400,
          detail: `Available balance: ${currentBalance.toFixed(2)}. Requested: ${amount.toFixed(2)}`,
        });
      }

      const [row] = await tx
        .insert(PFLedgerTable)
        .values({
          userId,
          month,
          year,
          transactionType: PF_TRANSACTION_TYPE.withdrawal,
          employeeContribution: "0",
          companyContribution: "0",
          totalContribution: "0",
          withdrawalAmount: amount.toFixed(2),
          processedBy,
          processedAt: new Date(),
          remarks,
        })
        .returning();

      return row;
    });
  } catch (error) {
    handleErrorWithSlack("createPFWithdrawal failed", error);
    throw error;
  }
}

/* ─────────────────── MANUAL / HISTORICAL MONTHLY ENTRY ─────────────────── */

export async function createManualPFEntry({
  userId,
  employeeContribution,
  companyContribution,
  month,
  year,
  processedBy,
  remarks,
}: {
  userId: string;
  employeeContribution: number;
  companyContribution: number;
  month: number;
  year: number;
  processedBy: string;
  remarks?: string;
}): Promise<PFLedgerTableSelectType> {
  try {
    const cnt = await checkDuplicateProcessingQuery(userId, month, year);
    if (cnt > 0) {
      throw new AppError(
        `A monthly_contribution entry already exists for this employee for ${month}/${year}.`,
        {
          status: 409,
          detail: "Delete the existing entry first if you need to re-enter it.",
        },
      );
    }

    const total = employeeContribution + companyContribution;

    const result = await db
      .insert(PFLedgerTable)
      .values({
        userId,
        month,
        year,
        transactionType: PF_TRANSACTION_TYPE.monthly_contribution,
        employeeContribution: employeeContribution.toFixed(2),
        companyContribution: companyContribution.toFixed(2),
        totalContribution: total.toFixed(2),
        withdrawalAmount: "0",
        processedBy,
        processedAt: new Date(),
        referenceId: `PF-MANUAL-${year}-${String(month).padStart(2, "0")}`,
        remarks: remarks ?? "Manual historical entry",
      })
      .returning();

    return result[0];
  } catch (error) {
    handleErrorWithSlack("createManualPFEntry failed", error);
    throw error;
  }
}
