import { db } from "@/db/drizzle";
import { UserTable, UserDetailTable } from "@/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";
import { handleErrorWithSlack } from "../error";
import { ROLE, STATUS } from "@/enum";
import { alias } from "drizzle-orm/pg-core";

export const getUserById = async (id: string) => {
  try {
    const user = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(eq(UserTable.id, id))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    handleErrorWithSlack("getUserById Error", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(
        and(
          eq(UserTable.email, email),
          eq(UserDetailTable.status, STATUS.ACTIVE)
        )
      )
      .limit(1);

    return user[0] || null;
  } catch (error) {
    handleErrorWithSlack("getUserByEmail Error", error);
    return null;
  }
};

export const getUserByRole = async (role: (keyof typeof ROLE)[]) => {
  try {
    const user = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(
        and(
          inArray(UserDetailTable.role, role),
          eq(UserDetailTable.status, STATUS.ACTIVE)
        )
      );

    return user;
  } catch (error) {
    handleErrorWithSlack("getUserByRole Error", error);
    return null;
  }
};

export const getActiveUsers = async () => {
  try {
    const teamLead = alias(UserTable, "team_lead");

    const users = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserDetailTable.userId, UserTable.id))
      .leftJoin(teamLead, eq(UserDetailTable.teamLeadId, teamLead.id))
      .where(eq(UserDetailTable.status, STATUS.ACTIVE))
      .orderBy(asc(UserTable.createdAt));

    return users;
  } catch (error) {
    handleErrorWithSlack("getActiveUsers Error", error);
    return [];
  }
};
