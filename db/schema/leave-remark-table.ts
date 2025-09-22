import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { LeaveTable } from "./leave-table";
import { user } from "./auth-schema";
import { nanoid } from "@/lib/utils";

export const LeaveRemarkTable = pgTable("leave_remark", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  leaveId: text("leave_id")
    .references(() => LeaveTable.id, {
      onDelete: "cascade",
    })
    .notNull(),

  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),

  remark: text("remark").notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
