import { auth } from "@/lib/auth";

import type {
  UserDetailTableSelectType,
  UserTableSelectType,
} from "@/db/types";

export interface CustomResponse {
  success: boolean;
  data?: Record<string, any>;
  error?: String;
}

export type SessionType = Exclude<
  Awaited<ReturnType<typeof auth.api.getSession>>,
  null
>;

export type UserType = {
  user: UserTableSelectType;
  user_detail: UserDetailTableSelectType | null;
};
