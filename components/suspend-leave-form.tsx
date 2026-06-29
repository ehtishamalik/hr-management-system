"use client";

import { BanIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SuspendLeaveFormProps {
  leaveId: string;
}

export const SuspendLeaveForm = ({ leaveId }: SuspendLeaveFormProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setDialogOpen(false);
    setIsLoading(true);

    await withErrorHandling(async () => {
      const response = await fetch(`/api/leave/suspend?id=${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remark: remark.trim(),
        }),
      });

      handleServerResponse(response, () => {
        toast.success(`Leave Suspended`, {
          description: `The leave has been suspended successfully.`,
        });
        router.refresh();
      });
    }, "Could not suspend leave.");
    setIsLoading(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="suspend" size="sm" disabled={isLoading}>
          Suspend
          {isLoading ? <Spinner /> : <BanIcon />}
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
            onClick={handleSubmit}
            className="w-full"
            variant="suspend"
            disabled={isLoading}
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
