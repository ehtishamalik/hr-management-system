import {
  date,
  numeric,
  varchar,
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  uniqueIndex,
  time,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "@/lib/utils";

/* ================================ TIMESTAMPS ================================ */
const timestamps = {
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
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

/* ================================ ENUMS ================================ */
export const ROLE = pgEnum("role_enum", ["USER", "MANAGER", "ADMIN"]);
export const LEAVE_TYPE = pgEnum("leave_type_enum", ["PAID", "UNPAID"]);
export const STATUS = pgEnum("status_enum", ["ACTIVE", "INACTIVE"]);
export const LEAVE_STATUS = pgEnum("leave_status_enum", [
  "PENDING",
  "ACCEPTED",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
  "LATE",
]);
export const PF_CONTRIBUTION_TYPE = pgEnum("pf_contribution_type_enum", [
  "fixed",
  "match_employee",
]);
export const PF_TRANSACTION_TYPE = pgEnum("pf_transaction_type_enum", [
  "monthly_contribution",
  "withdrawal",
]);

/* ================================ BETTER AUTH ================================ */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* ================================ USERDETAIL TABLE ================================ */
export const UserDetailTable = pgTable("user_detail", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  role: ROLE("role").default("USER").notNull(),
  status: STATUS("status").notNull().default("ACTIVE"),
  teamLeadId: text("team_lead_id").references(() => user.id, {
    onDelete: "set null",
  }),
  designation: varchar("designation", { length: 100 }),

  dob: date("dob"),
  cnic: varchar("cnic", { length: 15 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),

  currency: varchar("currency", { length: 3 }).notNull().default("PKR"),
  salary: numeric("salary", { precision: 10, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }),

  ...timestamps,
});

/* ================================ LEAVE TABLE ================================ */
export const LeaveTable = pgTable(
  "leave",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    leaveTypeId: text("leave_type_id").notNull(),

    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    reason: text("reason").notNull(),
    leaveStatus: LEAVE_STATUS("leave_status").default("PENDING").notNull(),
    numberOfDays: integer("number_of_days").notNull(),
    leaveYear: varchar("leave_year", { length: 4 }).notNull(),

    ...timestamps,
  },
  (table) => [
    index("leave_user_idx").on(table.userId),
    index("leave_year_idx").on(table.leaveYear),
    index("leave_user_year_idx").on(table.userId, table.leaveYear),
  ],
);

/* ================================ POLICY TABLE ================================ */
export const PolicyTable = pgTable("policy", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  policy: text("policy").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),

  ...timestamps,
});

/* ================================ MEDICAL LIMIT TABLE ================================ */
export const MedicalLimitTable = pgTable("medical_limit", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  year: integer("year").notNull().unique(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  ...timestamps,
});

/* ================================ MEDICAL EXPENSE TABLE ================================ */
export const MedicalExpenseTable = pgTable(
  "medical_expense",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    month: integer("month").notNull(), // 1 - 12
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("medical_expense_user_year_month_idx").on(
      table.userId,
      table.year,
      table.month,
    ),
  ],
);

/* ================================ LATE ARRIVAL TABLE ================================ */
export const LateArrivalTable = pgTable("late_arrival", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  date: date("date").notNull(),
  arrivalTime: time("arrival_time").notNull(),
  comment: text("comment"),

  resolved: text("resolved").references(() => LeaveTable.id, {
    onDelete: "set null",
  }),

  ...timestamps,
});

/* ================================ LEAVE REMARKS TABLE ================================ */
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

  ...timestamps,
});

/* ================================ EMERGENCY CONTACT TABLE ================================ */
export const EmergencyContactTable = pgTable(
  "emergency_contact",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    relation: varchar("relation", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    description: text("description"),

    ...timestamps,
  },
  (table) => [
    index("emergency_contact_user_idx").on(table.userId),
    check(
      "emergency_contact_phone_format",
      sql`${table.phone} ~ '^\\+92 \\d{3} \\d{7}$'`,
    ),
  ],
);

/* ================================ PF SETTINGS TABLE ================================ */
export const PFSettingsTable = pgTable(
  "pf_settings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),

    employeeMonthlyAmount: numeric("employee_monthly_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    companyContributionEnabled: boolean("company_contribution_enabled")
      .notNull()
      .default(false),

    companyContributionType: PF_CONTRIBUTION_TYPE(
      "company_contribution_type",
    ).default("fixed"),

    companyContributionAmount: numeric("company_contribution_amount", {
      precision: 12,
      scale: 2,
    }).default("0"),

    effectiveFrom: date("effective_from").notNull(),

    status: STATUS("status").notNull().default("ACTIVE"),

    ...timestamps,
  },
  (table) => [index("pf_settings_user_idx").on(table.userId)],
);

/* ================================ PF LEDGER TABLE ================================ */
export const PFLedgerTable = pgTable(
  "pf_ledger",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    month: integer("month").notNull(), // 1 - 12
    year: integer("year").notNull(),

    transactionType: PF_TRANSACTION_TYPE("transaction_type").notNull(),

    employeeContribution: numeric("employee_contribution", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    companyContribution: numeric("company_contribution", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    totalContribution: numeric("total_contribution", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    withdrawalAmount: numeric("withdrawal_amount", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),

    referenceId: text("reference_id"),
    remarks: text("remarks"),

    processedBy: text("processed_by").references(() => user.id, {
      onDelete: "set null",
    }),

    processedAt: timestamp("processed_at", {
      mode: "date",
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("pf_ledger_user_idx").on(table.userId),
    index("pf_ledger_user_year_idx").on(table.userId, table.year),
    index("pf_ledger_year_month_idx").on(table.year, table.month),
  ],
);

/* ================================ RELATIONS ================================ */
export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  userDetail: one(UserDetailTable, {
    fields: [user.id],
    references: [UserDetailTable.userId],
  }),
  leaves: many(LeaveTable),
  medicalExpenses: many(MedicalExpenseTable),
  lateArrivals: many(LateArrivalTable, { relationName: "late_arrival_user" }),
  leaveRemarks: many(LeaveRemarkTable),
  emergencyContacts: many(EmergencyContactTable),
  createdPolicies: many(PolicyTable),
  teamMembers: many(UserDetailTable, { relationName: "team_lead_members" }),
  pfSettings: one(PFSettingsTable, {
    fields: [user.id],
    references: [PFSettingsTable.userId],
  }),
  pfLedger: many(PFLedgerTable),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userDetailRelations = relations(UserDetailTable, ({ one }) => ({
  user: one(user, {
    fields: [UserDetailTable.userId],
    references: [user.id],
  }),
  teamLead: one(user, {
    fields: [UserDetailTable.teamLeadId],
    references: [user.id],
    relationName: "team_lead_members",
  }),
}));

export const leaveRelations = relations(LeaveTable, ({ one, many }) => ({
  user: one(user, {
    fields: [LeaveTable.userId],
    references: [user.id],
  }),
  lateArrivals: many(LateArrivalTable, {
    relationName: "late_arrival_resolved_leave",
  }),
  remarks: many(LeaveRemarkTable),
}));

export const policyRelations = relations(PolicyTable, ({ one }) => ({
  createdBy: one(user, {
    fields: [PolicyTable.createdBy],
    references: [user.id],
  }),
}));

export const medicalExpenseRelations = relations(
  MedicalExpenseTable,
  ({ one }) => ({
    user: one(user, {
      fields: [MedicalExpenseTable.userId],
      references: [user.id],
    }),
  }),
);

export const lateArrivalRelations = relations(LateArrivalTable, ({ one }) => ({
  user: one(user, {
    fields: [LateArrivalTable.userId],
    references: [user.id],
    relationName: "late_arrival_user",
  }),
  resolvedLeave: one(LeaveTable, {
    fields: [LateArrivalTable.resolved],
    references: [LeaveTable.id],
    relationName: "late_arrival_resolved_leave",
  }),
}));

export const leaveRemarkRelations = relations(LeaveRemarkTable, ({ one }) => ({
  leave: one(LeaveTable, {
    fields: [LeaveRemarkTable.leaveId],
    references: [LeaveTable.id],
  }),
  user: one(user, {
    fields: [LeaveRemarkTable.userId],
    references: [user.id],
  }),
}));

export const pfSettingsRelations = relations(PFSettingsTable, ({ one }) => ({
  user: one(user, {
    fields: [PFSettingsTable.userId],
    references: [user.id],
  }),
}));

export const pfLedgerRelations = relations(PFLedgerTable, ({ one }) => ({
  user: one(user, {
    fields: [PFLedgerTable.userId],
    references: [user.id],
  }),
  processor: one(user, {
    fields: [PFLedgerTable.processedBy],
    references: [user.id],
    relationName: "pf_ledger_processor",
  }),
}));

export const emergencyContactRelations = relations(
  EmergencyContactTable,
  ({ one }) => ({
    user: one(user, {
      fields: [EmergencyContactTable.userId],
      references: [user.id],
    }),
  }),
);
