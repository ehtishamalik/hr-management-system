import { db } from "@/db/drizzle";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { LeaveTable, LeaveTypeTable, LeaveRemarkTable } from "@/db/schema";
import { LEAVE_STATUS } from "@/enum";
import { handleErrorWithSlack } from "../error";
import { getActiveLeaveYear } from "./common";

export const getUserLeavesByStatus = async (
  userId: string,
  status: (keyof typeof LEAVE_STATUS)[],
  limit?: number
) => {
  try {
    const activeLeaveYear = await getActiveLeaveYear();

    const baseQuery = db
      .select({
        leave: LeaveTable,
        leaveType: LeaveTypeTable,
        remarkCount: sql<number>`COUNT(${LeaveRemarkTable.id})`.as(
          "remark_count"
        ),
      })
      .from(LeaveTable)
      .leftJoin(LeaveTypeTable, eq(LeaveTable.leaveTypeId, LeaveTypeTable.id))
      .leftJoin(LeaveRemarkTable, eq(LeaveRemarkTable.leaveId, LeaveTable.id))
      .where(
        and(
          eq(LeaveTable.userId, userId),
          eq(LeaveTable.leaveYearId, activeLeaveYear.id),
          inArray(LeaveTable.leaveStatus, status)
        )
      )
      .groupBy(LeaveTable.id, LeaveTypeTable.id)
      .orderBy(desc(LeaveTable.updatedAt));

    // Apply limit only if "APPROVED" is in the status list
    if (limit) {
      return await baseQuery.limit(limit);
    }

    return await baseQuery;
  } catch (error) {
    handleErrorWithSlack("getUserLeavesByStatus Error", error);
    return null;
  }
};
