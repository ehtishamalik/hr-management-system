import type { LeaveDefinition, LeaveTableSelectType } from "@/types";

export type { LeaveFormSchemaType } from "@/lib/schema/leave";

export interface LeaveFormProps {
  leaveTypes: LeaveDefinition[];
  userId?: string;
  calendarDisabled?: boolean;
  editData?: LeaveTableSelectType;
  isAdmin?: boolean;
  isOwner?: boolean;
}

export interface UseLeaveFormProps {
  userId?: string;
  editData?: LeaveTableSelectType;
  isAdmin?: boolean;
}
