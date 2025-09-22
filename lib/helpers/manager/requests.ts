import { db } from "@/db/drizzle";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import {
  LeaveTable,
  LeaveTypeTable,
  UserTable,
  UserDetailTable,
  LeaveRemarkTable,
} from "@/db/schema";
import { LEAVE_STATUS } from "@/enum";
import { handleErrorWithSlack } from "@/lib/error";
import { alias } from "drizzle-orm/pg-core";
import { getActiveLeaveYear } from "@/lib/helpers/common";

export const getAllLeavesRequests = async () => {
  const activeLeaveYear = await getActiveLeaveYear();

  try {
    const leaveOwner = alias(UserTable, "leaveOwner");
    const leaveOwnerDetail = alias(UserDetailTable, "leaveOwnerDetail");
    const teamLead = alias(UserTable, "teamLead");
    const remarksCount = sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
      "remarksCount"
    );

    const allRelevantLeaves = await db
      .select({
        leave: LeaveTable,
        owner: leaveOwner,
        ownerDetail: leaveOwnerDetail,
        lead: teamLead,
        type: LeaveTypeTable,
        remarksCount,
      })
      .from(LeaveTable)
      .leftJoin(leaveOwner, eq(LeaveTable.userId, leaveOwner.id))
      .leftJoin(leaveOwnerDetail, eq(leaveOwner.id, leaveOwnerDetail.userId))
      .leftJoin(teamLead, eq(leaveOwnerDetail.teamLeadId, teamLead.id))
      .innerJoin(LeaveTypeTable, eq(LeaveTable.leaveTypeId, LeaveTypeTable.id))
      .leftJoin(LeaveRemarkTable, eq(LeaveTable.id, LeaveRemarkTable.leaveId))
      .where(
        and(
          inArray(LeaveTable.leaveStatus, [
            LEAVE_STATUS.PENDING,
            LEAVE_STATUS.ACCEPTED,
          ]),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id)
        )
      )
      .groupBy(
        LeaveTable.id,
        leaveOwner.id,
        leaveOwnerDetail.id,
        teamLead.id,
        LeaveTypeTable.id
      )
      .orderBy(desc(LeaveTable.createdAt));

    return allRelevantLeaves;
  } catch (error) {
    handleErrorWithSlack("getAllLeavesRequests Error", error);
    return null;
  }
};
