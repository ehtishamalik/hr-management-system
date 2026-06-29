"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { handleServerResponse, withErrorHandling } from "@/lib/error-handling";

import type { EmergencyContactTableSelectType } from "@/types";

const UpdateContact = ({
  contact,
  isUpdating,
}: {
  contact: EmergencyContactTableSelectType;
  isUpdating: (state: boolean) => void;
}) => {
  const router = useRouter();

  const handleUpdate = async () => {
    isUpdating(true);
    await withErrorHandling(async () => {
      const response = await fetch(
        `/api/emergency-contacts/set-primary?id=${contact.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      handleServerResponse(response, () => {
        toast.success(`Emergency contact updated`, {
          description: `“${contact.name}” has been marked as primary.`,
        });
        router.refresh();
      });
    }, "Failed to Update Emergency Contact");

    isUpdating(false);
  };
  return (
    <DropdownMenuItem onClick={handleUpdate}>Mark as Primary</DropdownMenuItem>
  );
};

export default UpdateContact;
