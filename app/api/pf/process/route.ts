import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { AppError, ForbiddenError } from "@/lib/errors";
import { processMonthlyPF, getMonthlyProcessingHistory } from "@/services/pf";
import { getValueFromRequest } from "@/lib/utils";
import type { ApiResponse } from "@/types";
import type { ProcessMonthlyPFResult } from "@/services/pf";

// GET /api/pf/process?month=5&year=2025 → ADMIN only: processing history for a month
export const GET = withAuth(
  async (request: NextRequest, _ctx) => {
    const monthStr = getValueFromRequest(request, "month");
    const yearStr = getValueFromRequest(request, "year");

    if (!monthStr || !yearStr) {
      throw new AppError("month and year are required.", {
        status: 400,
        detail: "Provide ?month=&year= query params.",
      });
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (Number.isNaN(month) || month < 1 || month > 12) {
      throw new AppError("Invalid month.", {
        status: 400,
        detail: "month must be 1–12.",
      });
    }
    if (Number.isNaN(year) || year < 2000) {
      throw new AppError("Invalid year.", {
        status: 400,
        detail: "year must be a valid 4-digit year.",
      });
    }

    const data = await getMonthlyProcessingHistory(month, year);
    return NextResponse.json<ApiResponse<typeof data>>({ success: true, data });
  },
  "Error at /api/pf/process (GET)",
  [ROLE.ADMIN],
);

// POST /api/pf/process → ADMIN only: trigger monthly batch
export const POST = withAuth(async (request: NextRequest, _ctx, session) => {
  if (session.user.role !== ROLE.ADMIN) {
    throw new ForbiddenError("Only admins can process PF.");
  }

  const body: { month: number; year: number } = await request.json();

  if (!body.month || !body.year) {
    throw new AppError("month and year are required.", {
      status: 400,
      detail: "Provide month and year in request body.",
    });
  }

  if (body.month < 1 || body.month > 12) {
    throw new AppError("Invalid month.", {
      status: 400,
      detail: "month must be 1–12.",
    });
  }

  const result = await processMonthlyPF({
    month: body.month,
    year: body.year,
    processedBy: session.user.id,
  });

  return NextResponse.json<ApiResponse<ProcessMonthlyPFResult>>(
    { success: true, data: result },
    { status: 201 },
  );
}, "Error at /api/pf/process (POST)");
