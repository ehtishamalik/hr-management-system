import type { LEAVE_STATUS } from "@/enum";
import type {
  LeaveRemarkTableSelectType,
  SessionType,
  UserTableSelectType,
} from "@/types";

export interface LeaveRemarksFormProps {
  leaveId: string;
  leaveStatus: keyof typeof LEAVE_STATUS;
  session: SessionType;
}

export interface LeaveRemarksHookProps {
  leaveId: string;
  leaveStatus: keyof typeof LEAVE_STATUS;
  session: SessionType;
}

export interface remarkType {
  leave_remark: LeaveRemarkTableSelectType;
  user: UserTableSelectType | null;
}

export type remarksType = remarkType[];
