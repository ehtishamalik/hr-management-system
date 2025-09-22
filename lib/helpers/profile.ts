import { db } from "@/db/drizzle";
import { UserTable, UserDetailTable } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { handleErrorWithSlack } from "@/lib/error";

export const getUserProfile = async (userId: string | undefined) => {
  if (!userId) return null;

  try {
    const teamLead = alias(UserTable, "team_lead");
    const userColumns = getTableColumns(UserTable);
    const userDetailColumns = getTableColumns(UserDetailTable);

    const [result] = await db
      .select({
        ...userColumns,
        ...userDetailColumns,
        teamLeadName: teamLead.name,
      })
      .from(UserDetailTable)
      .innerJoin(UserTable, eq(UserDetailTable.userId, UserTable.id))
      .leftJoin(teamLead, eq(UserDetailTable.teamLeadId, teamLead.id))
      .where(eq(UserTable.id, userId));

    return result ?? null;
  } catch (error) {
    handleErrorWithSlack("getProfile Error", error);
    return null;
  }
};
