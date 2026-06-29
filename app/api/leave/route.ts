import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LeaveTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { checkPostRequest, checkUserExist, sendPostEmail } from "./service";
import { ROLE } from "@/enum";
import { ForbiddenError } from "@/lib/errors";

import { type NextRequest, NextResponse } from "next/server";
import type { LeaveTableInsertType, LeaveTableSelectType } from "@/types";
import type { ApiResponse } from "@/types";

// GET /api/leave
// - No filter → ADMIN only
// - ?userId= → own data or ADMIN
export const GET = withAuth(async (request: NextRequest, _ctx, _session) => {
  const userId = getValueFromRequest(request, "userId");
  const isAdmin = _session.user.role === ROLE.ADMIN;

  if (userId) {
    // Non-ADMIN can only query their own leaves
    if (!isAdmin && _session.user.id !== userId) {
      throw new ForbiddenError("You can only view your own leaves.");
    }

    const leaves = await db
      .select()
      .from(LeaveTable)
      .where(eq(LeaveTable.userId, userId));

    return NextResponse.json<ApiResponse<LeaveTableSelectType[]>>({
      success: true,
      data: leaves,
    });
  }

  // No filter — ADMIN only
  if (!isAdmin) {
    throw new ForbiddenError("You do not have permission to list all leaves.");
  }

  const data = await db.select().from(LeaveTable);
  return NextResponse.json<ApiResponse<LeaveTableSelectType[]>>({
    success: true,
    data,
  });
}, "Error at /api/leave (GET)");

// POST /api/leave — any authenticated user
export const POST = withAuth(async (request: NextRequest, _ctx, _session) => {
  const body: LeaveTableInsertType = await request.json();

  const user = await checkUserExist(body.userId);

  await checkPostRequest(body, _session);

  const result = await db.insert(LeaveTable).values(body).returning();

  sendPostEmail(body, user);

  return NextResponse.json<ApiResponse<LeaveTableSelectType>>(
    { success: true, data: result[0] },
    { status: 201 },
  );
}, "Error at /api/leave (POST)");
