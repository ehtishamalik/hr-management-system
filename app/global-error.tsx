"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sendSlackErrorNotification } from "@/lib/slackNotifier";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(`Global Error: ${error.digest}\n${error.message}`);

    const notify = async () => {
      await sendSlackErrorNotification(`Global Error: ${error.digest}`, {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
    };

    notify();
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center gap-4 h-screen">
        <h2 className="text-xl font-medium">Uh-oh, something went wrong 😔</h2>
        <p className="text-center max-w-md text-gray-600">
          We ran into an unexpected issue. Our team has been notified
          (we&apos;ve sent a Slack alert 📣), and we&apos;re on it. In the
          meantime, you can try again or head back to the dashboard.
        </p>
        <div className="space-x-4">
          <Button variant="default">
            <Link href="/">Go to Dashboard</Link>
          </Button>

          <Button onClick={() => reset()} variant="secondary">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
