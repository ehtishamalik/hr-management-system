"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { LEAVE_STATUS, ROLE } from "@/enum";
import { Textarea } from "./ui/textarea";
import { UNKNOWN_ERROR } from "@/constants";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import type {
  LeaveRemarkTableInsertType,
  LeaveTableSelectType,
} from "@/db/types";
import type { SessionType } from "@/types";

interface ProcessLeaveFormProps {
  session: SessionType;
  leave: LeaveTableSelectType;
}

export const ProcessLeaveForm = ({ leave, session }: ProcessLeaveFormProps) => {
  const router = useRouter();

  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);
  const [isLoadingReject, setIsLoadingReject] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleSubmitApprove = async () => {
    const leaveStatus =
      session.user.role === ROLE.ADMIN
        ? LEAVE_STATUS.APPROVED
        : LEAVE_STATUS.ACCEPTED;

    setIsLoadingApprove(true);

    await handleAddRemark(
      `Leave has been ${leaveStatus} by ${session.user.name}.`
    );

    const submitValue = {
      leaveStatus: leaveStatus,
    };

    try {
      const response = await fetch(`/api/leave?id=${leave.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      setIsLoadingApprove(false);

      if (response.ok && success) {
        toast.success(`Leave Approved.`, {
          description: `The leave has been approved successfully.`,
        });
        router.refresh();
      } else {
        toast.error("Could not approve leave.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch {
      toast.error("Failed to approve remarks", {
        description: UNKNOWN_ERROR,
      });
    }
  };

  const handleAddRemark = async (remark: string) => {
    const submitValue: LeaveRemarkTableInsertType = {
      leaveId: leave.id,
      userId: session.user.id!,
      remark: remark,
    };

    try {
      const response = await fetch(`/api/leave/remark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      if (!response.ok || !success) {
        toast.error("Could not add remark.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch {
      toast.error("Failed to add remarks", {
        description: UNKNOWN_ERROR,
      });
    } finally {
      setRemarks("");
    }
  };

  const handleSubmitReject = async () => {
    setDialogOpen(false);
    setIsLoadingReject(true);

    const remark = remarks.trim()
      ? `${remarks.trim()} - (Leave has been ${LEAVE_STATUS.REJECTED} by ${session.user?.name}.)`
      : `Leave has been ${LEAVE_STATUS.REJECTED} by ${session.user?.name}.`;

    await handleAddRemark(remark);

    const submitValue = {
      leaveStatus: LEAVE_STATUS.REJECTED,
      processedBy: session.user?.id || "",
    };

    try {
      const response = await fetch(`/api/leave?id=${leave.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      setIsLoadingReject(false);

      if (response.ok && success) {
        toast.success(`Leave Rejected`, {
          description: `The leave has been rejected successfully.`,
        });
        router.refresh();
      } else {
        toast.error("Could not reject leave.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch {
      toast.error("Failed to reject remarks", {
        description: UNKNOWN_ERROR,
      });
    }
  };

  return (
    <footer className="relative z-auto flex gap-4 items-center w-full">
      {/* Reject Button with Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={isLoadingReject}
          >
            Reject
            {isLoadingReject && <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently reject the
              employee&apos;s leave. Consider adding a remark to let them know
              the reason.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Add remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <DialogFooter className="mt-4">
            <Button onClick={handleSubmitReject} variant="destructive">
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Button */}
      <Button
        variant="approve"
        className="flex-1"
        onClick={handleSubmitApprove}
      >
        Approve
        {isLoadingApprove ? <LoaderCircle className="animate-spin" /> : null}
      </Button>
    </footer>
  );
};
