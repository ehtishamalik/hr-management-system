"use client";

import LoadingUI from "./loading";
import Headline from "@/components/headline";

import { useLeaveRemarks } from "./hook";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, MessageSquareIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { LeaveRemarksFormProps } from "./types";

const LeaveRemarks = ({
  leaveId,
  leaveStatus,
  session,
}: LeaveRemarksFormProps) => {
  const {
    remarks,
    isLoading,
    currentRemarks,
    containerRef,
    setCurrentRemarks,
    onSubmit,
    handleKeyDown,
  } = useLeaveRemarks({
    leaveId,
    leaveStatus,
    session,
  });

  if (isLoading) {
    return <LoadingUI />;
  }

  return (
    <section className="space-y-4 overflow-y-auto" ref={containerRef}>
      <div className="flex items-center gap-2 border-b border-border/50 pb-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <MessageSquareIcon size={20} />
        <Headline type="h3">Remarks & History</Headline>
      </div>

      <div
        className={cn("border rounded-lg min-h-52 space-y-4 p-2", {
          "flex items-center justify-center": remarks.length === 0,
        })}
      >
        {remarks.length === 0 && (
          <p className="text-sm text-muted-foreground">No remarks available.</p>
        )}
        {remarks.map(({ user, leave_remark }) => (
          <div key={leave_remark.id} className="space-y-0.5">
            <p className="text-muted-foreground flex justify-between items-center">
              <span className="inline-flex gap-1 items-center">
                <Avatar className="size-5">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="font-medium text-[10px]">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {user?.id === session.user.id
                    ? `${user?.name} (You)`
                    : user?.name || "Unknown User"}
                </span>
              </span>
              <span className="text-xs">
                {new Date(leave_remark.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </p>
            <p className="text-sm ml-6">{leave_remark.remark}</p>
          </div>
        ))}
      </div>
      <Textarea
        id="leave-remark"
        disabled={isLoading}
        placeholder="Add Remark (Press Enter to send, Shift+Enter for new line)"
        value={currentRemarks}
        onChange={(event) => setCurrentRemarks(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="w-full"
        disabled={currentRemarks.trim().length < 3 || isLoading}
        onClick={onSubmit}
      >
        Add Remark
        <ArrowUp />
      </Button>
    </section>
  );
};

export default LeaveRemarks;
