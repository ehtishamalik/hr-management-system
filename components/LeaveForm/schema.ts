import z from "zod";

export const LEAVE_FORM_SCHEMA = z.object({
  date: z
    .object(
      {
        from: z.date({ required_error: "From date is required" }),
        to: z.date().optional(),
      },
      { message: "Please pick a valid date range." }
    )
    .refine((data) => !!data, {
      message: "Date is required.",
    }),
  numberOfDays: z.number().min(1, "Leave must be at least 1 day").max(365),
  leaveTypeId: z.string({ message: "Leave type is required" }),
  reason: z.string().min(1, "Reason is required").max(1000),
});
