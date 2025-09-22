import { pgTable, text, timestamp, date, integer } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { LeaveTypeTable } from "./leave-type-table";
import { LEAVE_STATUS } from "./enums";
import { LeaveYearTable } from "./leave-year-table";
import { nanoid } from "@/lib/utils";

export const LeaveTable = pgTable("leave", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id),

  leaveTypeId: text("leave_type_id")
    .notNull()
    .references(() => LeaveTypeTable.id, {
      onDelete: "cascade",
    }),

  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  reason: text("reason").notNull(),
  leaveStatus: LEAVE_STATUS("leave_status").default("PENDING").notNull(),
  numberOfDays: integer("number_of_days").notNull(),
  leaveYearId: text("leave_year_id")
    .notNull()
    .references(() => LeaveYearTable.id),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
