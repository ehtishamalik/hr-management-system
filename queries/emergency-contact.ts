import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";

export async function getEmergencyContactsByUserIdQuery(userId: string) {
  return db
    .select()
    .from(EmergencyContactTable)
    .where(eq(EmergencyContactTable.userId, userId));
}
