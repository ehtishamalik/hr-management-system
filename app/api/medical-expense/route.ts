import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { MedicalExpenseTable, MedicalLimitTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { AppError, ForbiddenError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, MedicalExpenseTableSelectType } from "@/types";

// GET /api/medical-expense
// - No filter → ADMIN only
// - ?userId=&year= → own data or ADMIN
export const GET = withAuth(async (request: NextRequest, _ctx, _session) => {
  const userId = getValueFromRequest(request, "userId");
  const yearStr = getValueFromRequest(request, "year");
  const isAdmin = _session.user.role === ROLE.ADMIN;

  if (userId && yearStr) {
    if (!isAdmin && _session.user.id !== userId) {
      throw new ForbiddenError("You can only view your own medical expenses.");
    }

    const year = Number.parseInt(yearStr, 10);
    const expenses = await db
      .select()
      .from(MedicalExpenseTable)
      .where(
        and(
          eq(MedicalExpenseTable.userId, userId),
          eq(MedicalExpenseTable.year, year),
        ),
      );

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType[]>>({
      success: true,
      data: expenses,
    });
  }

  if (!isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to list all medical expenses.",
    );
  }

  const data = await db
    .select()
    .from(MedicalExpenseTable)
    .orderBy(desc(MedicalExpenseTable.createdAt));

  return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at /api/medical-expense (GET)");

// POST /api/medical-expense — ADMIN only
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

    const result = await db
      .insert(MedicalExpenseTable)
      .values({ userId, year, month, amount })
      .returning();

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType>>({
      success: true,
      data: result[0],
    });
  },
  "Error at /api/medical-expense (POST)",
  [ROLE.ADMIN],
);
