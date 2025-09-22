import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { user } from "./schema/auth-schema";
import { UserDetailTable } from "./schema/user-detail-table";
import { PolicyTable } from "./schema/policy-table";
import { LeaveYearTable } from "./schema/leave-year-table";
import { LeaveTable } from "./schema/leave-table";
import { LeaveTypeTable } from "./schema/leave-type-table";
import { LeaveRemarkTable } from "./schema/leave-remark-table";

export type UserTableSelectType = InferSelectModel<typeof user>;
export type UserTableInsertType = InferInsertModel<typeof user>;

export type UserDetailTableSelectType = InferSelectModel<
  typeof UserDetailTable
>;
export type UserDetailTableInsertType = InferInsertModel<
  typeof UserDetailTable
>;

export type PolicyTableSelectType = InferSelectModel<typeof PolicyTable>;
export type PolicyTableInsertType = InferInsertModel<typeof PolicyTable>;

export type LeaveYearTableSelectType = InferSelectModel<typeof LeaveYearTable>;
export type LeaveYearTableInsertType = InferInsertModel<typeof LeaveYearTable>;

export type LeaveTableSelectType = InferSelectModel<typeof LeaveTable>;
export type LeaveTableInsertType = InferInsertModel<typeof LeaveTable>;

export type LeaveTypeTableSelectType = InferSelectModel<typeof LeaveTypeTable>;
export type LeaveTypeTableInsertType = InferInsertModel<typeof LeaveTypeTable>;

export type LeaveRemarkTableSelectType = InferSelectModel<
  typeof LeaveRemarkTable
>;
export type LeaveRemarkTableInsertType = InferInsertModel<
  typeof LeaveRemarkTable
>;
