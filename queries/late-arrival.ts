import { desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LateArrivalTable, user as UserTable } from "@/db/schema";

import type { LateArrivalTableSelectType } from "@/types";

export function getUserLateArrivalsQuery({
  userId,
  limit,
}: {
  userId: string;
  limit?: number;
}) {
  const query = db
    .select()
    .from(LateArrivalTable)
    .where(eq(LateArrivalTable.userId, userId))
    .orderBy(desc(LateArrivalTable.date));

  if (limit) {
    return query.limit(limit);
  }

  return query;
}

export const getLateArrivalByIdQuery = async (id: string) => {
  return db
    .select({
      lateArrival: LateArrivalTable,
      user: UserTable,
    })
    .from(LateArrivalTable)
    .leftJoin(UserTable, eq(LateArrivalTable.userId, UserTable.id))
    .where(eq(LateArrivalTable.id, id))
    .limit(1);
};

export const getAllLateArrivalsQuery = async () => {
  return db
    .select({
      lateArrival: LateArrivalTable,
      user: UserTable,
    })
    .from(LateArrivalTable)
    .leftJoin(UserTable, eq(LateArrivalTable.userId, UserTable.id))
    .orderBy(desc(LateArrivalTable.date));
};

export const getUnresolvedLateArrivalsQuery = async () => {
  return db
    .select({
      userId: LateArrivalTable.userId,
      lateArrivals: sql<LateArrivalTableSelectType[]>`
        coalesce(
          json_agg(
            json_build_object(
              'id', ${LateArrivalTable.id},
              'userId', ${LateArrivalTable.userId},
              'date', ${LateArrivalTable.date},
              'arrivalTime', ${LateArrivalTable.arrivalTime},
              'comment', ${LateArrivalTable.comment},
              'resolved', ${LateArrivalTable.resolved},
              'createdAt', ${LateArrivalTable.createdAt},
              'updatedAt', ${LateArrivalTable.updatedAt}
            )
          ),
          '[]'::json
        )
      `.as("lateArrivals"),
    })
    .from(LateArrivalTable)
    .where(isNull(LateArrivalTable.resolved))
    .groupBy(LateArrivalTable.userId);
};
