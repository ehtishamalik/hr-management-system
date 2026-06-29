"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

import type { EmergencyContactTableSelectType } from "@/types";

const DeleteContact = ({
  contact,
  isDeleting,
}: {
  contact: EmergencyContactTableSelectType;
  isDeleting: (state: boolean) => void;
}) => {
  const router = useRouter();

  const handleDelete = async () => {
    isDeleting(true);
    await withErrorHandling(async () => {
      const response = await fetch(`/api/emergency-contacts/${contact.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      handleServerResponse(response, () => {
        toast.success(`Emergency contact deleted`, {
          description: `“${contact.name}” has been successfully deleted.`,
        });
        router.refresh();
      });
    }, "Failed to Delete Emergency Contact");

    isDeleting(false);
  };
  return (
    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
      Delete
    </DropdownMenuItem>
  );
};

export default DeleteContact;
