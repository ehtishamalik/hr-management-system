"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteLeaveFormProps {
  leaveId: string;
}

export const DeleteLeaveForm = ({ leaveId }: DeleteLeaveFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBack = () => {
    if (document.referrer?.includes(window.location.origin)) {
      router.back();
      router.refresh();
    } else {
      router.push("/");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await withErrorHandling(async () => {
      const response = await fetch(`/api/leave/${leaveId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      handleServerResponse(response, () => {
        toast.success("Leave Deleted", {
          description: "Your leave request has been deleted successfully.",
        });
        handleBack();
      });
    }, "Failed to delete leave request");
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          Delete
          {isLoading ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete your leave
            request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
