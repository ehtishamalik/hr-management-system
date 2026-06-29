import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { MedicalExpenseTable, MedicalLimitTable } from "@/db/schema";
import { AppError, ForbiddenError } from "@/lib/errors";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, MedicalExpenseTableSelectType } from "@/types";

// GET /api/medical-expense/[id] — own data or ADMIN
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/medical-expense/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .select()
      .from(MedicalExpenseTable)
      .where(eq(MedicalExpenseTable.id, id))
      .limit(1);

    if (data.length === 0) {
      throw new AppError("Medical expense not found", {
        detail: "Medical expense not found",
        status: 404,
      });
    }

    const expense = data[0];

    if (
      _session.user.role !== ROLE.ADMIN &&
      expense.userId !== _session.user.id
    ) {
      throw new ForbiddenError("You can only view your own medical expenses.");
    }

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType>>({
      success: true,
      data: expense,
    });
  },
  "Error at /api/medical-expense/[id] (GET)",
);

// PUT /api/medical-expense/[id] — ADMIN only
export const PUT = withAuth(
  async (
    request: NextRequest,
    _ctx: RouteContext<"/api/medical-expense/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const body: Partial<{
      userId: string;
      year: number;
      month: number;
      amount: string;
    }> = await request.json();

    const current = await db
      .select()
      .from(MedicalExpenseTable)
      .where(eq(MedicalExpenseTable.id, id))
      .limit(1);

    if (current.length === 0) {
      return NextResponse.json(
        { success: false, error: "Medical expense not found" },
        { status: 404 },
      );
    }

    const expense = current[0];
    const userId = body.userId || expense.userId;
    const year = body.year || expense.year;
    const amount = body.amount || expense.amount;

    const limitResult = await db
      .select()
      .from(MedicalLimitTable)
      .where(eq(MedicalLimitTable.year, year))
      .limit(1);

    let yearlyLimit: number;
    if (limitResult.length > 0) {
      yearlyLimit = Number.parseFloat(limitResult[0].amount);
    } else {
      const latestLimit = await db
        .select()
        .from(MedicalLimitTable)
        .orderBy(desc(MedicalLimitTable.year))
        .limit(1);
      yearlyLimit =
        latestLimit.length > 0
          ? Number.parseFloat(latestLimit[0].amount)
          : 300000;
    }

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
      .filter((e) => e.id !== id)
      .reduce((sum, e) => sum + Number.parseFloat(e.amount), 0);

    const newTotal = otherMonthsTotal + Number.parseFloat(amount);

    if (newTotal > yearlyLimit) {
      throw new Error(
        `Total claims (${newTotal}) exceed the yearly limit (${yearlyLimit}).`,
      );
    }

    const data = await db
      .update(MedicalExpenseTable)
      .set(body)
      .where(eq(MedicalExpenseTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType>>({
      success: true,
      data: data[0],
    });
  },
  "Error at /api/medical-expense/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/medical-expense/[id] — ADMIN only
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/medical-expense/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .delete(MedicalExpenseTable)
      .where(eq(MedicalExpenseTable.id, id))
      .returning();

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Medical expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<MedicalExpenseTableSelectType>>({
      success: true,
      data: data[0],
    });
  },
  "Error at /api/medical-expense/[id] (DELETE)",
  [ROLE.ADMIN],
);
