"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
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
import { STATUS } from "@/enum";
import { authClient } from "@/lib/auth-client";

interface DeactivateUserFormProps {
  id: string;
}

export const DeactivateUserForm = ({ id }: DeactivateUserFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = authClient.useSession();

  const handleDelete = async () => {
    const submitValue = {
      status: STATUS.INACTIVE,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`/api/user?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValue),
      });

      const { success, error } = await response.json();

      setIsLoading(false);

      if (response.ok && success) {
        toast.success("User Deactivated.", {
          description: "The user has been deactivated successfully.",
        });
        if (id === session?.user.id) {
          await authClient.signOut();
        } else {
          router.push("/admin/users");
        }
      } else {
        toast.error("Could not deactivate user.", {
          description: error || UNKNOWN_ERROR,
        });
      }
    } catch (error) {
      console.error("Error deactivating user:", error);

      toast.error("Failed to deactivate user.", {
        description: UNKNOWN_ERROR,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Deactivate
          {isLoading && <LoaderCircle className="animate-spin" />}
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
