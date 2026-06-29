import type { PFSettingsTableSelectType } from "@/types";

export type UserRow = {
  user: { id: string; name: string; email: string };
  userDetail: { employeeId: string | null; designation: string | null } | null;
  pfSettings: PFSettingsTableSelectType | null;
};

export interface PFSettingsTableProps {
  allUsers: UserRow[];
}
