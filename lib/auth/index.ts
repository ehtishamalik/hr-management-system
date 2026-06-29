import * as schema from "@/db/schema";

import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { IS_PRODUCTION, ORIGIN_URL } from "@/constants";
import { db } from "@/db/drizzle";
import { UserDetailTable } from "@/db/schema";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const HAS_GOOGLE_CREDS = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  baseURL: ORIGIN_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  socialProviders: {
    ...(HAS_GOOGLE_CREDS && {
      google: {
        prompt: "select_account",
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      },
    }),
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
    ...(!IS_PRODUCTION
      ? [
          magicLink({
            sendMagicLink: async ({ email, token, url }) => {
              console.log(email, token, url);
            },
          }),
        ]
      : []),
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
