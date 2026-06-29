import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";
import type { EmergencyContactTableInsertType } from "@/types";
import { AppError } from "@/lib/errors";

export const checkPostRequest = async (
  contact: EmergencyContactTableInsertType,
) => {
  const existingContacts = await db
    .select()
    .from(EmergencyContactTable)
    .where(eq(EmergencyContactTable.userId, contact.userId));

  if (existingContacts.length === 3) {
    throw new AppError("Limit Reached.", {
      detail: "Cannot add more than 3 emergency contacts.",
      status: 400,
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
