import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
  MedicalExpenseTable,
  MedicalLimitTable,
  UserDetailTable,
  user as UserTable,
} from "@/db/schema";

export const getMedicalLimitQuery = async (year: number) => {
  return db
    .select()
    .from(MedicalLimitTable)
    .where(eq(MedicalLimitTable.year, year))
    .limit(1);
};

export const getAllMedicalLimitsQuery = async () => {
  return db
    .select()
    .from(MedicalLimitTable)
    .orderBy(desc(MedicalLimitTable.year));
};

export const getMedicalLimitByIdQuery = async (id: string) => {
  return db
    .select()
    .from(MedicalLimitTable)
    .where(eq(MedicalLimitTable.id, id))
    .limit(1);
};

export const getUserMedicalExpensesQuery = async (
  userId: string,
  year: number,
) => {
  return db
    .select()
    .from(MedicalExpenseTable)
    .where(
      and(
        eq(MedicalExpenseTable.userId, userId),
        eq(MedicalExpenseTable.year, year),
      ),
    );
};

export const getAllUsersUsageQuery = async (year: number) => {
  return db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      totalUsed: sql<number>`COALESCE(SUM(${MedicalExpenseTable.amount}), 0)`,
    })
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .leftJoin(
      MedicalExpenseTable,
      and(
        eq(UserTable.id, MedicalExpenseTable.userId),
        eq(MedicalExpenseTable.year, year),
      ),
    )
    .where(eq(UserDetailTable.status, "ACTIVE"))
    .groupBy(UserTable.id, UserTable.name, UserTable.email);
};
