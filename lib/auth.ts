import * as schema from "@/db/schema/auth-schema";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { magicLink } from "better-auth/plugins";
import { emailService } from "./actions/email";
import { customSession } from "better-auth/plugins";
import { UserDetailTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { handleErrorWithSlack } from "./error";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (process.env.NODE_ENV === "development") {
          console.log("Magic link:", url);
        } else {
          const result = await emailService.sendMagicLink({ email, url });

          if (!result.success) {
            handleErrorWithSlack("Failed to send magic link", {
              email,
              url,
              error: result.error,
            });
          }
        }
      },
    }),

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
          role: userRole.role,
        },
        session,
      };
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 days
    },
  },
});
