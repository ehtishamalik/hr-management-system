import React from "react";

import { LEAVE_STATUS, ROLE } from "@/enum";
import { LeaveProcessCards } from "@/components/leave-process-cards";
import { redirect } from "next/navigation";
import ToastError from "@/components/toast-error";
import { getAllLeavesRequests } from "@/lib/helpers/manager/requests";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Requests = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const allLeaves = await getAllLeavesRequests();

  if (!allLeaves) {
    return <ToastError message="Error fetching leave requests" />;
  }

  const managerId = session.user.id;

  const [teamLeaves, otherLeaves] = allLeaves.reduce<
    [typeof allLeaves, typeof allLeaves]
  >(
    (acc, leave) => {
      if (
        leave.lead?.id === managerId &&
        leave.leave.leaveStatus === LEAVE_STATUS.PENDING
      ) {
        acc[0].push(leave); // teamLeaves
      } else {
        acc[1].push(leave); // otherLeaves
      }
      return acc;
    },
    [[], []]
  );

  return (
    <>
      <h1 className="text-2xl font-medium mb-8">Team Leave Requests</h1>

      <section className="mb-8">
        {teamLeaves.length > 0 ? (
          <LeaveProcessCards leaves={teamLeaves} session={session} />
        ) : (
          <h4 className="text-base font-medium text-muted-foreground">
            Hooray!! No Leave Request.
          </h4>
        )}
      </section>

      {session?.user?.role === ROLE.ADMIN && otherLeaves.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg text-muted-foreground font-medium mb-3">
            Other Leave Requests
          </h3>
          <LeaveProcessCards leaves={otherLeaves} session={session} />
        </section>
      )}
    </>
  );
};

export default Requests;
