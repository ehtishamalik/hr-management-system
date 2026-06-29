import * as z from "zod";

export const pfManualEntrySchema = z.object({
  month: z.string("Month is required"),
  year: z.string("Year is required"),
  employeeContribution: z
    .string()
    .min(1, "Employee contribution is required")
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      error: "Amount must be greater than 0",
    }),
  companyContribution: z
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
  remarks: z.string().optional(),
});

export type PFManualEntrySchema = z.infer<typeof pfManualEntrySchema>;
