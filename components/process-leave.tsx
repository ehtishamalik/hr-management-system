"use client";

import { Check, X, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProcessLeaveFormProps {
  leaveId: string;
  isFullView?: boolean;
}

export const ProcessLeaveForm = ({
  leaveId,
  isFullView = false,
}: ProcessLeaveFormProps) => {
  const router = useRouter();

  const [remarks, setRemarks] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState<boolean>(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false);

  const handleSubmitApprove = async () => {
    setIsLoadingApprove(true);
    await withErrorHandling(async () => {
      const response = await fetch(`/api/leave/approve?id=${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      handleServerResponse(response, () => {
        toast.success(`Leave Approved.`, {
          description: `The leave has been approved successfully.`,
        });
        router.refresh();
      });
    }, "Could not approve leave.");
    setIsLoadingApprove(false);
  };

  const handleSubmitReject = async () => {
    setDialogOpen(false);
    setIsLoadingReject(true);

    await withErrorHandling(async () => {
      const response = await fetch(`/api/leave/reject?id=${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remark: remarks.trim(),
        }),
      });

      handleServerResponse(response, () => {
        toast.success(`Leave Rejected`, {
          description: `The leave has been rejected successfully.`,
        });
        router.refresh();
      });
    }, "Could not reject leave.");
    setIsLoadingReject(false);
  };

  return (
    <footer
      className={cn("flex gap-4 items-center w-full", {
        "gap-2": isFullView,
      })}
    >
      {/* Reject Button with Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="flex-1"
            size={isFullView ? "sm" : "default"}
            disabled={isLoadingReject}
          >
            {isLoadingReject ? <Spinner /> : <X />}
            Reject
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="size-5 text-destructive" />
              Reject Leave
            </DialogTitle>
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
        size={isFullView ? "sm" : "default"}
        onClick={handleSubmitApprove}
        disabled={isLoadingApprove}
      >
        {isLoadingApprove ? <Spinner /> : <Check />}
        Approve
      </Button>
    </footer>
  );
};
