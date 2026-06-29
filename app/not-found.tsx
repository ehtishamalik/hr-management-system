import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const NotFound = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-neutral-700 dark:text-neutral-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {session ? (
            <Button asChild size="lg">
              <Link href="/">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
