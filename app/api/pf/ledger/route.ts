import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { AppError, ForbiddenError } from "@/lib/errors";
import { createPFWithdrawal, createManualPFEntry } from "@/services/pf";
import { getValueFromRequest } from "@/lib/utils";
import { PF_TRANSACTION_TYPE } from "@/enum";
import type {
  ApiResponse,
  PFLedgerTableInsertType,
  PFLedgerTableSelectType,
} from "@/types";
import { getPFLedgerByUserQuery } from "@/queries/pf";

// GET /api/pf/ledger?userId=<id>&month=5&year=2025
// ADMIN: any user | USER: own only
export const GET = withAuth(async (request: NextRequest, _ctx, session) => {
  const isAdmin = session.user.role === ROLE.ADMIN;
  const userId = getValueFromRequest(request, "userId");

  if (!userId) {
    throw new AppError("userId is required.", {
      status: 400,
      detail: "Provide ?userId= query param.",
    });
  }

  if (!isAdmin && session.user.id !== userId) {
    throw new ForbiddenError("You can only view your own PF ledger.");
  }

  const monthStr = getValueFromRequest(request, "month");
  const yearStr = getValueFromRequest(request, "year");

  const month = monthStr ? parseInt(monthStr, 10) : undefined;
  const year = yearStr ? parseInt(yearStr, 10) : undefined;

  const data = await getPFLedgerByUserQuery({ userId, month, year });
  return NextResponse.json<ApiResponse<PFLedgerTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at /api/pf/ledger (GET)");

// POST /api/pf/ledger → ADMIN only
// transactionType: "withdrawal" | "monthly_contribution"
// Use monthly_contribution for manual/historical back-fill.
export const POST = withAuth(
  async (request: NextRequest, _ctx, session) => {
    const body: PFLedgerTableInsertType = await request.json();

    if (!body.userId || !body.transactionType || !body.month || !body.year) {
      throw new AppError("Missing required fields.", {
        status: 400,
        detail: "userId, transactionType, month, year are required.",
      });
    }

    let data: PFLedgerTableSelectType;

    if (body.transactionType === PF_TRANSACTION_TYPE.withdrawal) {
      if (body.withdrawalAmount == null) {
        throw new AppError("Provide amount for withdrawals.", {
          detail: "Amount is required for withdrawals.",
          status: 400,
        });
      }
      data = await createPFWithdrawal({
        userId: body.userId,
        amount: Number(body.withdrawalAmount),
        month: body.month,
        year: body.year,
        processedBy: session.user.id,
        remarks: body.remarks ?? undefined,
      });
    } else if (
      body.transactionType === PF_TRANSACTION_TYPE.monthly_contribution
    ) {
      if (body.employeeContribution == null) {
        throw new AppError(
          "Provide employee contribution for manual entries.",
          {
            detail: "Employee contribution is required for manual entries.",
            status: 400,
          },
        );
      }
      data = await createManualPFEntry({
        userId: body.userId,
        employeeContribution: Number(body.employeeContribution),
        companyContribution: Number(body.companyContribution ?? 0),
        month: body.month,
        year: body.year,
        processedBy: session.user.id,
        remarks: body.remarks ?? undefined,
      });
    } else {
      throw new AppError("Invalid transactionType.", {
        status: 400,
        detail:
          "transactionType must be 'withdrawal' or 'monthly_contribution'.",
      });
    }

    return NextResponse.json<ApiResponse<PFLedgerTableSelectType>>(
      { success: true, data },
      { status: 201 },
    );
  },
  "Error at /api/pf/ledger (POST)",
  [ROLE.ADMIN],
);
