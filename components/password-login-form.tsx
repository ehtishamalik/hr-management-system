"use client";

import { toast } from "sonner";
import { UNKNOWN_ERROR } from "@/constants";
import { signIn } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type SubmitEventHandler, useState } from "react";

export const PasswordLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("michael.anderson@example.com");
  const [password, setPassword] = useState("Password123");

  const onSignIn: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const { error } = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Failed to sign in", {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSignIn}>
      <FormItem>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </FormItem>

      <FormItem>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="●●●●●●●●"
          required
        />
      </FormItem>

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "Sign In"}
      </Button>
    </form>
  );
};
