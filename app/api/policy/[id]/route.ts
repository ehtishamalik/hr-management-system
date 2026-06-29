import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { PolicyTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { PolicyTableInsertType, PolicyTableSelectType } from "@/types";
import type { ApiResponse } from "@/types";

// GET /api/policy/[id] — any authenticated user
export const GET = withAuth(
  async (_request: NextRequest, _ctx: RouteContext<"/api/policy/[id]">) => {
    const { id } = await _ctx.params;

    const [data] = await db
      .select()
      .from(PolicyTable)
      .where(eq(PolicyTable.id, id));

    if (!data) {
      throw new AppError("Policy not found", {
        detail: `No policy found with id: ${id}`,
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<PolicyTableSelectType>>({
      success: true,
      data,
    });
  },
  "Error at api/policy/[id] (GET)",
);

// PUT /api/policy/[id] — ADMIN only
export const PUT = withAuth(
  async (_request: NextRequest, _ctx: RouteContext<"/api/policy/[id]">) => {
    const { id } = await _ctx.params;
    const body: PolicyTableInsertType = await _request.json();

    const [result] = await db
      .update(PolicyTable)
      .set(body)
      .where(eq(PolicyTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<PolicyTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at api/policy/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/policy/[id] — ADMIN only
export const DELETE = withAuth(
  async (_request: NextRequest, _ctx: RouteContext<"/api/policy/[id]">) => {
    const { id } = await _ctx.params;
    const [result] = await db
      .delete(PolicyTable)
      .where(eq(PolicyTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<PolicyTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at api/policy/[id] (DELETE)",
  [ROLE.ADMIN],
);
