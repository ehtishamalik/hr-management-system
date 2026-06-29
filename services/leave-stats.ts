import { handleErrorWithSlack } from "@/lib/error-handling";
import { getActiveLeaveYear } from "@/lib/utils";
import { getActiveUsersQuery } from "@/queries/user";
import {
  getAllUserTakenLeavesQuery,
  getLeavesTakenByUser,
} from "@/queries/leave";
import {
  getTeamLeadStatsLeaveTypesQuery,
  getUserStatsLeaveTypesQuery,
} from "@/queries/leave-type";
import { getUnresolvedLateArrivalsQuery } from "@/queries/late-arrival";
import { calculateLeavesTaken } from "@/lib/logic/leave-calculator";

import type { LeaveCardItem } from "@/types";

export async function getUserLeaveStats(
  userId: string,
  isUser: boolean = true,
): Promise<LeaveCardItem[]> {
  const activeYear = getActiveLeaveYear();

  try {
    const [leaveTypes, leavesTaken] = await Promise.all([
      isUser
        ? getUserStatsLeaveTypesQuery()
        : getTeamLeadStatsLeaveTypesQuery(),
      getLeavesTakenByUser(userId, activeYear),
    ]);

    // Group leaves by type for calculation
    const leavesByType: Record<string, typeof leavesTaken> = {};
    for (const leave of leavesTaken) {
      if (!leavesByType[leave.leaveTypeId]) {
        leavesByType[leave.leaveTypeId] = [];
      }
      leavesByType[leave.leaveTypeId].push(leave);
    }

    return leaveTypes.map((type) => ({
      id: type.id,
      name: type.name,
      maxAllowed: type.maxAllowed,
      taken: calculateLeavesTaken(type, leavesByType, leaveTypes),
    }));
  } catch (error) {
    handleErrorWithSlack("getUserLeaveStats failed", error);
    throw error;
  }
}

// Stats of all the users
export const getAllActiveUsersWithLeaveStats = async () => {
  try {
    const activeLeaveYear = getActiveLeaveYear();

    // Step 1: Fetch active users
    const activeUsers = await getActiveUsersQuery();

    // Step 2: Fetch all dashboard leave types (from constants)
    const leaveTypes = await getUserStatsLeaveTypesQuery();

    // Step 3: Fetch detailed leave records for calculation
    const leavesTaken = await getAllUserTakenLeavesQuery(activeLeaveYear);

    // Step 4: Group leaves by User -> LeaveType
    const leavesByUserAndType: Record<
      string,
      Record<string, typeof leavesTaken>
    > = {};

    for (const leave of leavesTaken) {
      if (!leavesByUserAndType[leave.userId]) {
        leavesByUserAndType[leave.userId] = {};
      }
      if (!leavesByUserAndType[leave.userId][leave.leaveTypeId]) {
        leavesByUserAndType[leave.userId][leave.leaveTypeId] = [];
      }
      leavesByUserAndType[leave.userId][leave.leaveTypeId].push(leave);
    }

    // Step 5: Fetch unresolved late arrivals counts
    const lateArrivals = await getUnresolvedLateArrivalsQuery();

    const lateArrivalsMap = new Map(
      lateArrivals.map((item) => [item.userId, item.lateArrivals]),
    );

    // Step 6: Combine into final result
    return activeUsers.map(({ user, user_detail }) => {
      const userLeaves = leaveTypes.map((type) => {
        // Use the new calculator which handles Half Day attribution to Casual/Annual
        const taken = calculateLeavesTaken(
          type,
          leavesByUserAndType[user.id] || {},
          leaveTypes,
        );

        return {
          leaveTypeId: type.id,
          leaveTypeName: type.name,
          maxAllowed: type.maxAllowed,
          taken,
        };
      });

      // Sort by the name first
      userLeaves.sort((a, b) => a.leaveTypeName.localeCompare(b.leaveTypeName));

      // ✅ Calculate total allowed (only leaves with maxAllowed set)
      const totalAllowedLeaves = userLeaves
        .filter((l) => l.maxAllowed !== null)
        .reduce((sum, l) => sum + (l.maxAllowed as number), 0);

      const totalTakenLeaves = userLeaves.reduce((sum, l) => sum + l.taken, 0);

      return {
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: user_detail?.role,
        leaveStats: userLeaves,
        totalAllowedLeaves,
        totalTakenLeaves,
        lateArrivals: lateArrivalsMap.get(user.id) || [],
      };
    });
  } catch (error) {
    handleErrorWithSlack("getAllActiveUsersWithLeaveStats Error", error);
    throw error;
  }
};
