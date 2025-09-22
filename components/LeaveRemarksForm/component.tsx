"use client";

import LoadingUI from "./loading";

import { useLeaveRemarks } from "./hook";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { LeaveRemarksFormProps } from "./types";

const LeaveRemarks = ({
  leaveId,
  leaveStatus,
  remarkCount,
  session,
  buttonVariant = "secondary",
  bubbleUp = false,
}: LeaveRemarksFormProps) => {
  const {
    remarks,
    isLoading,
    currentRemarks,
    containerRef,
    open,
    setOpen,
    setCurrentRemarks,
    onSubmit,
  } = useLeaveRemarks({
    leaveId,
    session,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant={buttonVariant}
          className={cn({
            "relative z-50": bubbleUp,
          })}
        >
          {remarks.length >= remarkCount ? remarks.length : remarkCount}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remarks</DialogTitle>
          <DialogDescription>
            {remarkCount > 0 ? `${remarkCount} Remarks` : "No Remarks"}
          </DialogDescription>
          {isLoading ? (
            <LoadingUI />
          ) : (
            <section>
              <div className="h-60 border overflow-hidden rounded-lg mb-4">
                <div
                  className="space-y-4 overflow-auto h-full p-2"
                  ref={containerRef}
                >
                  {remarks.map(({ user, leave_remark }) => (
                    <div key={leave_remark.id} className="space-y-1">
                      <p className="text-muted-foreground flex justify-between items-center">
                        <span className="text-sm">
                          {user?.id === session.user.id
                            ? `${user?.name} (You)`
                            : user?.name || "Unknown User"}
                        </span>
                        <span className="text-xs">
                          {new Date(leave_remark.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </span>
                      </p>
                      <p className="text-sm max-w-80">{leave_remark.remark}</p>
                    </div>
                  ))}
                </div>
              </div>
              {(leaveStatus === LEAVE_STATUS.PENDING ||
                leaveStatus === LEAVE_STATUS.ACCEPTED ||
                session.user.role === ROLE.ADMIN) && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add Remark"
                    value={currentRemarks}
                    onChange={(event) => setCurrentRemarks(event.target.value)}
                  />
                  <Button className="w-full" onClick={onSubmit}>
                    Add Remark
                  </Button>
                </div>
              )}
            </section>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRemarks;
