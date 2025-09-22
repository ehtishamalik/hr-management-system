import { db } from "@/db/drizzle";
import {
  UserTable,
  LeaveTable,
  LeaveTypeTable,
  LeaveRemarkTable,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { handleErrorWithSlack } from "../error";
import { alias } from "drizzle-orm/pg-core";
import { getActiveLeaveYear } from "./common";

export const getLeaveById = async (id: string) => {
  try {
    const leaveOwner = alias(UserTable, "leaveOwner");

    const leave = await db
      .select()
      .from(LeaveTable)
      .leftJoin(LeaveTypeTable, eq(LeaveTable.leaveTypeId, LeaveTypeTable.id))
      .leftJoin(leaveOwner, eq(LeaveTable.userId, leaveOwner.id))
      .where(eq(LeaveTable.id, id))
      .limit(1);
    return leave[0] || null;
  } catch (error) {
    handleErrorWithSlack("getLeaveById Error", error);
    return null;
  }
};

export const getLeavesByUserId = async (userId: string | undefined) => {
  if (!userId) return null;

  try {
    const activeLeaveYear = await getActiveLeaveYear();

    const remarksCount = sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
      "remarksCount"
    );

    const allLeaves = await db
      .select({
        leave: LeaveTable,
        type: LeaveTypeTable,
        remarksCount,
      })
      .from(LeaveTable)
      .innerJoin(LeaveTypeTable, eq(LeaveTable.leaveTypeId, LeaveTypeTable.id))
      .leftJoin(LeaveRemarkTable, eq(LeaveTable.id, LeaveRemarkTable.leaveId))
      .where(
        and(
          eq(LeaveTable.userId, userId),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id)
        )
      )
      .groupBy(LeaveTable.id, LeaveTypeTable.id)
      .orderBy(desc(LeaveTable.createdAt));

    return allLeaves;
  } catch (error) {
    handleErrorWithSlack("getLeavesByUserId Error", error);
    return null;
  }
};
