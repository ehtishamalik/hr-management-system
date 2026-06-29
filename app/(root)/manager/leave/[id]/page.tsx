import Link from "next/link";
import LeaveRemarks from "@/components/LeaveRemarksForm";
import NotFoundBanner from "@/components/not-found-banner";

import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth/session";
import { getLeaveById } from "@/services/leave";
import { Button } from "@/components/ui/button";
import { ProcessLeaveForm } from "@/components/process-leave";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DeleteLeaveForm } from "@/components/delete-leave-form";
import { SuspendLeaveForm } from "@/components/suspend-leave-form";
import { CalendarDays, Clock, FileText, PencilIcon } from "lucide-react";
import {
  cn,
  formatDateWithDay,
  getInitials,
  getLeaveStatues,
  getLeaveStatusClass,
  getRoleStatues,
} from "@/lib/utils";

const ViewLeave = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();

  const { id } = await params;

  const completeLeave = await getLeaveById(id);

  if (!completeLeave) {
    return (
      <NotFoundBanner
        headline="Leave Not Found"
        description="The leave you are looking for does not exist or has been removed."
      />
    );
  }

  const { leave, leaveOwner } = completeLeave;
  const name = leaveOwner?.name || "Unknown Employee";

  const { isManager, isAdmin } = getRoleStatues(session);
  const { isPending, isAccepted, isApproved, isLate } = getLeaveStatues(
    leave.leaveStatus,
  );

  const canDelete = isAdmin && isLate;
  const canEdit = isAdmin;
  const canSuspend = isAdmin && (isAccepted || isApproved);

  const canProcess =
    (isManager && isPending) || (isAdmin && (isPending || isAccepted));

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:h-[calc(100vh-120px)] overflow-hidden">
      <section className="space-y-8 overflow-y-auto pr-6">
        <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight leading-none mb-1 capitalize">
                {name}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "h-5 text-[10px] font-bold uppercase tracking-wider px-1.5",
                  getLeaveStatusClass(leave.leaveStatus),
                )}
              >
                {leave.leaveStatus}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/leave/edit/${leave.id}`}>
                  Edit
                  <PencilIcon />
                </Link>
              </Button>
            )}
            {canDelete && <DeleteLeaveForm leaveId={leave.id} />}
            {canProcess && <ProcessLeaveForm leaveId={leave.id} isFullView />}
            {canSuspend && <SuspendLeaveForm leaveId={leave.id} />}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Date Range
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-muted-foreground italic">
                  From
                </span>
                <span className="text-sm font-semibold">
                  {formatDateWithDay(leave.fromDate)}
                </span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-muted-foreground italic">
                  To
                </span>
                <span className="text-sm font-semibold">
                  {formatDateWithDay(leave.toDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Duration & Type
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-muted-foreground italic text-nowrap pr-2">
                  Total Days
                </span>
                <Badge variant="secondary" className="font-bold">
                  {leave.numberOfDays}{" "}
                  {leave.numberOfDays === 1 ? "Day" : "Days"}
                </Badge>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-medium text-muted-foreground italic text-nowrap pr-2">
                  Leave Type
                </span>
                <span className="text-sm font-semibold capitalize">
                  {leave.leaveTypeId.split("-").join(" ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 px-1">
            <FileText className="size-4 text-primary/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reason for Leave
            </span>
          </div>
          <div className="relative group">
            <div className="absolute -left-1 top-0 bottom-0 w-1.5 bg-primary/20 rounded-full transition-colors group-hover:bg-primary/30" />
            <div
              className="pl-6 prose prose-sm max-w-none prose-p:text-foreground/90 prose-strong:text-foreground prose-p:leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized using DOMPurify
              dangerouslySetInnerHTML={{
                __html: leave.reason,
              }}
            />
          </div>
        </div>
      </section>

      <LeaveRemarks
        leaveId={leave.id}
        leaveStatus={leave.leaveStatus}
        session={session}
      />
    </section>
  );
};

export default ViewLeave;
