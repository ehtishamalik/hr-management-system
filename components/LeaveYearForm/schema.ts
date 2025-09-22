import z from "zod";

export const LEAVE_YEAR_FORM_SCHEMA = z.object({
  name: z.string().min(2).max(100),
  startDate: z.string(),
});
