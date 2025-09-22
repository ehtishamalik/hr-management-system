import { db } from "@/db/drizzle";
import { LeaveTable, LeaveTypeTable } from "@/db/schema";
import { LEAVE_STATUS, STATUS } from "@/enum";
import { and, eq, inArray, or, sum } from "drizzle-orm";
import { handleError } from "@/lib/error";

import type { CustomResponse } from "@/types";
import type {
  LeaveTableInsertType,
  LeaveYearTableSelectType,
} from "@/db/types";

// Get stats to prevent user from applying more leaves than total.
export const getUserMaxAllowedLeaveStats = async (
  userId: string,
  activeLeaveYear: LeaveYearTableSelectType
): Promise<CustomResponse> => {
  try {
    // Step 1: Fetch all active, non-private leave types
    const leaveTypes = await db
      .select()
      .from(LeaveTypeTable)
      .where(eq(LeaveTypeTable.status, STATUS.ACTIVE));

    // Step 2: Fetch total leave days taken by the user per leave type (only approved)
    const leavesTaken = await db
      .select({
        leaveTypeId: LeaveTable.leaveTypeId,
        taken: sum(LeaveTable.numberOfDays).as("taken"),
      })
      .from(LeaveTable)
      .where(
        and(
          inArray(LeaveTable.leaveStatus, [
            LEAVE_STATUS.APPROVED,
            LEAVE_STATUS.ACCEPTED,
            LEAVE_STATUS.PENDING,
          ]),
          eq(LeaveTable.userId, userId),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id)
        )
      )
      .groupBy(LeaveTable.leaveTypeId);

    // Step 3: Build a map for quick lookup of taken leaves
    const takenMap: Record<string, number> = {};
    for (const row of leavesTaken) {
      takenMap[row.leaveTypeId] = Number(row.taken);
    }

    // Step 4: Prepare per-leave-type stats for the user
    const userLeaves = leaveTypes.map((type) => {
      const taken = takenMap[type.id] || 0;
      return {
        maxAllowed: type.maxAllowed,
        dayFraction: type.dayFraction,
        taken,
      };
    });

    // Step 5: Calculate total allowed and taken
    const totalAllowedLeaves = userLeaves
      .filter(
        (l) =>
          l.maxAllowed !== null && l.dayFraction && Number(l.dayFraction) > 0
      )
      .reduce((sum, l) => sum + (l.maxAllowed as number), 0);

    const totalTakenLeaves = (() => {
      const rawSum = userLeaves
        .filter((l) => l.dayFraction && Number(l.dayFraction) > 0)
        .reduce((sum, l) => sum + l.taken * Number(l.dayFraction), 0);

      const decimalPart = rawSum % 1;

      return decimalPart > 0.75 ? Math.floor(rawSum) + 1 : rawSum;
    })();

    console.log(totalAllowedLeaves, totalTakenLeaves);

    return {
      success: true,
      data: {
        totalAllowedLeaves,
        totalTakenLeaves: Math.trunc(totalTakenLeaves),
      },
    };
  } catch (error) {
    return handleError("getUserMaxAllowedLeaveStats Error", error);
  }
};

export const checkLeaveLimit = async ({
  userId,
  leave,
  activeLeaveYear,
}: {
  userId: string;
  leave: LeaveTableInsertType;
  activeLeaveYear: LeaveYearTableSelectType;
}) => {
  try {
    const { leaveTypeId, numberOfDays } = leave;

    // 1. Get leave type info
    const [leaveType] = await db
      .select({
        id: LeaveTypeTable.id,
        maxAllowed: LeaveTypeTable.maxAllowed,
        dayFraction: LeaveTypeTable.dayFraction,
      })
      .from(LeaveTypeTable)
      .where(
        and(
          eq(LeaveTypeTable.id, leaveTypeId),
          eq(LeaveTypeTable.status, STATUS.ACTIVE)
        )
      );

    // 2. If maxAllowed is not null, check limit
    if (leaveType.maxAllowed !== null) {
      const [existingSum] = await db
        .select({
          totalTaken: sum(LeaveTable.numberOfDays).as("totalTaken"),
        })
        .from(LeaveTable)
        .where(
          and(
            eq(LeaveTable.userId, userId),
            eq(LeaveTable.leaveTypeId, leaveTypeId),
            eq(LeaveTable.leaveYearId, activeLeaveYear.id),
            or(
              eq(LeaveTable.leaveStatus, LEAVE_STATUS.APPROVED),
              eq(LeaveTable.leaveStatus, LEAVE_STATUS.ACCEPTED),
              eq(LeaveTable.leaveStatus, LEAVE_STATUS.PENDING)
            )
          )
        );

      const totalAlreadyTaken = Number(existingSum?.totalTaken ?? 0);
      const newTotal = totalAlreadyTaken + numberOfDays;

      if (newTotal > leaveType.maxAllowed) {
        return {
          success: false,
          error: `Leave limit exceeded. Max ${leaveType.maxAllowed} leaves are allowed, you have already taken ${totalAlreadyTaken} leaves.`,
        };
      }
    }

    const stats = await getUserMaxAllowedLeaveStats(userId, activeLeaveYear);

    if (!stats.success || !stats.data) {
      return stats;
    }

    if (
      stats.data.totalTakenLeaves +
        numberOfDays * Number(leaveType.dayFraction) >
      stats.data.totalAllowedLeaves
    ) {
      return {
        success: false,
        error: `Leave limit exceeded. Max allowed: ${stats.data.totalAllowedLeaves}, already taken: ${stats.data.totalTakenLeaves}.`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return handleError("checkLeaveLimit Error", error);
  }
};
