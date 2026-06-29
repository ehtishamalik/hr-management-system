import Headline from "@/components/headline";
import NotFoundBanner from "@/components/not-found-banner";

export const dynamic = "force-dynamic";

import { ROLE } from "@/enum";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { getSession } from "@/lib/auth/session";
import { getUserProfile } from "@/services/user";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";

const roleMap: Record<ROLE | "None", string> = {
  [ROLE.USER]: "Employee",
  [ROLE.MANAGER]: "Manager",
  [ROLE.ADMIN]: "Administrator",
  None: "None",
};

const Profile = async () => {
  const session = await getSession();
  const [userProfile] = await getUserProfile(session.user.id);

  if (!userProfile) {
    return (
      <NotFoundBanner
        headline="Employee not found"
        description="Failed to load employee profile."
      />
    );
  }

  const { user, user_detail, team_lead } = userProfile;

  return (
    <>
      <Headline>Profile Details</Headline>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormItem>
          <Label>Employee ID</Label>
          <p>{user_detail?.employeeId ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Name</Label>
          <p>{user.name ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Email</Label>
          <p>{user.email ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Role</Label>
          <p>{roleMap[user_detail?.role ?? "None"]}</p>
        </FormItem>
        <FormItem>
          <Label>Team Lead</Label>
          <p>{team_lead?.name ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Designation</Label>
          <p>{user_detail?.designation ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Joined At</Label>
          <p>{formatDateTime(user.createdAt)}</p>
        </FormItem>
        <FormItem>
          <Label>Phone Number</Label>
          <p>{user_detail?.phone ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Address</Label>
          <p>{user_detail?.address ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Date of Birth</Label>
          <p>{user_detail?.dob ? formatDate(user_detail.dob) : "None"}</p>
        </FormItem>
        <FormItem>
          <Label>CNIC</Label>
          <p>{user_detail?.cnic ?? "None"}</p>
        </FormItem>
      </section>

      <Headline type="h2">Compensation Details</Headline>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormItem>
          <Label>Currency</Label>
          <p>{user_detail?.currency ?? "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Salary</Label>
          <p>{formatNumber(user_detail?.salary) || "None"}</p>
        </FormItem>
        <FormItem>
          <Label>Tax Amount</Label>
          <p>{formatNumber(user_detail?.taxAmount) || "None"}</p>
        </FormItem>
      </section>
    </>
  );
};

export default Profile;
