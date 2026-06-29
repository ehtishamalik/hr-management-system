import * as schema from "@/db/schema";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { ORIGIN_URL } from "@/constants";
import { betterAuth } from "better-auth";
import { UserDetailTable } from "@/db/schema";
import { customSession } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  baseURL: ORIGIN_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    customSession(async ({ user, session }) => {
      const [userRole] = await db
        .select({
          role: UserDetailTable.role,
        })
        .from(UserDetailTable)
        .where(eq(UserDetailTable.userId, session.userId));

      return {
        user: {
          ...user,
          role: userRole ? userRole.role : null,
        },
        session,
      };
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 12, // 12 hours
    },
  },
  advanced: {
    trustedProxyHeaders: true,
  },
});
