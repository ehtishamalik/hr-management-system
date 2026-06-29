import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db/drizzle";
import { LEAVE_STATUS } from "@/enum";
import { toDateInputValue } from "@/lib/utils";
import {
  LeaveRemarkTable,
  LeaveTable,
  UserDetailTable,
  user as UserTable,
} from "@/db/schema";

// Get all approved leaves for a user in a year (Detailed for calculation)
export async function getLeavesTakenByUser(userId: string, year: string) {
  return db
    .select({
      id: LeaveTable.id,
      leaveTypeId: LeaveTable.leaveTypeId,
      numberOfDays: LeaveTable.numberOfDays,
      fromDate: LeaveTable.fromDate,
    })
    .from(LeaveTable)
    .where(
      and(
        eq(LeaveTable.userId, userId),
        eq(LeaveTable.leaveYear, year),
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.APPROVED,
          LEAVE_STATUS.LATE,
        ]),
      ),
    );
}

export function getUserLeavesQuery({
  userId,
  year,
  statuses,
  limit,
}: {
  userId: string;
  year: string;
  statuses?: (keyof typeof LEAVE_STATUS)[];
  limit?: number;
}) {
  const remarkCount = sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
    "remark_count",
  );

  const query = db
    .select({
      leave: LeaveTable,
      remarkCount,
    })
    .from(LeaveTable)
    .leftJoin(LeaveRemarkTable, eq(LeaveTable.id, LeaveRemarkTable.leaveId))
    .where(
      and(
        eq(LeaveTable.userId, userId),
        eq(LeaveTable.leaveYear, year),
        statuses && statuses.length > 0
          ? inArray(LeaveTable.leaveStatus, statuses)
          : undefined,
      ),
    )
    .groupBy(LeaveTable.id)
    .orderBy(desc(LeaveTable.fromDate));

  if (limit) {
    return query.limit(limit);
  }

  return query;
}

export const getLeaveByIdQuery = async (id: string) => {
  const leaveOwner = alias(UserTable, "leaveOwner");

  return db
    .select({
      leave: LeaveTable,
      leaveOwner: leaveOwner,
    })
    .from(LeaveTable)
    .leftJoin(leaveOwner, eq(LeaveTable.userId, leaveOwner.id))
    .where(eq(LeaveTable.id, id))
    .limit(1);
};

export const getManagerLeavesRequestsQuery = async (
  managerId: string,
  activeLeaveYear: string,
) => {
  const leaveOwner = alias(UserTable, "leaveOwner");
  const leaveOwnerDetail = alias(UserDetailTable, "leaveOwnerDetail");
  const teamLead = alias(UserTable, "teamLead");
  const remarksCount = sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
    "remarksCount",
  );

  const allRelevantLeaves = await db
    .select({
      leave: LeaveTable,
      owner: leaveOwner,
      ownerDetail: leaveOwnerDetail,
      lead: teamLead,
      remarksCount,
    })
    .from(LeaveTable)
    .leftJoin(leaveOwner, eq(LeaveTable.userId, leaveOwner.id))
    .leftJoin(leaveOwnerDetail, eq(leaveOwner.id, leaveOwnerDetail.userId))
    .leftJoin(teamLead, eq(leaveOwnerDetail.teamLeadId, teamLead.id))
    .leftJoin(LeaveRemarkTable, eq(LeaveTable.id, LeaveRemarkTable.leaveId))
    .where(
      and(
        eq(leaveOwnerDetail.teamLeadId, managerId),
        eq(LeaveTable.leaveStatus, LEAVE_STATUS.PENDING),
        eq(LeaveTable.leaveYear, activeLeaveYear),
      ),
    )
    .groupBy(LeaveTable.id, leaveOwner.id, leaveOwnerDetail.id, teamLead.id)
    .orderBy(desc(LeaveTable.createdAt));

  return allRelevantLeaves;
};

export const getAdminLeavesRequestsQuery = async (activeLeaveYear: string) => {
  const leaveOwner = alias(UserTable, "leaveOwner");
  const leaveOwnerDetail = alias(UserDetailTable, "leaveOwnerDetail");
  const teamLead = alias(UserTable, "teamLead");
  const remarksCount = sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
    "remarksCount",
  );

  const allRelevantLeaves = await db
    .select({
      leave: LeaveTable,
      owner: leaveOwner,
      ownerDetail: leaveOwnerDetail,
      lead: teamLead,
      remarksCount,
    })
    .from(LeaveTable)
    .leftJoin(leaveOwner, eq(LeaveTable.userId, leaveOwner.id))
    .leftJoin(leaveOwnerDetail, eq(leaveOwner.id, leaveOwnerDetail.userId))
    .leftJoin(teamLead, eq(leaveOwnerDetail.teamLeadId, teamLead.id))
    .leftJoin(LeaveRemarkTable, eq(LeaveTable.id, LeaveRemarkTable.leaveId))
    .where(
      and(
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.PENDING,
          LEAVE_STATUS.ACCEPTED,
        ]),
        eq(LeaveTable.leaveYear, activeLeaveYear),
      ),
    )
    .groupBy(LeaveTable.id, leaveOwner.id, leaveOwnerDetail.id, teamLead.id)
    .orderBy(desc(LeaveTable.createdAt));

  return allRelevantLeaves;
};

export const getUserUpcomingLeavesQuery = async (userId: string) => {
  const today = toDateInputValue(); // Get today's date in 'YYYY-MM-DD' format for Pakistan

  const upcomingLeaves = await db
    .select()
    .from(LeaveTable)
    .innerJoin(UserTable, eq(LeaveTable.userId, UserTable.id))
    .where(
      and(
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.APPROVED,
          LEAVE_STATUS.ACCEPTED,
          LEAVE_STATUS.LATE,
        ]),
        eq(LeaveTable.userId, userId),
        gte(LeaveTable.toDate, today), // Pass ISO string here
      ),
    )
    .orderBy(asc(LeaveTable.fromDate));

  return upcomingLeaves;
};

// Query to get DETAILED leave days taken per user per leave type
export const getAllUserTakenLeavesQuery = async (activeLeaveYear: string) => {
  return db
    .select({
      userId: LeaveTable.userId,
      leaveTypeId: LeaveTable.leaveTypeId,
      numberOfDays: LeaveTable.numberOfDays, // Need detailed days
      fromDate: LeaveTable.fromDate, // Need dates for Short Leave logic
    })
    .from(LeaveTable)
    .where(
      and(
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.APPROVED,
          LEAVE_STATUS.LATE,
        ]),
        eq(LeaveTable.leaveYear, activeLeaveYear),
      ),
    );
};
