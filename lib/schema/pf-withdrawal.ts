import * as z from "zod";

export const pfWithdrawalSchema = z.object({
  amount: z
    .string()
    .min(1, { error: "Withdrawal amount is required" })
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      error: "Amount must be greater than 0",
    }),
  month: z
    .string({ error: "Month is required" })
    .min(1, { error: "Month is required" }),
  year: z
    .string({ error: "Year is required" })
    .min(1, { error: "Year is required" }),
  remarks: z.string().optional(),
});

export type PFWithdrawalSchema = z.infer<typeof pfWithdrawalSchema>;
