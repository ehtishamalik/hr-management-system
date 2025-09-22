import z from "zod";

import type { LeaveTypeTableSelectType } from "@/db/types";
import { LEAVE_TYPE_FORM_SCHEMA } from "./schema";

export interface LeaveTypeFormProps {
  leaveType: LeaveTypeTableSelectType | null;
}

export type LeaveTypeFormSchemaType = z.infer<typeof LEAVE_TYPE_FORM_SCHEMA>;
