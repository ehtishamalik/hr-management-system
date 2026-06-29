import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { IS_PRODUCTION } from "@/constants";

export const authClient = createAuthClient({
  plugins: [...(!IS_PRODUCTION ? [magicLinkClient()] : [])],
});

export const { signIn, signUp, signOut, useSession } = authClient;
