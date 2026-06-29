import { handleErrorWithSlack } from "@/lib/error-handling";
import { getEmergencyContactsByUserIdQuery } from "@/queries/emergency-contact";

export async function getEmergencyContactsByUserId(userId: string) {
  try {
    const contacts = await getEmergencyContactsByUserIdQuery(userId);
    return contacts.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  } catch (error) {
    handleErrorWithSlack("getEmergencyContactsByUserId failed", error);
    throw error;
  }
}
