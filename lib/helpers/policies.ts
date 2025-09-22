import { db } from "@/db/drizzle";
import { UserTable, PolicyTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { handleErrorWithSlack } from "../error";

export const getPolicies = async (isActive?: boolean) => {
  try {
    const baseQuery = db
      .select()
      .from(PolicyTable)
      .leftJoin(UserTable, eq(PolicyTable.createdBy, UserTable.id));

    if (isActive !== undefined) {
      baseQuery.where(eq(PolicyTable.isActive, isActive));
    }

    return await baseQuery;
  } catch (error) {
    handleErrorWithSlack("getPolicies Error", error);
    return null;
  }
};

export const getPolicyById = async (id: string) => {
  try {
    const policy = await db
      .select()
      .from(PolicyTable)
      .where(eq(PolicyTable.id, id))
      .limit(1);

    return policy[0] || null;
  } catch (error) {
    handleErrorWithSlack("getPolicyById Error", error);
    return null;
  }
};
