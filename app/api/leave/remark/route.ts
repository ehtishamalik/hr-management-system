import { asc, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { db } from "@/db/drizzle";
import { LeaveRemarkTable, LeaveTable, user as UserTable } from "@/db/schema";
import { AppError, ForbiddenError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type { LeaveRemarkTableSelectType, UserTableSelectType } from "@/types";

// GET /api/leave/remark?leaveId=<id>
// Non-ADMIN must provide leaveId and it must belong to them
export const GET = withAuth(async (request: NextRequest, _ctx, _session) => {
  const leaveId = getValueFromRequest(request, "leaveId");
  const isAdmin = _session.user.role === ROLE.ADMIN;

  if (!leaveId) {
    if (!isAdmin) {
      throw new AppError("leaveId is required", {
        detail: "Please provide a leaveId query parameter.",
        status: 400,
      });
    }

    // ADMIN can get all remarks without a filter
    const data = await db.select().from(LeaveRemarkTable);
    return NextResponse.json<ApiResponse<LeaveRemarkTableSelectType[]>>({
      success: true,
      data,
    });
  }

  // For non-ADMIN: verify the leave belongs to them
  if (!isAdmin) {
    const [leave] = await db
      .select({ userId: LeaveTable.userId })
      .from(LeaveTable)
      .where(eq(LeaveTable.id, leaveId))
      .limit(1);

    if (!leave) {
      throw new AppError("Leave not found.", {
        detail: "No leave found with the given ID.",
        status: 404,
      });
    }

    if (leave.userId !== _session.user.id) {
      throw new ForbiddenError(
        "You can only view remarks for your own leaves.",
      );
    }
  }

  const data = await db
    .select()
    .from(LeaveRemarkTable)
    .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
    .where(eq(LeaveRemarkTable.leaveId, leaveId))
    .orderBy(asc(LeaveRemarkTable.createdAt));

  return NextResponse.json<
    ApiResponse<
      {
        leave_remark: LeaveRemarkTableSelectType;
        user: UserTableSelectType | null;
      }[]
    >
  >({ success: true, data });
}, "Error at /api/leave/remark (GET)");

// POST /api/leave/remark — any authenticated user (userId pinned to session)
export const POST = withAuth(async (request: NextRequest, _ctx, session) => {
  const body = await request.json();

  const [inserted] = await db
    .insert(LeaveRemarkTable)
    .values({
      leaveId: body.leaveId,
      remark: body.remark,
      userId: session.user.id,
    })
    .returning({ id: LeaveRemarkTable.id });

  const [data] = await db
    .select()
    .from(LeaveRemarkTable)
    .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
    .where(eq(LeaveRemarkTable.id, inserted.id));

  return NextResponse.json<
    ApiResponse<{
      leave_remark: LeaveRemarkTableSelectType;
      user: UserTableSelectType | null;
    }>
  >({ success: true, data }, { status: 201 });
}, "Error at /api/leave/remark (POST)");
