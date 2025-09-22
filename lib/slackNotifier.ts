export const sendSlackErrorNotification = async (
  message: string,
  error: unknown
) => {
  const webhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[ERROR] Slack webhook URL is not defined.");
    return;
  }

  const errorString = JSON.stringify(error, null, 2);
  const slackMessage = `🚨 Error in ${process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV} in ${message}:\n\n\`\`\`json\n${errorString}\n\`\`\``;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: slackMessage,
    }),
  });
};
