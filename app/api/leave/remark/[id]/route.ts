import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LeaveRemarkTable, user as UserTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type { LeaveRemarkTableSelectType, UserTableSelectType } from "@/types";

// GET api/leave/remark/[id]
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/remark/[id]">,
  ) => {
    const { id } = await _ctx.params;

    const [data] = await db
      .select()
      .from(LeaveRemarkTable)
      .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
      .where(eq(LeaveRemarkTable.id, id))
      .limit(1);

    if (!data) {
      throw new AppError("Leave remark not found.", {
        detail: "No leave remark found with the given ID.",
        status: 404,
      });
    }

    return NextResponse.json<
      ApiResponse<{
        leave_remark: LeaveRemarkTableSelectType;
        user: UserTableSelectType | null;
      }>
    >({
      success: true,
      data: data,
    });
  },
  "Error at /api/leave/remark/[id] (GET)",
);

// PUT api/leave/remark/[id]
export const PUT = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/remark/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const body = await _request.json();

    const [result] = await db
      .update(LeaveRemarkTable)
      .set(body)
      .where(eq(LeaveRemarkTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<LeaveRemarkTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at /api/leave/remark/[id] (PUT)",
);

//  DELETE api/leave/remark/[id]
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/remark/[id]">,
  ) => {
    const { id } = await _ctx.params;
    const [result] = await db
      .delete(LeaveRemarkTable)
      .where(eq(LeaveRemarkTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<LeaveRemarkTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at /api/leave/remark/[id] (DELETE)",
);
