import { LEAVE_STATUS } from "@/enum";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../ui/button";

import type {
  LeaveRemarkTableSelectType,
  UserTableSelectType,
} from "@/db/types";
import type { SessionType } from "@/types";

export interface LeaveRemarksFormProps {
  leaveId: string;
  leaveStatus: keyof typeof LEAVE_STATUS | null;
  remarkCount: number;
  session: SessionType;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  bubbleUp?: boolean;
}

export interface LeaveRemarksHookProps {
  leaveId: string;
  session: SessionType;
}

export interface remarkType {
  leave_remark: LeaveRemarkTableSelectType;
  user: UserTableSelectType | null;
}

export type remarksType = remarkType[];
