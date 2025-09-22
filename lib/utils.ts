import { LEAVE_STATUS } from "@/enum";
import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  32
);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
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
  status: keyof typeof LEAVE_STATUS | null
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
    default:
      return "text-amber-500";
  }
};

export const isDateDisabled =
  (calendarDisabled: boolean) =>
  (date: Date): boolean => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    if (isWeekend) return true;

    if (calendarDisabled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }

    return false;
  };

export const clipText = (str: string, maxLength = 20) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

export const formatCurrency = (val: number) =>
  `${Math.floor(val).toLocaleString("en-US")}.00`;

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return (
    d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const cleanString = (input: string) => {
  if (!input) return "";

  return input
    .replace(/[{}()\[\]=]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const getValueFromRequest = (request: NextRequest, param: string) => {
  const { searchParams } = new URL(request.url);
  return searchParams.get(param);
};
