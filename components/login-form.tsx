"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { EMAIL_POSTFIX, UNKNOWN_ERROR } from "@/constants";
import { signIn } from "@/lib/auth-client";

import { UserType } from "@/types";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .refine((val) => !val.includes("@"), {
      message: "Please enter only the email username without '@'.",
    }),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const fullEmail = `${values.email}${EMAIL_POSTFIX}`;

    try {
      const response = await fetch(`/api/user?email=${fullEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        toast.error("Error", {
          description:
            responseData.error ||
            "Failed to fetch user data. Please wait and try again.",
        });
        return;
      }

      const user: UserType = responseData.data;

      const { error } = await signIn.magicLink({
        email: user.user.email,
        name: user.user.name,
        callbackURL: "/",
        errorCallbackURL: "/login",
      });

      if (error) {
        toast.error("Failed to send the Magic Link email.", {
          description: error.message || error.statusText,
        });
      } else {
        toast.success("Magic Link sent successfully!", {
          description: "Please check your email for the Magic Link.",
        });
      }
    } catch (error) {
      toast.error("Unexpected Error", {
        description: UNKNOWN_ERROR,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter you email"
                    className="pe-28"
                    {...field}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    {EMAIL_POSTFIX}
                  </span>
                </div>
              </FormControl>
              <FormDescription className="text-left">
                You will recieve an email with Magic Link.
              </FormDescription>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Send Magic Link{" "}
          {isLoading ? <LoaderCircle className="animate-spin" /> : "🪄"}
        </Button>
      </form>
    </Form>
  );
};
