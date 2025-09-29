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
import { Eye, EyeClosed, LoaderCircle } from "lucide-react";
import { EMAIL_POSTFIX, UNKNOWN_ERROR } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .refine((val) => !val.includes("@"), {
      message: "Please enter only the email username without '@'.",
    }),
  password: z
    .string()
    .min(8, { message: "Password is required." })
    .max(128, { message: "Password must be at most 128 characters." }),
});

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "johndoe",
      password: "password1234",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const fullEmail = `${values.email}${EMAIL_POSTFIX}`;

    try {
      const { error } = await authClient.signIn.email({
        email: fullEmail,
        password: values.password,
      });

      if (error) {
        toast.error("Login Failed", {
          description: error.message,
        });
      } else {
        toast.success("Login Successful", {
          description:
            "You have been logged in successfully. Please wait while we redirect you.",
        });
        router.push("/");
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
                    placeholder="Enter your email"
                    className="pe-28"
                    {...field}
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    {EMAIL_POSTFIX}
                  </span>
                </div>
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="flex">
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    className="rounded-r-none"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  size="icon"
                  type="button"
                  variant="outline"
                  className="rounded-l-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </div>
              <FormDescription className="text-left">
                Just click submit, for demo we have already added email and
                password of admin account in fields.
              </FormDescription>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit {isLoading && <LoaderCircle className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};
