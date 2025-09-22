import { pgEnum } from "drizzle-orm/pg-core";

export const ROLE = pgEnum("role_enum", ["USER", "MANAGER", "ADMIN"]);

export const LEAVE_STATUS = pgEnum("leave_status_enum", [
  "PENDING",
  "ACCEPTED",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export const LEAVE_TYPE = pgEnum("leave_type_enum", ["PAID", "UNPAID"]);

export const STATUS = pgEnum("status_enum", ["ACTIVE", "INACTIVE"]);
