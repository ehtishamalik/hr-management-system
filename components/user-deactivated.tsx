"use client";

import Headline from "./headline";

import { signOut } from "@/lib/auth/auth-client";
import { useEffect } from "react";

export const UserDeactivated = () => {
  useEffect(() => {
    signOut();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Headline className="text-2xl font-bold">Account Deactivated</Headline>
      <p className="text-muted-foreground">
        Your account has been deactivated. Please contact support for more
        information.
      </p>
    </div>
  );
};
