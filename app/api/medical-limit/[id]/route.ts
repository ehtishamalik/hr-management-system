import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { AppError } from "@/lib/errors";
import { MedicalLimitTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, MedicalLimitTableSelectType } from "@/types";

// GET /api/medical-limit/[id] — any authenticated user
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/medical-limit/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .select()
      .from(MedicalLimitTable)
      .where(eq(MedicalLimitTable.id, id))
      .limit(1);

    if (data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Medical limit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<MedicalLimitTableSelectType>>({
      success: true,
      data: data[0],
    });
  },
  "Error at /api/medical-limit/[id] (GET)",
);

// PUT /api/medical-limit/[id] — ADMIN only
export const PUT = withAuth(
  async (
    request: NextRequest,
    _ctx: RouteContext<"/api/medical-limit/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const body: Partial<{ year: number; amount: string }> =
      await request.json();

    const data = await db
      .update(MedicalLimitTable)
      .set(body)
      .where(eq(MedicalLimitTable.id, id))
      .returning();

    if (data.length === 0) {
      throw new AppError("Medical limit not found", {
        detail: `No medical limit found with id: ${id}`,
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<MedicalLimitTableSelectType>>({
      success: true,
      data: data[0],
    });
  },
  "Error at /api/medical-limit/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/medical-limit/[id] — ADMIN only
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/medical-limit/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .delete(MedicalLimitTable)
      .where(eq(MedicalLimitTable.id, id))
      .returning();

    if (data.length === 0) {
      throw new AppError("Medical limit not found", {
        detail: `No medical limit found with id: ${id}`,
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<MedicalLimitTableSelectType>>({
      success: true,
      data: data[0],
    });
  },
  "Error at /api/medical-limit/[id] (DELETE)",
  [ROLE.ADMIN],
);
