import type { UserType } from "@/types";
export type { ProfileFormSchemaType as UserFormSchemaType } from "@/lib/schema/user";

export interface ProfileFormProps {
  employee: UserType;
  managers: UserType[];
  admins: UserType[];
}
