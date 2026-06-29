import Link from "next/link";
import Headline from "@/components/headline";
import LeaveTable from "@/components/Leave-table";
import NotFoundBanner from "@/components/not-found-banner";
import LateArrivalForm from "@/components/LateArrivalForm";
import LateArrivalResolveForm from "@/components/LateArrivalResolveForm";

import { PlusCircleIcon } from "lucide-react";
import { LeaveCards } from "@/components/leave-cards";
import { Button } from "@/components/ui/button";
import { getUserLeaves } from "@/services/leave";
import { getUserById } from "@/services/user";
import { getUserLeaveStats } from "@/services/leave-stats";
import { getUserLateArrivals } from "@/services/late-arrival";

const UserBalance = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return (
      <NotFoundBanner
        headline="Employee not found"
        description="The employee you are looking for does not exist."
      />
    );
  }

  const userLeaves = await getUserLeaveStats(id);
  const allLeaves = await getUserLeaves({
    userId: id,
  });
  const lateArrivals = await getUserLateArrivals(id);

  return (
    <>
      <section className="flex flex-col md:flex-row gap-4 justify-between">
        <Headline>Leave History of {user.user.name}</Headline>

        {user.user_detail?.status === "ACTIVE" && (
          <Button size="sm" asChild>
            <Link href={`/admin/balances/${user.user.id}/add`}>
              <PlusCircleIcon />
              Add Leave
            </Link>
          </Button>
        )}
      </section>

      <LeaveCards leaves={userLeaves} />

      <LeaveTable leaves={allLeaves} isAdminView />

      <section className="flex flex-col md:flex-row gap-4 justify-between pt-6">
        <Headline type="h3">Late Arrivals of {user.user.name}</Headline>
        <LateArrivalForm userId={id} />
      </section>

      <LateArrivalResolveForm userId={id} lateArrivals={lateArrivals} />
    </>
  );
};

export default UserBalance;
