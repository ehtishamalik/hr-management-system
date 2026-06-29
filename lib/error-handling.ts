import { UNKNOWN_ERROR } from "@/constants";
import { toast } from "sonner";
import { sendSlackNotification } from "./slack-notifier";
import { cleanString } from "./utils";
import { AppError } from "./errors";

import type { DbError, ErrorResponse } from "@/types";

// Higher order function to handle errors
export const withErrorHandling = async (
  fn: () => Promise<void>,
  error: string,
) => {
  const handleRefresh = () => {
    window.location.reload();
  };
  try {
    await fn();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : UNKNOWN_ERROR;
    console.error("[ERROR]: ", err);
    toast.error(error, {
      description: errorMessage,
      action: {
        label: "Refresh",
        onClick: handleRefresh,
      },
    });
  }
};

export const handleServerResponse = async <T>(
  response: Response,
  fn: (data: T) => void,
) => {
  const data = await response.json();
  if (response.ok && data.success) {
    fn(data.data);
  } else {
    toast.error(data.error.message, {
      description: data.error.description,
    });
  }
};

export const handleError = (message: string, error: unknown): ErrorResponse => {
  console.error(error);

  if (error instanceof AppError) {
    console.log("============= APP ERROR =============");
    return {
      success: false,
      error: {
        message: cleanString(error.message),
        description: error.cause.detail,
        statusCode: error.cause.status,
      },
    };
  }

  if (
    (error as DbError).cause.name &&
    (error as DbError).cause.name === "NeonDbError"
  ) {
    console.log("============= NEON =============");

    return {
      success: false,
      error: {
        message: (error as DbError).cause.severity,
        description: cleanString((error as DbError).cause.detail),
        statusCode: 500,
      },
    };
  }

  if (error instanceof Error) {
    console.log("============= ERROR =============");
    return {
      success: false,
      error: {
        message: UNKNOWN_ERROR,
        description: error.message,
        statusCode: 500,
      },
    };
  }

  return {
    success: false,
    error: {
      message: message,
      description: UNKNOWN_ERROR,
      statusCode: 500,
    },
  };
};

export const handleErrorWithSlack = (message: string, error: unknown): void => {
  console.error(`[${message}]`, error);
  void sendSlackNotification(message, error);
};
