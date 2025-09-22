import { Resend } from "resend";
import { sendSlackErrorNotification } from "@/lib/slackNotifier";
import { OTPEmailTemplate } from "@/components/EmailTemplates";
import { LeaveRequestEmail } from "@/components/EmailTemplates";
import { handleErrorWithSlack } from "@/lib/error";
import { MagicLinkEmailTemplate } from "@/components/EmailTemplates";

import type { CustomResponse, UserType } from "@/types";
import type { LeaveTableInsertType } from "@/db/types";
import { UNKNOWN_ERROR } from "@/constants";

class EmailService {
  private resend: Resend;
  private from = "";
  private to: string | undefined = undefined;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not defined in environment variables."
      );
    }

    if (!process.env.RESEND_FROM) {
      throw new Error("RESEND_FROM is not defined in environment variables.");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = process.env.RESEND_FROM;
    this.to = process.env.RESEND_TO;
  }

  getToEmail(email: string) {
    return this.to ?? email;
  }

  async sendOtpEmail({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<CustomResponse> {
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: [this.getToEmail(email)],
        subject: "OTP Request",
        react: OTPEmailTemplate({ otp }),
      });

      if (error) {
        return {
          success: false,
          error: `${error.name}: ${error.message}` || UNKNOWN_ERROR,
        };
      }

      return { success: true };
    } catch (error) {
      return handleErrorWithSlack(
        "ERROR sending OTP email, unexpected issue.",
        error
      );
    }
  }

  async sendMagicLink({
    email,
    url,
  }: {
    email: string;
    url: string;
  }): Promise<CustomResponse> {
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: [this.getToEmail(email)],
        subject: "Login to Your Account",
        react: MagicLinkEmailTemplate({ url }),
      });

      if (error) {
        await sendSlackErrorNotification("Resend Error: Magic Link", {
          email,
          url,
          error,
        });

        return { success: false, error: error.message || "Unknown error" };
      }

      return { success: true };
    } catch (err) {
      await handleErrorWithSlack("Unhandled exception in sendMagicLink", {
        email,
        url,
        err,
      });

      return { success: false, error: "Unexpected error sending magic link" };
    }
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
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to: [this.getToEmail(email)],
        subject: "Leave Requested",
        react: LeaveRequestEmail({ leave, user }),
      });

      if (error) {
        sendSlackErrorNotification("ERROR sending Leave Request email.", error);
      }
    } catch (error) {
      handleErrorWithSlack(
        "Unexpected error while sending Leave Request email.",
        error
      );
    }
  }
}

export const emailService = new EmailService();
