import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";
import { AppError } from "@/lib/errors";

import type { EmergencyContactTableInsertType } from "@/types";

export const checkPutRequest = async (
  contact: EmergencyContactTableInsertType,
) => {
  const existingContacts = await db
    .select()
    .from(EmergencyContactTable)
    .where(eq(EmergencyContactTable.userId, contact.userId));

  const exists = existingContacts.find(
    (existingContact) => existingContact.id === contact.id,
  );

  if (!exists) {
    throw new AppError("Contact not found.", {
      detail: "No emergency contact found with the given ID.",
      status: 404,
    });
  }

  const isDuplicate = existingContacts.find(
    (existingContact) => existingContact.phone === contact.phone,
  );

  if (isDuplicate) {
    throw new AppError("Duplicate Contact.", {
      detail: "An emergency contact with the same phone number already exists.",
      status: 400,
    });
  }
};

export const checkDeleteRequest = async (id: string) => {
  const [contact] = await db
    .select()
    .from(EmergencyContactTable)
    .where(eq(EmergencyContactTable.id, id))
    .limit(1);

  if (!contact) {
    throw new AppError("Contact not found.", {
      detail: "No emergency contact found with the given ID.",
      status: 404,
    });
  }

  if (contact.isPrimary) {
    throw new AppError("Cannot delete primary contact.", {
      detail: "Please set another contact as primary before deleting this one.",
      status: 400,
    });
  }
};
