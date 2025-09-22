import z from "zod";

import { LEAVE_TYPE, STATUS } from "@/enum";

export const LEAVE_TYPE_FORM_SCHEMA = z.object({
  name: z
    .string({ required_error: "Leave type name is required." })
    .min(2, { message: "Leave type name must be at least 2 characters." })
    .max(50, { message: "Leave type name must be at most 50 characters." }),

  description: z.string().optional(),

  isPrivate: z.boolean(),

  maxAllowed: z.coerce.number({
    invalid_type_error: "Please enter a valid number",
  }),

  dayFraction: z.coerce
    .number({
      invalid_type_error: "Please enter a valid number",
    })
    .optional(),

  leaveCategory: z.enum([LEAVE_TYPE.PAID, LEAVE_TYPE.UNPAID], {
    message: "Leave category is required.",
  }),

  status: z.enum([STATUS.ACTIVE, STATUS.INACTIVE], {
    required_error: "Please select the status.",
    message: "Leave status is required.",
  }),
});
