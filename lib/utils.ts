import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { TIME_ZONE } from "@/constants";
import { format, parse } from "date-fns";

import { type ClassValue, clsx } from "clsx";
import type { NextRequest } from "next/server";
import type { SessionType } from "@/types";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  32,
);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getActiveLeaveYear = () => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date());
};

export const getInitials = (fullName: string): string => {
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

export const getLeaveStatusClass = (
  status: keyof typeof LEAVE_STATUS | null,
): string => {
  switch (status) {
    case LEAVE_STATUS.APPROVED:
      return "text-emerald-600";
    case LEAVE_STATUS.REJECTED:
      return "text-destructive";
    case LEAVE_STATUS.ACCEPTED:
      return "text-blue-600";
    case LEAVE_STATUS.SUSPENDED:
      return "text-yellow-600";
    case LEAVE_STATUS.LATE:
      return "text-lime-600";
    default:
      return "text-orange-500";
  }
};

export const isDateDisabled =
  (calendarDisabled: boolean) =>
  (date: Date): boolean => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) return true;

    if (calendarDisabled) {
      // Get today's date in Pakistan timezone
      const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: TIME_ZONE }),
      );
      today.setHours(0, 0, 0, 0);

      // Ensure the comparison date is also treated as local to PKT if needed,
      // but usually date-picker dates are 00:00:00 local.
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);

      return compareDate < today;
    }

    return false;
  };

export const clipText = (str: string, maxLength = 20) => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

export const cleanString = (input: string) => {
  if (!input) return "";

  return input
    .replace(/[{}()[\]=]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const getValueFromRequest = (request: NextRequest, param: string) => {
  const { searchParams } = new URL(request.url);
  return searchParams.get(param);
};

export const isRichTextEmpty = (html: string): boolean => {
  const stripped = html
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/&nbsp;/g, "") // remove non-breaking spaces
    .replace(/\s/g, ""); // remove all whitespace

  return stripped.length === 0;
};

export const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
};

export const getLeaveStatues = (leaveStatus: keyof typeof LEAVE_STATUS) => {
  return {
    isPending: leaveStatus === LEAVE_STATUS.PENDING,
    isAccepted: leaveStatus === LEAVE_STATUS.ACCEPTED,
    isApproved: leaveStatus === LEAVE_STATUS.APPROVED,
    isRejected: leaveStatus === LEAVE_STATUS.REJECTED,
    isSuspended: leaveStatus === LEAVE_STATUS.SUSPENDED,
    isLate: leaveStatus === LEAVE_STATUS.LATE,
  };
};

export const getRoleStatues = (session: SessionType) => {
  return {
    isUser: session.user.role === ROLE.USER,
    isManager: session.user.role === ROLE.MANAGER,
    isAdmin: session.user.role === ROLE.ADMIN,
  };
};

// ==================== FORMATTERS ====================

export const formatCurrency = (value: string | number) =>
  Number.parseInt(value.toString(), 10).toLocaleString("en-US");

export const formatDate = (date: Date | string, small?: boolean): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: small ? "short" : "long",
    day: "numeric",
    timeZone: TIME_ZONE,
  });
};

export const formatDateWithDay = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    // year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: TIME_ZONE,
  });
};

export const formatNumber = (
  value: string | unknown | null | undefined,
  fallback?: string,
): string => {
  if (!value) return fallback || "";
  const cleaned = String(value).replace(/,/g, "");
  const numbered = Number(cleaned);

  if (Number.isNaN(numbered)) return fallback || "";

  return numbered.toLocaleString("en-US");
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return (
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: TIME_ZONE,
    }) +
    " - " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TIME_ZONE,
    })
  );
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
};

export const formatTimeString = (time: string): string => {
  const parsed = parse(time, "HH:mm:ss", new Date());
  return format(parsed, "hh:mm a");
};

export const toDateInputValue = (date?: Date | string) => {
  const d = date
    ? typeof date === "string"
      ? new Date(date)
      : date
    : new Date();

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};

export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!digits.startsWith("92")) return "+92 ";

  const part1 = digits.slice(2, 5);
  const part2 = digits.slice(5, 12);

  let result = "+92";
  if (part1) result += ` ${part1}`;
  if (part2) result += ` ${part2}`;

  return result;
};

export const formatCNIC = (value: string) => {
  const digits = value.replace(/\D/g, "");

  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);

  let result = part1;
  if (part2) result += `-${part2}`;
  if (part3) result += `-${part3}`;

  return result;
};
