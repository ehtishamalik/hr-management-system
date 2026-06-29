import Link from "next/link";
import Headline from "@/components/headline";
import LeaveForm from "@/components/LeaveForm";
import NotFoundBanner from "@/components/not-found-banner";

import { getLeaveTypesForLeave } from "@/services/leave-type";
import { getUserById } from "@/services/user";
import { LeaveCards } from "@/components/leave-cards";
import { getUserLeaveStats } from "@/services/leave-stats";

const AddLeave = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUserById(id);
  const leaveTypes = await getLeaveTypesForLeave(true);
  const userLeaves = await getUserLeaveStats(id);

  if (!user) {
    return (
      <NotFoundBanner
        headline="Employee not found"
        description="The employee you are looking for does not exist."
      />
    );
  }

  return (
    <>
      <section className="space-y-2">
        <Headline>Add Leave</Headline>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to add a leave for{" "}
          <Link
            href={`/admin/balances/${user.user.id}`}
            className="underline underline-offset-2"
          >
            {user.user.name}
          </Link>{" "}
          .
        </p>
      </section>

      <LeaveCards leaves={userLeaves} />

      <section className="border p-4 rounded-2xl">
        <LeaveForm leaveTypes={leaveTypes} userId={user.user.id} />
      </section>
    </>
  );
};

export default AddLeave;
