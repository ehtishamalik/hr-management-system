"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { sendSlackNotification } from "@/lib/slack-notifier";
import Headline from "@/components/headline";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string; environmentName?: string };
}) {
  useEffect(() => {
    console.error(`Global Error: ${error.digest}\n${error.message}`);

    const notify = async () => {
      await sendSlackNotification(`Global Error: ${error.digest}`, {
        name: error.name,
        message: error.message,
        environmentName: error.environmentName,
        stack: error.stack,
      });
    };

    notify();
  }, [error]);

  return (
    <html lang="en">
      <body className="flex flex-col justify-center items-center gap-4 h-screen">
        <Headline type="h2">Uh-oh, something went wrong 😔</Headline>
        <p className="text-center max-w-md text-gray-600">
          We ran into an unexpected issue. Our team has been notified
          (we&apos;ve sent a Slack alert 📣), and we&apos;re on it. In the
          meantime, you can try again or head back to the dashboard.
        </p>
        <div className="space-x-4">
          <Button variant="default" onClick={() => window.location.assign("/")}>
            Go to Dashboard
          </Button>
        </div>
      </body>
    </html>
  );
}
