import Headline from "@/components/headline";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PasswordLoginForm } from "@/components/password-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (session?.user.id) {
    redirect("/");
  }

  return (
    <main className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <Card>
          <CardHeader>
            <CardTitle>
              <Headline>Welcome to HRM System</Headline>
            </CardTitle>
            <CardDescription>
              Sign in to continue to your dashboard
              <br />
              <em>An admin account is prefilled for your convenience</em>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordLoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Login;
