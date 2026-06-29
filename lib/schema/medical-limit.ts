import * as z from "zod";

export const medicalLimitSchema = z.object({
  year: z.string().min(1, { error: "Year is required" }),
  amount: z
    .string()
    .min(1, { error: "Amount is required" })
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      error: "Amount must be greater than 0",
    }),
});

export type MedicalLimitSchema = z.infer<typeof medicalLimitSchema>;
