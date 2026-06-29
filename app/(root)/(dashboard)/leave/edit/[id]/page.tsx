import Headline from "@/components/headline";
import LeaveForm from "@/components/LeaveForm";
import NotFoundBanner from "@/components/not-found-banner";

import { getLeaveById } from "@/services/leave";
import { getSession } from "@/lib/auth/session";
import { getLeaveStatues, getRoleStatues } from "@/lib/utils";
import { getLeaveTypesForLeave } from "@/services/leave-type";

const LeaveEdit = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await getSession();

  const [leaveTypes, completeLeave] = await Promise.all([
    getLeaveTypesForLeave(),
    getLeaveById(id),
  ]);

  if (!completeLeave || !completeLeave.leaveOwner) {
    return (
      <NotFoundBanner
        headline="Leave Not Found"
        description="The leave you are looking for does not exist or has been removed."
      />
    );
  }

  const { leave, leaveOwner } = completeLeave;
  const { isPending, isAccepted, isApproved } = getLeaveStatues(
    leave.leaveStatus,
  );

  const isOwner = leaveOwner.id === session.user.id;
  const { isAdmin } = getRoleStatues(session);

  const isOwnerCanEdit = isOwner && (isPending || isAccepted);
  const isAdminCanEdit = isAdmin && (isPending || isAccepted || isApproved);

  if (!isOwnerCanEdit && !isAdminCanEdit) {
    return (
      <NotFoundBanner
        headline="Unauthorized"
        description="You are not authorized to edit this leave request."
      />
    );
  }

  return (
    <>
      <Headline className="mb-2">Edit Leave Request</Headline>
      <div className="space-y-2">
        {isOwner && (
          <p className="text-sm text-muted-foreground">
            Edit leave will be reverted back to the <strong>PENDING</strong>{" "}
            status if any of the dates are changed.
          </p>
        )}
        {isAdmin && (
          <p className="text-sm text-muted-foreground">
            Only date and leave type can be changed.
          </p>
        )}
      </div>

      <section className="border p-4 rounded-2xl">
        <LeaveForm
          leaveTypes={leaveTypes}
          editData={leave}
          calendarDisabled={!isAdmin}
          isAdmin={isAdmin}
          isOwner={isOwner}
        />
      </section>
    </>
  );
};

export default LeaveEdit;
