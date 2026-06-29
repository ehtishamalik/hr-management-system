import { eq } from "drizzle-orm";
import { db, wsdb } from "@/db/drizzle";
import { LeaveRemarkTable, LeaveTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError, ForbiddenError } from "@/lib/errors";
import { checkDeleteRequest, checkPutRequest } from "./service";
import { formatDateWithDay, getRoleStatues } from "@/lib/utils";
import { LEAVE_STATUS, ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  LeaveTableInsertType,
  LeaveTableSelectType,
  SessionType,
} from "@/types";

// GET /api/leave/[id] — own data or ADMIN
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .select()
      .from(LeaveTable)
      .where(eq(LeaveTable.id, id));

    if (data.length === 0) {
      throw new AppError("Leave not found.", {
        detail: "No leave found with the given ID.",
        status: 404,
      });
    }

    const leave = data[0];

    if (
      _session.user.role !== ROLE.ADMIN &&
      leave.userId !== _session.user.id
    ) {
      throw new ForbiddenError("You can only view your own leaves.");
    }

    return NextResponse.json<ApiResponse<LeaveTableSelectType>>({
      success: true,
      data: leave,
    });
  },
  "Error at /api/leave/[id] (GET)",
);

// PUT /api/leave/[id] — own data or ADMIN
export const PUT = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/[id]">,
    _session: SessionType,
  ) => {
    const { id } = await _ctx.params;

    const body: LeaveTableInsertType = await _request.json();

    const previousLeave = await checkPutRequest(id, body, _session);

    const leave = await wsdb.transaction(async (tx) => {
      const changes = [];
      const isFromDateChange = previousLeave.fromDate !== body.fromDate;
      const isToDateChange = previousLeave.toDate !== body.toDate;
      const isReasonChange = previousLeave.reason !== body.reason;
      const isLeaveTypeChange = previousLeave.leaveTypeId !== body.leaveTypeId;
      const isDateChange = isFromDateChange || isToDateChange;

      if (isFromDateChange)
        changes.push(
          `Updated From Date from ${formatDateWithDay(previousLeave.fromDate)} to ${formatDateWithDay(body.fromDate)}`,
        );
      if (isToDateChange)
        changes.push(
          `Updated To Date from ${formatDateWithDay(previousLeave.toDate)} to ${formatDateWithDay(body.toDate)}`,
        );
      if (isReasonChange) changes.push(`Updated Reason`);
      if (isLeaveTypeChange) changes.push(`Updated Leave Type`);

      if (changes.length > 0) {
        await tx.insert(LeaveRemarkTable).values({
          leaveId: id,
          remark: `${changes.join(". ")}`,
          userId: _session.user.id,
        });
      }

      const { isAdmin } = getRoleStatues(_session);

      const [leave] = await tx
        .update(LeaveTable)
        .set({
          ...body,
          leaveStatus:
            isDateChange && !isAdmin
              ? LEAVE_STATUS.PENDING
              : previousLeave.leaveStatus,
        })
        .where(eq(LeaveTable.id, id))
        .returning();

      return leave;
    });

    return NextResponse.json<ApiResponse<LeaveTableSelectType>>({
      success: true,
      data: leave,
    });
  },
  "Error at /api/leave/[id] (PUT)",
);

// DELETE /api/leave/[id] — own data or ADMIN
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;

    await checkDeleteRequest(id, _session);

    const [leave] = await db
      .delete(LeaveTable)
      .where(eq(LeaveTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<LeaveTableSelectType>>({
      success: true,
      data: leave,
    });
  },
  "Error at /api/leave/[id] (DELETE)",
);
