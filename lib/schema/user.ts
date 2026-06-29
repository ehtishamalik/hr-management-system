import * as z from "zod";
import { CNIC_REGEX, PHONE_NUMBER_REGEX } from "@/constants";

export const onboardingFormSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      PHONE_NUMBER_REGEX,
      "Phone number must be in format +92 3XX XXXXXXX",
    ),

  address: z.string().min(1, "Address is required"),

  dob: z.string().min(1, "Date of birth is required"),

  cnic: z
    .string()
    .min(1, "CNIC is required")
    .regex(CNIC_REGEX, "CNIC must be in format 12345-1234567-1"),

  emergency_contact_name: z
    .string()
    .min(1, "Emergency contact name is required")
    .max(255),

  emergency_contact_relation: z
    .string()
    .min(1, "Emergency contact relation is required")
    .max(120),

  emergency_contact_number: z
    .string()
    .min(1, "Emergency contact number is required")
    .regex(
      PHONE_NUMBER_REGEX,
      "Phone number must be in format +92 3XX XXXXXXX",
    ),
});

export type OnboardingFormSchemaType = z.infer<typeof onboardingFormSchema>;

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full Name is required." })
    .max(255, { message: "Full Name must be at most 255 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(100, { message: "Email must be at most 100 characters." })
    .refine((val) => !val.includes("@"), {
      message: "Email should not contain '@' or email formatting.",
    }),
  employeeId: z.string().min(1, { message: "Employee ID cannot be empty." }),
  role: z.enum(["USER", "ADMIN", "MANAGER"]).default("USER"),
  teamLeadId: z.string().optional(),
  designation: z.string().max(100).optional(),
  joinedAt: z.string().optional(),

  dob: z.string().optional(),
  cnic: z
    .string()
    .min(1, { message: "CNIC is required." })
    .max(15, { message: "CNIC must be at most 15 characters." })
    .regex(CNIC_REGEX, "CNIC must be in format 12345-1234567-1"),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .max(15, { message: "Phone number must be at most 15 characters." })
    .regex(
      PHONE_NUMBER_REGEX,
      "Phone number must be in format +92 3XX XXXXXXX",
    ),
  address: z.string().optional(),

  currency: z.string().min(1, { message: "Currency is required." }),
  salary: z.preprocess((val) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/,/g, "");
      return cleaned === "" ? undefined : Number(cleaned);
    }
    return val;
  }, z.number().optional()),
  taxAmount: z.preprocess((val) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/,/g, "");
      return cleaned === "" ? undefined : Number(cleaned);
    }
    return val;
  }, z.number().optional()),
});

export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
