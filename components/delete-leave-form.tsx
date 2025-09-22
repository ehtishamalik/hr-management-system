"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
import { UNKNOWN_ERROR } from "@/constants";

interface DeleteLeaveFormProps {
  leaveId: string;
}

export const DeleteLeaveForm = ({ leaveId }: DeleteLeaveFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/leave?id=${leaveId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { success, error } = await response.json();

    setIsLoading(false);

    if (response.ok && success) {
      toast.success("Leave Deleted", {
        description: "Your leave request has been deleted successfully.",
      });
      router.push("/");
    } else {
      toast.error("Failed to Delete", {
        description: error || UNKNOWN_ERROR,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" disabled={isLoading}>
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
            <Button variant="destructive" onClick={handleDelete}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
