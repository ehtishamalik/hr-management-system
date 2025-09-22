import { db } from "@/db/drizzle";
import {
  UserTable,
  LeaveTable,
  LeaveYearTable,
  UserDetailTable,
  LeaveTypeTable,
} from "@/db/schema";
import { STATUS } from "@/enum";
import { emailService } from "@/lib/actions/email";
import { checkLeaveLimit } from "@/lib/api/leave";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";
import type { LeaveTableInsertType } from "@/db/types";

export const GET = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  try {
    if (id) {
      const [data] = await db
        .select()
        .from(LeaveTable)
        .where(eq(LeaveTable.id, id));

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "Leave not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({
        success: true,
        data: data,
      });
    }

    const data = await db.select().from(LeaveTable);
    return NextResponse.json<CustomResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = handleError("Leaves GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const { userId } = body;

    // 1. Get user info and check if he is INACTIVE
    const [user] = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(
        and(eq(UserTable.id, userId), eq(UserDetailTable.status, STATUS.ACTIVE))
      )
      .limit(1);

    if (!user) {
      return NextResponse.json<CustomResponse>(
        {
          success: false,
          error: "User not found. User might not be Active anymore.",
        },
        { status: 404 }
      );
    }

    const [leaveYear] = await db
      .select()
      .from(LeaveYearTable)
      .where(eq(LeaveYearTable.isActive, true));

    if (!leaveYear) {
      return NextResponse.json<CustomResponse>(
        { success: false, error: "No active leave year found." },
        { status: 404 }
      );
    }

    const completedLeave: LeaveTableInsertType = {
      ...body,
      leaveYearId: leaveYear.id,
    };

    const [leaveType] = await db
      .select()
      .from(LeaveTypeTable)
      .where(eq(LeaveTypeTable.id, completedLeave.leaveTypeId));

    if (leaveType.maxAllowed) {
      const response = await checkLeaveLimit({
        userId,
        leave: completedLeave,
        activeLeaveYear: leaveYear,
      });

      if (!response.success) {
        return NextResponse.json<CustomResponse>(response, { status: 404 });
      }
    }

    const result = await db
      .insert(LeaveTable)
      .values({
        fromDate: completedLeave.fromDate,
        toDate: completedLeave.toDate,
        leaveTypeId: completedLeave.leaveTypeId,
        leaveYearId: completedLeave.leaveYearId,
        numberOfDays: completedLeave.numberOfDays,
        reason: completedLeave.reason,
        userId: completedLeave.userId,
        leaveStatus: completedLeave.leaveStatus,
      })
      .returning();

    if (user.user_detail?.teamLeadId) {
      const [teamLead] = await db
        .select()
        .from(UserTable)
        .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
        .where(
          and(
            eq(UserTable.id, user.user_detail?.teamLeadId),
            eq(UserDetailTable.status, STATUS.ACTIVE)
          )
        );

      if (teamLead) {
        emailService.sendLeaveRequestEmail({
          email: teamLead.user.email,
          leave: completedLeave,
          user,
        });
      }
    }

    return NextResponse.json<CustomResponse>(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Leaves POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

export const PUT = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    return NextResponse.json<CustomResponse>(
      { success: false, error: "Missing 'id' in query parameters." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const updatedData = {
      ...body,
      updatedAt: new Date(),
    };

    const [result] = await db
      .update(LeaveTable)
      .set(updatedData)
      .where(eq(LeaveTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leaves PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

export const DELETE = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    return NextResponse.json<CustomResponse>(
      { success: false, error: "Missing 'id' in query parameters." },
      { status: 400 }
    );
  }

  try {
    const [result] = await db
      .delete(LeaveTable)
      .where(eq(LeaveTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leaves DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
