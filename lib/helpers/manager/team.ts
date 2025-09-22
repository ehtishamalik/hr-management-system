import { db } from "@/db/drizzle";
import {
  LeaveTable,
  LeaveTypeTable,
  UserTable,
  UserDetailTable,
} from "@/db/schema";
import { LEAVE_STATUS, STATUS } from "@/enum";
import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { handleErrorWithSlack } from "@/lib/error";

export const getTeamMembers = async (teamLeadId: string) => {
  try {
    const teamMembers = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(
        and(
          eq(UserDetailTable.teamLeadId, teamLeadId),
          eq(UserDetailTable.status, STATUS.ACTIVE)
        )
      );

    return teamMembers;
  } catch (error) {
    handleErrorWithSlack("getTeamMembers Error", error);
    return null;
  }
};

export const getUpcomingApprovedLeavesByUser = async (userId: string) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

    const upcomingLeaves = await db
      .select()
      .from(LeaveTable)
      .innerJoin(UserTable, eq(LeaveTable.userId, UserTable.id))
      .innerJoin(LeaveTypeTable, eq(LeaveTable.leaveTypeId, LeaveTypeTable.id))
      .where(
        and(
          inArray(LeaveTable.leaveStatus, [
            LEAVE_STATUS.APPROVED,
            LEAVE_STATUS.ACCEPTED,
          ]),
          eq(LeaveTable.userId, userId),
          gte(LeaveTable.toDate, today) // Pass ISO string here
        )
      )
      .orderBy(asc(LeaveTable.fromDate));

    return upcomingLeaves;
  } catch (error) {
    handleErrorWithSlack("getUpcomingApprovedLeavesByUser Error", error);
    return [];
  }
};
