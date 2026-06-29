import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { STATUS } from "@/enum";
import { AppError } from "@/lib/errors";
import { UserDetailTable, user as UserTable } from "@/db/schema";

import type { LateArrivalTableInsertType } from "@/types";

export const checkPostRequest = async (
  lateArrival: LateArrivalTableInsertType,
) => {
  // Check if user info and if INACTIVE
  const [user] = await db
    .select()
    .from(UserTable)
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .where(
      and(
        eq(UserTable.id, lateArrival.userId),
        eq(UserDetailTable.status, STATUS.ACTIVE),
      ),
    )
    .limit(1);

  if (!user) {
    throw new AppError("Employee not found.", {
      detail: "Employee might not be Active anymore.",
      status: 404,
    });
  }
};
