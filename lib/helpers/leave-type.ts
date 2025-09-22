import { db } from "@/db/drizzle";
import { LeaveTypeTable } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { handleErrorWithSlack } from "@/lib/error";
import { STATUS } from "@/enum";

export const getLeaveTypes = async (isAdmin: boolean = false) => {
  try {
    const conditions = [eq(LeaveTypeTable.status, STATUS.ACTIVE)];

    if (!isAdmin) {
      conditions.push(eq(LeaveTypeTable.isPrivate, false));
    }

    const leaveTypes = await db
      .select()
      .from(LeaveTypeTable)
      .where(and(...conditions));

    return leaveTypes;
  } catch (error) {
    handleErrorWithSlack("getLeaveTypes Error", error);
    return null;
  }
};

export const getLeaveTypesForCards = async () => {
  try {
    const leaveTypes = await db
      .select()
      .from(LeaveTypeTable)
      .orderBy(asc(LeaveTypeTable.status), desc(LeaveTypeTable.updatedAt));

    return leaveTypes;
  } catch (error) {
    handleErrorWithSlack("getUserLeaveTypes", error);
    return null;
  }
};

export const getLeaveTypeById = async (id: string) => {
  try {
    const leaveType = await db
      .select()
      .from(LeaveTypeTable)
      .where(eq(LeaveTypeTable.id, id))
      .limit(1);

    return leaveType[0] || null;
  } catch (error) {
    handleErrorWithSlack("getUserLeaveTypes", error);
    return null;
  }
};
