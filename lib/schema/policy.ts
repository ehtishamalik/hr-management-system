import * as z from "zod";
import { STATUS } from "@/enum";

export const policyFormSchema = z.object({
  title: z
    .string()
    .min(2, { error: "Title must be at least 2 characters long." })
    .max(100, { error: "Title must be at most 100 characters long." }),
  description: z
    .string()
    .min(2, {
      error:
        "Description must be at least 2 characters long. Try explaining the policy in a bit detail.",
    })
    .max(255, { error: "Description must be at most 255 characters long." }),
  policy: z.string(),
  isActive: z.enum([STATUS.ACTIVE, STATUS.INACTIVE], {
    error: "Please select the policy status.",
  }),
});

export type PolicyFormSchemaType = z.infer<typeof policyFormSchema>;
