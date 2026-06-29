import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { UserDetailTable, user as UserTable } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { type ROLE, STATUS } from "@/enum";

export const getUserByIdQuery = async (id: string) => {
  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .where(eq(UserTable.id, id))
    .limit(1);
};

export const getUserByRoleQuery = async (role: (keyof typeof ROLE)[]) => {
  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .where(
      and(
        inArray(UserDetailTable.role, role),
        eq(UserDetailTable.status, STATUS.ACTIVE),
      ),
    );
};

export const getTeamMembersQuery = async (teamLeadId: string) => {
  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .where(
      and(
        eq(UserDetailTable.teamLeadId, teamLeadId),
        eq(UserDetailTable.status, STATUS.ACTIVE),
      ),
    );
};

export const getActiveUsersQuery = async () => {
  const teamLead = alias(UserTable, "team_lead");

  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserDetailTable.userId, UserTable.id))
    .leftJoin(teamLead, eq(UserDetailTable.teamLeadId, teamLead.id))
    .where(eq(UserDetailTable.status, STATUS.ACTIVE))
    .orderBy(asc(UserTable.createdAt));
};

export const isUserActiveQuery = async (userId: string) => {
  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserDetailTable.userId, UserTable.id))
    .where(
      and(eq(UserTable.id, userId), eq(UserDetailTable.status, STATUS.ACTIVE)),
    )
    .limit(1);
};

export const getUserProfileQuery = async (userId: string) => {
  const teamLead = alias(UserTable, "team_lead");

  return db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserDetailTable.userId, UserTable.id))
    .leftJoin(teamLead, eq(UserDetailTable.teamLeadId, teamLead.id))
    .where(eq(UserTable.id, userId))
    .limit(1);
};
