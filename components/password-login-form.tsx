"use client";

import { toast } from "sonner";
import { UNKNOWN_ERROR } from "@/constants";
import { signIn } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const PasswordLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const onSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await signIn.magicLink({
        email: email,
        name: email.split("@")[0],
        callbackURL: "/",
        newUserCallbackURL: "/",
      });
      setIsLoading(false);

      if (error) {
        toast.error("Failed to sign in with email", {
          description: error.message || error.statusText,
        });
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : UNKNOWN_ERROR;
      toast.error("Unexpected Error", {
        description: errorMessage,
      });
      console.error(error);
    }
  };

  return (
    <form className="space-y-4">
      <FormItem>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </FormItem>

      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={onSignIn}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "Sign In"}
      </Button>
    </form>
  );
};
