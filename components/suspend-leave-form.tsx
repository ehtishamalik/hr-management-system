"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { BanIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { LEAVE_STATUS } from "@/enum";
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

import type { SessionType } from "@/types";
import type { LeaveRemarkTableInsertType } from "@/db/types";

interface SuspendLeaveFormProps {
  leaveId: string;
  session: SessionType;
}

export const SuspendLeaveForm = ({
  leaveId,
  session,
}: SuspendLeaveFormProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRemark = async () => {
    const newRemark = remark.trim()
      ? `${remark.trim()} - Leave has been suspended by ${session.user.name}.`
      : `Leave has been ${LEAVE_STATUS.SUSPENDED}`;

    const submitValue: LeaveRemarkTableInsertType = {
      leaveId: leaveId,
      userId: session.user.id!,
      remark: newRemark,
    };

    try {
      const response = await fetch(`/api/leave/remarks`, {
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
      setRemark("");
    }
  };

  const handleSuspend = async () => {
    setIsLoading(true);

    await handleAddRemark();

    const submitValue = {
      leaveStatus: LEAVE_STATUS.SUSPENDED,
    };

    try {
      const response = await fetch(`/api/leave?id=${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      setIsLoading(false);

      if (response.ok && success) {
        toast.success(`Leave Suspended.`, {
          description: `The leave has been suspended successfully.`,
        });
        router.refresh();
      } else {
        toast.error("Could not suspend leave.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch {
      toast.error("Failed to suspend remarks", {
        description: UNKNOWN_ERROR,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="suspend">
          Suspend
          <BanIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to suspend this leave? You can optionally add
            remarks to let the employee know the reason.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Add remarks (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={handleSuspend}
            className="w-full"
            variant="suspend"
            disabled={isLoading}
          >
            Suspend
            {isLoading && <LoaderCircle className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
