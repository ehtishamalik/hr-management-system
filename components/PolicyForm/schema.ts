import { STATUS } from "@/enum";
import z from "zod";

export const PolicyFormSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(255),
  policy: z.string(),
  isActive: z.enum([STATUS.ACTIVE, STATUS.INACTIVE], {
    required_error: "Please select the status.",
    message: "Leave status is required.",
  }),
});
