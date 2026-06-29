import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LateArrivalTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { checkPostRequest } from "./service";
import { ROLE } from "@/enum";
import { ForbiddenError } from "@/lib/errors";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  LateArrivalTableInsertType,
  LateArrivalTableSelectType,
} from "@/types";

// GET /api/late-arrival
// - No filter → ADMIN only
// - ?userId= → own data or ADMIN
export const GET = withAuth(async (request: NextRequest, _ctx, _session) => {
  const userId = getValueFromRequest(request, "userId");
  const isAdmin = _session.user.role === ROLE.ADMIN;

  if (userId) {
    if (!isAdmin && _session.user.id !== userId) {
      throw new ForbiddenError(
        "You can only view your own late arrival records.",
      );
    }

    const lateArrivals = await db
      .select()
      .from(LateArrivalTable)
      .where(eq(LateArrivalTable.userId, userId));

    return NextResponse.json<ApiResponse<LateArrivalTableSelectType[]>>({
      success: true,
      data: lateArrivals,
    });
  }

  if (!isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to list all late arrival records.",
    );
  }

  const data = await db.select().from(LateArrivalTable);
  return NextResponse.json<ApiResponse<LateArrivalTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at /api/late-arrival (GET)");

// POST /api/late-arrival — ADMIN only
export const POST = withAuth(
  async (request: NextRequest, _ctx, _session) => {
    const body: LateArrivalTableInsertType = await request.json();

    await checkPostRequest(body);

    const result = await db.insert(LateArrivalTable).values(body).returning();

    return NextResponse.json<ApiResponse<LateArrivalTableSelectType>>(
      { success: true, data: result[0] },
      { status: 201 },
    );
  },
  "Error at /api/late-arrival (POST)",
  [ROLE.ADMIN],
);
