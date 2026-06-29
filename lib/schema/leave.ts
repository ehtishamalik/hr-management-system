import * as z from "zod";

export const leaveFormSchema = z.object({
  date: z
    .object(
      {
        from: z.date({ error: "From date is required" }),
        to: z.date().optional(),
      },
      { message: "Please pick a valid date range." },
    )
    .refine((data) => !!data, {
      message: "Date is required.",
    }),
  numberOfDays: z.number(),
  leaveTypeId: z.string({ message: "Leave type is required" }),
  reason: z
    .string()
    .min(
      1,
      "Reason content cannot be empty. Please provide valid content for the reason.",
    ),
});

export type LeaveFormSchemaType = z.infer<typeof leaveFormSchema>;
