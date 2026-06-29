import Headline from "@/components/headline";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { IS_PRODUCTION } from "@/constants";
import { PasswordLoginForm } from "@/components/password-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
              <Headline>Welcome to Lycus Inc.</Headline>
            </CardTitle>
            <CardDescription>
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>
          {!IS_PRODUCTION && (
            <>
              <CardContent>
                <PasswordLoginForm />
              </CardContent>
              <div className="flex items-center gap-4 px-6 text-sm text-muted-foreground">
                <span className="h-px bg-muted-foreground inline-block w-fit flex-1"></span>
                OR
                <span className="h-px bg-muted-foreground inline-block w-fit flex-1"></span>
              </div>
            </>
          )}
          <CardFooter>
            <LoginForm />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Login;
