"use client";

import { BanIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { STATUS } from "@/enum";
import { useSession } from "@/lib/auth/auth-client";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
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
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

interface DeactivateUserFormProps {
  id: string;
}

export const DeactivateUserForm = ({ id }: DeactivateUserFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const handleDelete = async () => {
    if (!session) {
      toast.error("Forbidden", {
        description: "You must be logged in to perform this action.",
      });
      return;
    }

    if (session?.user.id === id) {
      toast.error("Forbidden", {
        description: "You cannot deactivate your own account.",
      });
      return;
    }

    const submitValue = {
      status: STATUS.INACTIVE,
    };

    setIsLoading(true);

    await withErrorHandling(async () => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      handleServerResponse(response, async () => {
        toast.success("Employee Deactivated.", {
          description: "The employee has been deactivated successfully.",
        });
        router.push("/admin/users");
      });
    }, "Failed to deactivate employee.");
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          Deactivate
          {isLoading ? <Spinner /> : <BanIcon />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible and will permanently deactivate the
            user&apos;s account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete}>
              I Understand
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
