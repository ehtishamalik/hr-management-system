export const EMAIL_POSTFIX = "@lycusinc.com";
export const UNKNOWN_ERROR = "An unknown error occurred.";
export const NOT_ASSIGNED = "Not Assigned";

const PREVIEW_URL: string = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
export const ORIGIN_URL = process.env.BETTER_AUTH_URL ?? PREVIEW_URL;

export const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || "development";
export const IS_PRODUCTION = VERCEL_ENV === "production";

export const TIME_ZONE = "Asia/Karachi";

export const MEDICAL_EXPENSE_START_YEAR = 2026;
export const START_YEAR = 2021;
export const MEDICAL_EXPENSE_YEARLY_LIMIT = 300000;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
