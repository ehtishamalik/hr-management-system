import { Resend } from "resend";
import { handleErrorWithSlack } from "@/lib/error-handling";
import { sendSlackNotification } from "@/lib/slack-notifier";
import { ORIGIN_URL } from "@/constants";
import { formatDateWithDay } from "@/lib/utils";

import type { LeaveTableInsertType } from "@/types";
import type { UserType } from "@/types";

class EmailService {
  private resend: Resend | null = null;
  private to: string = "";
  private isEnabled: boolean = false;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn(
        "[EmailService] RESEND_API_KEY is missing. Email sending is disabled.",
      );
      this.isEnabled = false;
      return;
    }

    this.resend = new Resend(apiKey);
    this.to = process.env.RESEND_TO || "";
    this.isEnabled = true;
  }

  getToEmail(email: string) {
    return this.to ? this.to : email;
  }

  isDisabled(info: string) {
    const isDisabled = !this.isEnabled || !this.resend;
    if (isDisabled) {
      console.info(`[EmailService Disabled]: ${info}`);
    }
    return isDisabled;
  }

  async sendLeaveRequestEmail({
    email,
    leave,
    user,
  }: {
    email: string;
    leave: LeaveTableInsertType;
    user: UserType;
  }): Promise<void> {
    const info = `Sending leave request email to ${this.getToEmail(email)} from ${user.user.name}`;

    // 🚫 If disabled → just log and exit
    if (this.isDisabled(info)) return;

    try {
      console.info(info);
      // biome-ignore lint/style/noNonNullAssertion: It is checked above
      const { error } = await this.resend!.emails.send({
        to: [this.getToEmail(email)],
        replyTo: user.user.email,
        template: {
          id: "leave-request",
          variables: {
            USER_NAME: user.user.name,
            USER_EMAIL: user.user.email,
            LEAVE_FROM: formatDateWithDay(leave.fromDate),
            LEAVE_TO: formatDateWithDay(leave.toDate),
            LEAVE_DAYS: leave.numberOfDays,
            LEAVE_REASON: leave.reason,
            LEAVE_URL: `${ORIGIN_URL}/manager/requests`,
          },
        },
      });

      if (error) {
        console.error("[Error]: ", error);
        sendSlackNotification("ERROR sending Leave Request email.", {
          info,
          error,
        });
      }
    } catch (error) {
      handleErrorWithSlack(
        "Unexpected error while sending Leave Request email.",
        error,
      );
    }
  }
}

export const emailService = new EmailService();
