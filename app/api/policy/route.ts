import { db } from "@/db/drizzle";
import { PolicyTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { PolicyTableInsertType, PolicyTableSelectType } from "@/types";
import type { ApiResponse } from "@/types";

// GET /api/policy — any authenticated user
export const GET = withAuth(async () => {
  const data = await db.select().from(PolicyTable);
  return NextResponse.json<ApiResponse<PolicyTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at api/policy (GET)");

// POST /api/policy — ADMIN only
export const POST = withAuth(
  async (request: NextRequest) => {
    const body: PolicyTableInsertType = await request.json();

    const result = await db.insert(PolicyTable).values(body).returning();

    return NextResponse.json<ApiResponse<PolicyTableSelectType>>({
      success: true,
      data: result[0],
    });
  },
  "Error at api/policy (POST)",
  [ROLE.ADMIN],
);
