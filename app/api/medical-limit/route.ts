import { desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { MedicalLimitTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { AppError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  MedicalLimitTableInsertType,
  MedicalLimitTableSelectType,
} from "@/types";

// GET /api/medical-limit — any authenticated user
export const GET = withAuth(async (request: NextRequest) => {
  const year = getValueFromRequest(request, "year");

  if (year) {
    const existing = await db
      .select()
      .from(MedicalLimitTable)
      .where(eq(MedicalLimitTable.year, Number.parseInt(year, 10)))
      .limit(1);

    if (existing.length === 0) {
      throw new AppError("Limit not found", {
        detail: `No limit found with year: ${year}`,
        status: 404,
      });
    }
    return NextResponse.json({
      success: true,
      data: existing[0],
    });
  }

  const data = await db
    .select()
    .from(MedicalLimitTable)
    .orderBy(desc(MedicalLimitTable.year));

  return NextResponse.json<ApiResponse<MedicalLimitTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at /api/medical-limit (GET)");

// POST /api/medical-limit — ADMIN only
export const POST = withAuth(
  async (request: NextRequest) => {
    const body: MedicalLimitTableInsertType = await request.json();

    const result = await db.insert(MedicalLimitTable).values(body).returning();

    return NextResponse.json<ApiResponse<MedicalLimitTableSelectType>>({
      success: true,
      data: result[0],
    });
  },
  "Error at /api/medical-limit (POST)",
  [ROLE.ADMIN],
);
