import { z } from "zod";

export const USER_FORM_SCHEMA = z.object({
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
  teamLeadId: z.string({ message: "Team Lead Required." }),
  designation: z.string().max(100).optional(),
  joinedAt: z.string().optional(),

  dob: z.string().optional(),
  cnic: z.string().max(15).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),

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

  profileImage: z.string().optional(),
});
