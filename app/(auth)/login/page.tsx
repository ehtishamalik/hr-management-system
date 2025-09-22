import React from "react";

import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && session.user.id) {
    redirect("/");
  }

  return (
    <main className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold">Welcome to Lycus Inc.</h1>
        <LoginForm />
      </div>
    </main>
  );
};

export default Login;
