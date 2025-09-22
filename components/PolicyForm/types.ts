import z from "zod";

import { PolicyFormSchema } from "./schema";

import type { PolicyTableSelectType } from "@/db/types";

export interface PolicyFormProps {
  policy: PolicyTableSelectType | null;
}

export type PolicyFormSchemaType = z.infer<typeof PolicyFormSchema>;

export interface handlePolicyActionProps {
  values: PolicyFormSchemaType;
  isActive?: boolean;
  isSaveDraft?: boolean;
}
