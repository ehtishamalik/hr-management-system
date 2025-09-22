import { nanoid } from "@/lib/utils";
import {
  pgTable,
  varchar,
  date,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const LeaveYearTable = pgTable("leave_year", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  name: varchar("name", { length: 100 }).notNull().unique(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // Add end date before starting new year
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
