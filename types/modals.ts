import type { auth } from "@/lib/auth";
import type { UserDetailTableSelectType, UserTableSelectType } from "./db";
import type { LEAVE_TYPE } from "@/enum";

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    description: string;
    statusCode: number;
  };
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type SessionType = Exclude<
  Awaited<ReturnType<typeof auth.api.getSession>>,
  null
>;

export type UserType = {
  user: UserTableSelectType;
  user_detail: UserDetailTableSelectType | null;
};

export type LeaveCardItem = {
  id: string;
  name: string;
  taken: number;
  maxAllowed?: number | null;
};

export type LeaveDefinition = {
  id: string; // Unique identifier for the leave type (e.g. 'casual', 'sick')
  name: string;
  description: string;
  category: LEAVE_TYPE;
  maxAllowed: number | null; // Optional limit

  // Visibility Flags
  showOnDashboard: boolean; // Visible on User/Admin Dashboard stats
  userCanApply: boolean; // Available for User to select in application form
};
