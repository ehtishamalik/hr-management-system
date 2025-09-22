import z from "zod";

import { LEAVE_FORM_SCHEMA } from "./schema";

import type { LeaveTypeTableSelectType } from "@/db/types";

export interface LeaveFormProps {
  leaveTypes: LeaveTypeTableSelectType[];
  userId?: string;
  calendarDisabled?: boolean;
}

export interface LeaveFormHookProps {
  userId?: string;
}

export type LeaveFormSchemaType = z.infer<typeof LEAVE_FORM_SCHEMA>;
