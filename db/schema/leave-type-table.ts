import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { LEAVE_TYPE, STATUS } from "./enums";
import { nanoid } from "@/lib/utils";

// Precision = total number of significant digits (before + after the decimal).
// Scale = number of digits to the right of the decimal point.

export const LeaveTypeTable = pgTable("leave_type", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  maxAllowed: integer("max_allowed"),
  category: LEAVE_TYPE("category").notNull().default("PAID"),
  isPrivate: boolean("is_private").default(false).notNull(),
  systemGenerated: boolean("system_generated").default(false).notNull(),
  dayFraction: numeric("day_fraction", { precision: 5, scale: 2 })
    .notNull()
    .default("0.00"),
  status: STATUS("status").notNull().default("ACTIVE"),
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
