import React from "react";
import ToastError from "@/components/toast-error";

import { getLeaveStatusClass } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { DeleteLeaveForm } from "@/components/delete-leave-form";
import { LEAVE_STATUS } from "@/enum";
import { SuspendLeaveForm } from "@/components/suspend-leave-form";
import { getLeaveById } from "@/lib/helpers/leave";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ViewLeave = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { id } = await params;

  const completeLeave = await getLeaveById(id);

  if (!completeLeave) {
    return <ToastError message="Error fetching leave data." />;
  }

  const { leave, leaveOwner, leave_type } = completeLeave;

  return (
    <>
      <section className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">{leaveOwner?.name}</h1>

        {session?.user.id === leaveOwner?.id &&
          leave.leaveStatus === LEAVE_STATUS.PENDING && (
            <section className="flex items-center gap-4 justify-end-safe">
              <DeleteLeaveForm leaveId={leave.id} />
            </section>
          )}
        {session?.user.id && leave.leaveStatus === LEAVE_STATUS.APPROVED && (
          <SuspendLeaveForm leaveId={leave.id} session={session} />
        )}
      </section>

      <section className="grid grid-cols-[0.2fr_1fr] gap-4 justify-start mb-8">
        <p className="text-muted-foreground">From:</p>
        <p>{formatDate(leave.fromDate)}</p>
        <p className="text-muted-foreground">To:</p>
        <p>{formatDate(leave.toDate)}</p>
        <p className="text-muted-foreground">Status:</p>
        <p className={getLeaveStatusClass(leave.leaveStatus)}>
          {leave.leaveStatus}
        </p>
        <p className="text-muted-foreground">Type:</p>
        <p>{leave_type?.name}</p>
        <p className="text-muted-foreground">Number of Days:</p>
        <p>{leave.numberOfDays}</p>
        <div className="p-4 bg-secondary text-secondary-foreground rounded-md col-span-2">
          <p className="text-muted-foreground">Reason:</p>
          <p>{leave.reason}</p>
        </div>
      </section>
    </>
  );
};

export default ViewLeave;
