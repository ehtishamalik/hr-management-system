import DropDownMenuContacts from "@/app/(account)/emergency-contacts/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { PhoneIcon } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { EmergencyContactTableSelectType } from "@/types";

function ContactFormCard({
  contact,
  isUser = false,
}: {
  contact: EmergencyContactTableSelectType;
  isUser?: boolean;
}) {
  return (
    <Card key={contact.id} className="gap-4">
      <CardHeader>
        <CardTitle>{contact.name}</CardTitle>
        <CardDescription>{contact.relation}</CardDescription>
        <CardAction>
          {contact.isPrimary && <Badge variant="default">Primary</Badge>}
          {!contact.isPrimary && isUser && (
            <DropDownMenuContacts contact={contact} />
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <PhoneIcon size={14} />
        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        <CopyButton
          content={contact.phone}
          size="sm"
          variant="ghost"
          className="ml-2"
        />
      </CardContent>
      <CardFooter className="text-sm">
        {contact.description ? (
          <p>{contact.description}</p>
        ) : (
          <em className="text-muted-foreground">No description provided.</em>
        )}
      </CardFooter>
    </Card>
  );
}

export default ContactFormCard;
