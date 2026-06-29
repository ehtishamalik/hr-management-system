import { ROLE, type LEAVE_STATUS } from "@/enum";
import { handleErrorWithSlack } from "@/lib/error-handling";
import { getActiveLeaveYear } from "@/lib/utils";
import {
  getAdminLeavesRequestsQuery,
  getLeaveByIdQuery,
  getManagerLeavesRequestsQuery,
  getUserLeavesQuery,
  getUserUpcomingLeavesQuery,
} from "@/queries/leave";

import type { SessionType } from "@/types";

export async function getUserLeaves({
  userId,
  statuses,
  limit,
}: {
  userId: string;
  statuses?: (keyof typeof LEAVE_STATUS)[];
  limit?: number;
}) {
  try {
    const year = getActiveLeaveYear();
    return getUserLeavesQuery({ userId, year, statuses, limit });
  } catch (error) {
    handleErrorWithSlack("getUserLeaves failed", error);
    throw error;
  }
}

export async function getLeaveById(id: string) {
  try {
    const leave = await getLeaveByIdQuery(id);
    if (leave.length === 0) {
      return null;
    }
    return leave[0];
  } catch (error) {
    handleErrorWithSlack("getLeaveById failed", error);
    throw error;
  }
}

export async function getLeavesRequests(session: SessionType) {
  try {
    if (session.user.role === ROLE.MANAGER) {
      return getManagerLeavesRequestsQuery(
        session.user.id,
        getActiveLeaveYear(),
      );
    } else if (session.user.role === ROLE.ADMIN) {
      return getAdminLeavesRequestsQuery(getActiveLeaveYear());
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    handleErrorWithSlack("getLeavesRequests failed", error);
    throw error;
  }
}

export async function getUserUpcomingLeaves(userId: string) {
  try {
    return getUserUpcomingLeavesQuery(userId);
  } catch (error) {
    handleErrorWithSlack("getUserUpcomingLeaves failed", error);
    throw error;
  }
}
