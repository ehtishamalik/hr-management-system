import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const URL: string = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    ? process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    : URL,
  plugins: [magicLinkClient()],
});
