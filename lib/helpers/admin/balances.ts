import { db } from "@/db/drizzle";
import {
  LeaveTable,
  UserTable,
  UserDetailTable,
  LeaveTypeTable,
} from "@/db/schema";
import { LEAVE_STATUS, STATUS } from "@/enum";
import { and, eq, sum } from "drizzle-orm";
import { handleErrorWithSlack } from "@/lib/error";
import { getActiveLeaveYear } from "@/lib/helpers/common";

// Normal every user's stats about the normal leaves they have taken.
export const getUserLeaveStats = async (userId: string) => {
  try {
    const activeLeaveYear = await getActiveLeaveYear();

    const leaveTypes = await db
      .select()
      .from(LeaveTypeTable)
      .where(
        and(
          eq(LeaveTypeTable.status, STATUS.ACTIVE),
          eq(LeaveTypeTable.systemGenerated, true)
        )
      );

    // Get total number of days taken per leave type
    const leavesTaken = await db
      .select({
        leaveTypeId: LeaveTable.leaveTypeId,
        taken: sum(LeaveTable.numberOfDays).as("taken"),
      })
      .from(LeaveTable)
      .where(
        and(
          eq(LeaveTable.userId, userId),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id),
          eq(LeaveTable.leaveStatus, LEAVE_STATUS.APPROVED)
        )
      )
      .groupBy(LeaveTable.leaveTypeId);

    // Map the results
    const takenMap: Record<string, number> = {};
    for (const row of leavesTaken) {
      takenMap[row.leaveTypeId] = Number(row.taken);
    }

    // Combine leave types with taken days
    return leaveTypes.map((type) => ({
      id: type.id,
      name: type.name,
      maxAllowed: type.maxAllowed,
      taken: takenMap[type.id] || 0,
    }));
  } catch (error) {
    handleErrorWithSlack("getUserLeaveStats Error", error);
    return [];
  }
};

// Stats of all the users
export const getAllActiveUsersWithLeaveStats = async () => {
  try {
    const activeLeaveYear = await getActiveLeaveYear();

    // Step 1: Fetch active users
    const activeUser = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(eq(UserDetailTable.status, STATUS.ACTIVE));

    // Step 2: Fetch all active, non-private leave types
    const leaveTypes = await db
      .select()
      .from(LeaveTypeTable)
      .where(eq(LeaveTypeTable.status, STATUS.ACTIVE));

    // Step 3: Fetch total leave days taken per user per leave type
    const leavesTaken = await db
      .select({
        userId: LeaveTable.userId,
        leaveTypeId: LeaveTable.leaveTypeId,
        taken: sum(LeaveTable.numberOfDays).as("taken"),
      })
      .from(LeaveTable)
      .where(
        and(
          eq(LeaveTable.leaveStatus, LEAVE_STATUS.APPROVED),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id)
        )
      )
      .groupBy(LeaveTable.userId, LeaveTable.leaveTypeId);

    // Step 4: Build a lookup for leaves taken
    const takenMap: Record<string, Record<string, number>> = {};
    for (const row of leavesTaken) {
      if (!takenMap[row.userId]) {
        takenMap[row.userId] = {};
      }
      takenMap[row.userId][row.leaveTypeId] = Number(row.taken);
    }

    // Step 5: Combine into final result
    return activeUser.map(({ user, user_detail }) => {
      const userLeaves = leaveTypes.map((type) => {
        const taken = takenMap[user.id]?.[type.id] || 0;
        return {
          leaveTypeId: type.id,
          leaveTypeName: type.name,
          maxAllowed: type.maxAllowed,
          dayFraction: type.dayFraction,
          taken,
        };
      });

      // Sort by the name first
      userLeaves.sort((a, b) => a.leaveTypeName.localeCompare(b.leaveTypeName));

      // ✅ Only count leaves with a valid dayFraction (> 0) for totals
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

      return {
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: user_detail?.role,
        leaveStats: userLeaves,
        totalAllowedLeaves,
        totalTakenLeaves,
      };
    });
  } catch (error) {
    handleErrorWithSlack("getAllActiveUsersWithLeaveStats Error", error);
    return null;
  }
};
