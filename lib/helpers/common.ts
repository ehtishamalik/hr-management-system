import { db } from "@/db/drizzle";
import { LeaveYearTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getActiveLeaveYear = async () => {
  const [activeLeaveYear] = await db
    .select()
    .from(LeaveYearTable)
    .where(eq(LeaveYearTable.isActive, true));

  return activeLeaveYear;
};
