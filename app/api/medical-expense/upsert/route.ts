import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { MedicalExpenseTable, MedicalLimitTable } from "@/db/schema";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, MedicalExpenseTableSelectType } from "@/types";

// POST /api/medical-expense/upsert — ADMIN only
export const POST = withAuth(
  async (request: NextRequest) => {
    const {
      userId,
      year: yearVal,
      month: monthVal,
      amount: amountVal,
    } = await request.json();

    if (!userId || !yearVal || !monthVal || amountVal === undefined) {
      throw new AppError("userId, year, month and amount are required", {
        detail: "Please provide userId, year, month and amount",
        status: 400,
      });
    }

    const year = Number.parseInt(yearVal.toString(), 10);
    const month = Number.parseInt(monthVal.toString(), 10);
    const amount = amountVal.toString();

    const [limitResult] = await db
      .select()
      .from(MedicalLimitTable)
      .where(eq(MedicalLimitTable.year, year))
      .limit(1);

    if (!limitResult) {
      throw new AppError("Medical limit not found", {
        detail: "Please add medical limit for the year first",
        status: 404,
      });
    }

    const yearlyLimit = Number.parseFloat(limitResult.amount);

    const existingExpenses = await db
      .select()
      .from(MedicalExpenseTable)
      .where(
        and(
          eq(MedicalExpenseTable.userId, userId),
          eq(MedicalExpenseTable.year, year),
        ),
      );

    const otherMonthsTotal = existingExpenses
      .filter((e) => e.month !== month)
      .reduce((sum, e) => sum + Number.parseFloat(e.amount), 0);

    const newTotal = otherMonthsTotal + Number.parseFloat(amount);

    if (newTotal > yearlyLimit) {
      throw new Error(
        `Total claims (${newTotal}) exceed the yearly limit (${yearlyLimit}).`,
      );
    }

    const alreadyExist = existingExpenses.find((e) => e.month === month);
    let result: MedicalExpenseTableSelectType[] = [];
    if (alreadyExist) {
      result = await db
        .update(MedicalExpenseTable)
        .set({ amount, year, userId, month })
        .where(
          and(
            eq(MedicalExpenseTable.year, year),
            eq(MedicalExpenseTable.month, month),
            eq(MedicalExpenseTable.userId, userId),
          ),
        )
        .returning();
    } else {
      result = await db
        .insert(MedicalExpenseTable)
        .values({ userId, year, month, amount })
        .returning();
    }

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType>>({
      success: true,
      data: result[0],
    });
  },
  "Error at /api/medical-expense/upsert (POST)",
  [ROLE.ADMIN],
);
