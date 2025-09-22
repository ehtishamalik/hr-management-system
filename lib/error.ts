import { sendSlackErrorNotification } from "./slackNotifier";
import { cleanString } from "./utils";
import { UNKNOWN_ERROR } from "@/constants";

import type { CustomResponse } from "@/types";

export const handleError = (
  message: string,
  error: unknown
): CustomResponse => {
  if (
    error instanceof Error &&
    "cause" in error &&
    typeof error.cause === "object" &&
    error.cause !== null &&
    "detail" in error.cause
  ) {
    return { success: false, error: cleanString(error.cause.detail as string) };
  }

  console.error(
    JSON.stringify({
      "error on": message,
      error: error,
    })
  );
  return { success: false, error: UNKNOWN_ERROR };
};

export const handleErrorWithSlack = async (message: string, error: unknown) => {
  sendSlackErrorNotification(message, error);

  return handleError(message, error);
};
