import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { emailService } from "@/lib/actions/email";
import { AppError } from "@/lib/errors";
import { getActiveLeaveYear } from "@/lib/utils";
import { LeaveTable } from "@/db/schema";
import { LEAVES } from "@/constants/leaves";
import { calculateLeavesTaken } from "@/lib/logic/leave-calculator";
import { getUserProfileQuery } from "@/queries/user";

import type {
  LeaveTableInsertType,
  SessionType,
  UserTableSelectType,
  UserType,
} from "@/types";

export const checkUserExist = async (userId: string) => {
  const [user] = await getUserProfileQuery(userId);

  if (!user) {
    throw new AppError("Employee not found.", {
      detail: "Employee might not be Active anymore.",
      status: 404,
    });
  }

  return user;
};

export const checkPostRequest = async (
  leave: LeaveTableInsertType,
  session: SessionType,
) => {
  const activeLeaveYear = getActiveLeaveYear();

  // 1. Get leave type from CONSTANTS
  const leaveType = LEAVES.find((l) => l.id === leave.leaveTypeId);

  if (!leaveType) {
    throw new AppError("Leave type not found.", {
      detail: "Invalid leave type ID.",
      status: 404,
    });
  }

  // 2. Check if user can apply for this leave type
  if (!leaveType.userCanApply && session.user.role !== ROLE.ADMIN) {
    throw new AppError("Cannot apply for this leave type.", {
      detail: `${leaveType.name} can only be assigned by admin.`,
      status: 403,
    });
  }

  // 3. Fetch ALL existing leaves for this user in this year (Pending, Accepted, Approved, Late)
  const allExistingLeaves = await db
    .select({
      id: LeaveTable.id,
      leaveTypeId: LeaveTable.leaveTypeId,
      numberOfDays: LeaveTable.numberOfDays,
    })
    .from(LeaveTable)
    .where(
      and(
        eq(LeaveTable.userId, leave.userId),
        eq(LeaveTable.leaveYear, activeLeaveYear),
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.PENDING,
          LEAVE_STATUS.ACCEPTED,
          LEAVE_STATUS.APPROVED,
          LEAVE_STATUS.LATE,
        ]),
      ),
    );

  // Group existing leaves for the calculator
  const allLeavesByType: Record<string, { numberOfDays: number }[]> = {};
  for (const l of allExistingLeaves) {
    if (!allLeavesByType[l.leaveTypeId]) {
      allLeavesByType[l.leaveTypeId] = [];
    }
    allLeavesByType[l.leaveTypeId].push(l);
  }

  // Add the new request to the grouping
  if (!allLeavesByType[leave.leaveTypeId]) {
    allLeavesByType[leave.leaveTypeId] = [];
  }
  allLeavesByType[leave.leaveTypeId].push({
    numberOfDays: leave.numberOfDays,
  });

  // 4. Check if any leave type limit is exceeded
  // This loop handles both the current leave type and any types impacted by redistribution (like half-day)
  for (const type of LEAVES) {
    if (type.maxAllowed !== null) {
      const taken = calculateLeavesTaken(type, allLeavesByType, LEAVES);

      if (taken > type.maxAllowed) {
        // Customize error message for better UX when half-day impacts other balances
        const isHalfDayRequest = leave.leaveTypeId === "half-day";
        const detail = isHalfDayRequest
          ? `You don't have enough ${type.name} quota left to request a half-day. Max ${type.maxAllowed} allowed, total would reach ${taken}.`
          : `Max ${type.maxAllowed} ${type.name} allowed. You have already taken ${taken - leave.numberOfDays} days. This request would bring your total to ${taken}.`;

        throw new AppError("Leave limit exceeded.", {
          detail,
          status: 400,
        });
      }
    }
  }
};

export const sendPostEmail = async (
  leave: LeaveTableInsertType,
  user: UserType & {
    team_lead: UserTableSelectType | null;
  },
) => {
  if (user.team_lead?.email) {
    emailService.sendLeaveRequestEmail({
      email: user.team_lead.email,
      leave,
      user,
    });
  }
};
