import Headline from "@/components/headline";
import OnboardingForm from "@/components/OnboardingForm";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

const Login = async () => {
  const session = await getSession();

  if (session.user.id && session.user.role) {
    redirect("/");
  }

  return (
    <main className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-xl space-y-2">
        <Headline className="text-center">User Onboarding</Headline>
        <p className="text-muted-foreground text-center mb-8">
          Please fill in the details to complete your profile.
        </p>
        <OnboardingForm session={session} />
      </div>
    </main>
  );
};

export default Login;
