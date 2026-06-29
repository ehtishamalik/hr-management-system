"use client";

import Image from "next/image";
import Google from "@/public/icons/google.svg";

import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { UNKNOWN_ERROR } from "@/constants";
import { sendSlackNotification } from "@/lib/slack-notifier";

export const LoginForm = () => {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setIsPending(true);
      const { error } = await signIn.social({
        provider: "google",
      });

      if (error) {
        sendSlackNotification("Login Error", error);
        toast.error("Failed to sign in with Google", {
          description: error.message || error.statusText,
        });
      } else {
        toast.info(
          "Please wait while we redirect you to the Google OAuth page",
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : UNKNOWN_ERROR;
      toast.error("Unexpected Error", {
        description: errorMessage,
      });
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      className="w-full shadow-sm hover:shadow-md"
      variant="secondary"
      onClick={handleLogin}
      disabled={isPending}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <Image src={Google} alt="Google Icon" loading="eager" />
      )}
      Sign in with Google
    </Button>
  );
};
