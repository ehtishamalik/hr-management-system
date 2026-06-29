import * as z from "zod";
import { STATUS } from "@/enum";

export const pfSettingSchema = z.object({
  employeeMonthlyAmount: z
    .string()
    .min(1, { error: "Monthly amount is required" })
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      error: "Amount must be greater than 0",
    }),
  companyContributionEnabled: z.boolean(),
  companyContributionAmount: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        return !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0;
      },
      {
        error: "Amount must be greater than 0",
      },
    ),
  companyContributionType: z.enum(["fixed", "match_employee"]).optional(),
  effectiveFrom: z.iso.date(),
  status: z.enum([STATUS.ACTIVE, STATUS.INACTIVE]),
});

export type PFSettingSchema = z.infer<typeof pfSettingSchema>;
