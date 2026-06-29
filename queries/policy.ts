import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { PolicyTable, user as UserTable } from "@/db/schema";

export const getPoliciesQuery = async (isActive?: boolean) => {
  const baseQuery = db
    .select()
    .from(PolicyTable)
    .leftJoin(UserTable, eq(PolicyTable.createdBy, UserTable.id));

  if (isActive !== undefined) {
    baseQuery.where(eq(PolicyTable.isActive, isActive));
  }

  return baseQuery;
};

export const getPolicyByIdQuery = async (id: string) => {
  return db.select().from(PolicyTable).where(eq(PolicyTable.id, id)).limit(1);
};
