import type { PolicyTableSelectType } from "@/types";
export type { PolicyFormSchemaType } from "@/lib/schema/policy";

export interface PolicyFormProps {
  policy: PolicyTableSelectType | null;
}
