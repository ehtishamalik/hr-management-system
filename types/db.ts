import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  MedicalExpenseTable,
  MedicalLimitTable,
  LateArrivalTable,
  session,
  user,
  UserDetailTable,
  PolicyTable,
  LeaveTable,
  LeaveRemarkTable,
  EmergencyContactTable,
  PFSettingsTable,
  PFLedgerTable,
} from "@/db/schema";

export type SessionTableSelectType = InferSelectModel<typeof session>;
export type SessionTableInsertType = InferInsertModel<typeof session>;

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

export type LeaveTableSelectType = InferSelectModel<typeof LeaveTable>;
export type LeaveTableInsertType = InferInsertModel<typeof LeaveTable>;

export type LeaveRemarkTableSelectType = InferSelectModel<
  typeof LeaveRemarkTable
>;
export type LeaveRemarkTableInsertType = InferInsertModel<
  typeof LeaveRemarkTable
>;

export type EmergencyContactTableSelectType = InferSelectModel<
  typeof EmergencyContactTable
>;
export type EmergencyContactTableInsertType = InferInsertModel<
  typeof EmergencyContactTable
>;

export type LateArrivalTableSelectType = InferSelectModel<
  typeof LateArrivalTable
>;
export type LateArrivalTableInsertType = InferInsertModel<
  typeof LateArrivalTable
>;

export type MedicalLimitTableSelectType = InferSelectModel<
  typeof MedicalLimitTable
>;
export type MedicalLimitTableInsertType = InferInsertModel<
  typeof MedicalLimitTable
>;

export type MedicalExpenseTableSelectType = InferSelectModel<
  typeof MedicalExpenseTable
>;
export type MedicalExpenseTableInsertType = InferInsertModel<
  typeof MedicalExpenseTable
>;

export type PFSettingsTableSelectType = InferSelectModel<
  typeof PFSettingsTable
>;
export type PFSettingsTableInsertType = InferInsertModel<
  typeof PFSettingsTable
>;

export type PFLedgerTableSelectType = InferSelectModel<typeof PFLedgerTable>;
export type PFLedgerTableInsertType = InferInsertModel<typeof PFLedgerTable>;
