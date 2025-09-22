import {
  AnyPgColumn,
  date,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";
import { ROLE, STATUS } from "./enums";
import { user } from "./auth-schema";
import { nanoid } from "@/lib/utils";

export const UserDetailTable = pgTable("user_detail", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  employeeId: varchar("employee_id").notNull().unique(),
  role: ROLE("role").default("USER").notNull(),
  status: STATUS("status").notNull().default("ACTIVE"),
  teamLeadId: text("team_lead_id").references((): AnyPgColumn => user.id),
  designation: varchar("designation", { length: 100 }),
  joinedAt: date("joined_at"),

  dob: date("dob"),
  cnic: varchar("cnic", { length: 15 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),

  salary: numeric("salary", { precision: 10, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }),

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
