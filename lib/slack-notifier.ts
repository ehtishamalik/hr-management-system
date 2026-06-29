import { VERCEL_ENV } from "@/constants";

export const sendSlackNotification = async (
  message: string,
  error: unknown,
) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) return;

  const errorString = JSON.stringify(error, null, 2);
  const slackMessage = `🚨 Error in ${VERCEL_ENV || process.env.NODE_ENV} in ${message}:\n\n\`\`\`json\n${errorString}\n\`\`\``;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: slackMessage,
      }),
    });
  } catch (error) {
    console.error("Failed to send slack notification", error);
  }
};
