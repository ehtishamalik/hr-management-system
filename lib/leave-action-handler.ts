import { eq } from "drizzle-orm";
import { wsdb } from "@/db/drizzle";
import { LeaveRemarkTable, LeaveTable } from "@/db/schema";
import { AppError } from "@/lib/errors";
import { getValueFromRequest } from "@/lib/utils";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, SessionType } from "@/types";
import type { LeaveRemarkTableInsertType, LeaveTableSelectType } from "@/types";
import type { LEAVE_STATUS } from "@/enum";

interface UpdateLeaveStatusOptions {
  request: NextRequest;
  session: SessionType;
  newStatus: keyof typeof LEAVE_STATUS;
  systemRemark: string;
  extraRemark?: string;
}

export async function updateLeaveStatus({
  request,
  session,
  newStatus,
  systemRemark,
  extraRemark,
}: UpdateLeaveStatusOptions): Promise<NextResponse<ApiResponse<LeaveTableSelectType>>> {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    throw new AppError("Invalid request.", {
      detail: "Leave ID is required.",
      status: 400,
    });
  }

  const remarks: LeaveRemarkTableInsertType[] = [];

  if (extraRemark) {
    remarks.push({ leaveId: id, remark: extraRemark, userId: session.user.id });
  }

  remarks.push({ leaveId: id, remark: systemRemark, userId: session.user.id });

  const [leave] = await wsdb.transaction(async (tx) => {
    await tx.insert(LeaveRemarkTable).values(remarks);

    return tx
      .update(LeaveTable)
      .set({ leaveStatus: newStatus })
      .where(eq(LeaveTable.id, id))
      .returning();
  });

  if (!leave) {
    throw new AppError("Leave not found.", {
      detail: "No leave found with the given ID.",
      status: 404,
    });
  }

  return NextResponse.json<ApiResponse<LeaveTableSelectType>>({
    success: true,
    data: leave,
  });
}
