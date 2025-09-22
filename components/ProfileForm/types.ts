import z from "zod";

import type { USER_FORM_SCHEMA } from "./schema";
import type { UserType } from "@/types";

export interface ProfileFormProps {
  managementUsers: UserType[];
  employee: UserType | null;
}

export type UserFormSchemaType = z.infer<typeof USER_FORM_SCHEMA>;
