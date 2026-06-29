"use client";

import DeleteContact from "./delete-contact";
import UpdateContact from "./update-contact";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { EmergencyContactTableSelectType } from "@/types";

const DropDownMenuContacts = ({
  contact,
}: {
  contact: EmergencyContactTableSelectType;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon size={16} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UpdateContact
          contact={contact}
          isUpdating={(state) => {
            setIsLoading(state);
          }}
        />
        <DeleteContact
          contact={contact}
          isDeleting={(state) => {
            setIsLoading(state);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuContacts;
