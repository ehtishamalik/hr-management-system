import * as z from "zod";

export const lateArrivalFormSchema = z.object({
  date: z.date({ error: "Date is required" }),
  time: z.iso.time({ message: "Time is required" }),
  comment: z.string(),
});

export type LateArrivalFormSchemaType = z.infer<typeof lateArrivalFormSchema>;
