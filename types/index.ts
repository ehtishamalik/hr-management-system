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

export type SessionType = {
  user: {
    role: "USER" | "MANAGER" | "ADMIN";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
};

export type UserType = {
  user: UserTableSelectType;
  user_detail: UserDetailTableSelectType | null;
};
