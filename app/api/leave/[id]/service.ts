import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LeaveTable } from "@/db/schema";
import { LEAVES } from "@/constants/leaves";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { AppError } from "@/lib/errors";
import {
  getActiveLeaveYear,
  getLeaveStatues,
  getRoleStatues,
} from "@/lib/utils";
import { calculateLeavesTaken } from "@/lib/logic/leave-calculator";

import type { LeaveTableInsertType, SessionType } from "@/types";

export const checkPutRequest = async (
  leaveId: string,
  updatedLeave: LeaveTableInsertType,
  session: SessionType,
) => {
  // Verify that the requester is the owner of the leave
  const [leave] = await db
    .select()
    .from(LeaveTable)
    .where(eq(LeaveTable.id, leaveId));

  const { isPending, isAccepted, isApproved } = getLeaveStatues(
    leave.leaveStatus,
  );
  const isOwner = leave.userId === session.user.id;
  const { isAdmin } = getRoleStatues(session);

  const isOwnerCanEdit = isOwner && (isPending || isAccepted);
  const isAdminCanEdit = isAdmin && (isPending || isAccepted || isApproved);

  if (!leave) {
    throw new AppError("Leave not found.", {
      detail: "Leave does not exist.",
      status: 404,
    });
  }

  if (!isOwnerCanEdit && !isAdminCanEdit) {
    throw new AppError("Unauthorized.", {
      detail: "You are not authorized to edit this leave request.",
      status: 403,
    });
  }

  // Validate leave limits similar to POST, but exclude the current leave
  const activeLeaveYear = getActiveLeaveYear();
  const leaveType = LEAVES.find((l) => l.id === updatedLeave.leaveTypeId);
  if (!leaveType) {
    throw new AppError("Leave type not found.", {
      detail: "Invalid leave type ID.",
      status: 404,
    });
  }

  // Check if user can apply for this leave type
  if (!leaveType.userCanApply && session.user.role !== ROLE.ADMIN) {
    throw new AppError("Cannot apply for this leave type.", {
      detail: `${leaveType.name} can only be assigned by admin.`,
      status: 403,
    });
  }

  // Fetch ALL existing leaves for this user in this year (Pending, Accepted, Approved, Late), excluding the one being edited
  const allExistingLeaves = await db
    .select({
      id: LeaveTable.id,
      leaveTypeId: LeaveTable.leaveTypeId,
      numberOfDays: LeaveTable.numberOfDays,
    })
    .from(LeaveTable)
    .where(
      and(
        eq(LeaveTable.userId, updatedLeave.userId),
        eq(LeaveTable.leaveYear, activeLeaveYear),
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.PENDING,
          LEAVE_STATUS.ACCEPTED,
          LEAVE_STATUS.APPROVED,
          LEAVE_STATUS.LATE,
        ]),
      ),
    );

  // Group leaves, excluding the current one
  const allLeavesByType: Record<string, { numberOfDays: number }[]> = {};
  for (const l of allExistingLeaves) {
    if (l.id === leaveId) continue;
    if (!allLeavesByType[l.leaveTypeId]) {
      allLeavesByType[l.leaveTypeId] = [];
    }
    allLeavesByType[l.leaveTypeId].push(l);
  }

  // Add the updated version
  if (!allLeavesByType[updatedLeave.leaveTypeId]) {
    allLeavesByType[updatedLeave.leaveTypeId] = [];
  }
  allLeavesByType[updatedLeave.leaveTypeId].push({
    numberOfDays: updatedLeave.numberOfDays,
  });

  // Check if any leave type limit is exceeded
  for (const type of LEAVES) {
    if (type.maxAllowed !== null) {
      const taken = calculateLeavesTaken(type, allLeavesByType, LEAVES);

      if (taken > type.maxAllowed) {
        // Customize error message for better UX when half-day impacts other balances
        const isHalfDayRequest = updatedLeave.leaveTypeId === "half-day";
        const detail = isHalfDayRequest
          ? `You don't have enough ${type.name} quota left to cover this half-day. Max ${type.maxAllowed} allowed, total would reach ${taken}.`
          : `Max ${type.maxAllowed} ${type.name} allowed. This update would bring your total to ${taken}.`;

        throw new AppError("Leave limit exceeded.", {
          detail,
          status: 400,
        });
      }
    }
  }

  return leave;
};

export const checkDeleteRequest = async (
  leaveId: string,
  session: SessionType,
) => {
  const [leave] = await db
    .select()
    .from(LeaveTable)
    .where(eq(LeaveTable.id, leaveId));

  if (!leave) {
    throw new AppError("Leave not found.", {
      detail: "The leave you are trying to delete does not exist.",
      status: 404,
    });
  }

  if (
    session.user.role === ROLE.ADMIN &&
    leave.leaveStatus === LEAVE_STATUS.LATE
  ) {
    return;
  }

  if (leave.leaveStatus !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending leaves can be deleted.", {
      detail: `The current status is ${leave.leaveStatus}.`,
      status: 400,
    });
  }
};
