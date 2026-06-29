import { and, asc, desc, eq, sql, count } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
  PFLedgerTable,
  PFSettingsTable,
  user as UserTable,
  UserDetailTable,
} from "@/db/schema";
import { PF_TRANSACTION_TYPE, STATUS } from "@/enum";

/* ─────────────────────────────── PF SETTINGS ─────────────────────────────── */

export const getPFSettingByUserIdQuery = async (userId: string) => {
  return db
    .select()
    .from(PFSettingsTable)
    .where(eq(PFSettingsTable.userId, userId))
    .limit(1);
};

export const getAllPFSettingsQuery = async () => {
  return db
    .select({
      pfSettings: PFSettingsTable,
      user: {
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
      },
      userDetail: {
        employeeId: UserDetailTable.employeeId,
        designation: UserDetailTable.designation,
      },
    })
    .from(PFSettingsTable)
    .innerJoin(UserTable, eq(PFSettingsTable.userId, UserTable.id))
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .orderBy(UserTable.name);
};

export const getAllActivePFSettingsQuery = async () => {
  return db
    .select()
    .from(PFSettingsTable)
    .where(eq(PFSettingsTable.status, STATUS.ACTIVE));
};

/* ─────────────────────────────── PF LEDGER ───────────────────────────────── */

export const getPFLedgerByUserQuery = async ({
  userId,
  month,
  year,
}: {
  userId: string;
  month?: number;
  year?: number;
}) => {
  return db
    .select()
    .from(PFLedgerTable)
    .where(
      and(
        eq(PFLedgerTable.userId, userId),
        month !== undefined ? eq(PFLedgerTable.month, month) : undefined,
        year !== undefined ? eq(PFLedgerTable.year, year) : undefined,
      ),
    )
    .orderBy(desc(PFLedgerTable.year), desc(PFLedgerTable.month));
};

export const getPFMonthlyProcessingHistoryQuery = async (
  month: number,
  year: number,
) => {
  return db
    .select({
      ledger: PFLedgerTable,
      user: {
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
      },
      userDetail: {
        employeeId: UserDetailTable.employeeId,
        designation: UserDetailTable.designation,
      },
    })
    .from(PFLedgerTable)
    .innerJoin(UserTable, eq(PFLedgerTable.userId, UserTable.id))
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .where(
      and(
        eq(PFLedgerTable.month, month),
        eq(PFLedgerTable.year, year),
        eq(
          PFLedgerTable.transactionType,
          PF_TRANSACTION_TYPE.monthly_contribution,
        ),
      ),
    )
    .orderBy(UserTable.name);
};

/* ─────────────────────────────── DUPLICATE GUARD ────────────────────────── */

export const checkDuplicateProcessingQuery = async (
  userId: string,
  month: number,
  year: number,
) => {
  const result = await db
    .select({ cnt: count() })
    .from(PFLedgerTable)
    .where(
      and(
        eq(PFLedgerTable.userId, userId),
        eq(PFLedgerTable.month, month),
        eq(PFLedgerTable.year, year),
        eq(
          PFLedgerTable.transactionType,
          PF_TRANSACTION_TYPE.monthly_contribution,
        ),
      ),
    );
  return result[0]?.cnt ?? 0;
};

export const getAlreadyProcessedUserIdsQuery = async (
  month: number,
  year: number,
): Promise<Set<string>> => {
  const rows = await db
    .select({ userId: PFLedgerTable.userId })
    .from(PFLedgerTable)
    .where(
      and(
        eq(PFLedgerTable.month, month),
        eq(PFLedgerTable.year, year),
        eq(PFLedgerTable.transactionType, PF_TRANSACTION_TYPE.monthly_contribution),
      ),
    );
  return new Set(rows.map((r) => r.userId));
};

/* ─────────────────────────────── BALANCE QUERY ──────────────────────────── */

export const getPFBalanceByUserQuery = async (userId: string) => {
  const result = await db
    .select({
      employeeTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.employeeContribution}), 0)`,
      companyTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.companyContribution}), 0)`,
      withdrawalTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.withdrawalAmount}), 0)`,
    })
    .from(PFLedgerTable)
    .where(eq(PFLedgerTable.userId, userId));

  const row = result[0] ?? {
    employeeTotal: "0",
    companyTotal: "0",
    withdrawalTotal: "0",
  };

  const employeeTotal = parseFloat(row.employeeTotal);
  const companyTotal = parseFloat(row.companyTotal);
  const withdrawalTotal = parseFloat(row.withdrawalTotal);
  const totalContributed = employeeTotal + companyTotal;
  const balance = totalContributed - withdrawalTotal;

  return {
    employeeTotal,
    companyTotal,
    totalContributed,
    withdrawalTotal,
    balance,
  };
};

/* ─────────────────────── ALL-USER BALANCE SUMMARY (Admin) ───────────────── */

export const getAllUsersPFBalanceSummaryQuery = async () => {
  return db
    .select({
      userId: PFLedgerTable.userId,
      userName: UserTable.name,
      employeeId: UserDetailTable.employeeId,
      employeeTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.employeeContribution}), 0)`,
      companyTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.companyContribution}), 0)`,
      withdrawalTotal: sql<string>`COALESCE(SUM(${PFLedgerTable.withdrawalAmount}), 0)`,
    })
    .from(PFLedgerTable)
    .innerJoin(UserTable, eq(PFLedgerTable.userId, UserTable.id))
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .groupBy(PFLedgerTable.userId, UserTable.name, UserDetailTable.employeeId)
    .orderBy(UserTable.name);
};

/* ─────────────── ALL ACTIVE USERS + PF STATUS (for admin settings) ──────── */

export const getAllUsersWithPFStatusQuery = async () => {
  return db
    .select({
      user: {
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
      },
      userDetail: {
        employeeId: UserDetailTable.employeeId,
        designation: UserDetailTable.designation,
      },
      pfSettings: PFSettingsTable,
    })
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserDetailTable.userId, UserTable.id))
    .leftJoin(PFSettingsTable, eq(PFSettingsTable.userId, UserTable.id))
    .where(eq(UserDetailTable.status, STATUS.ACTIVE))
    .orderBy(asc(UserTable.name));
};
