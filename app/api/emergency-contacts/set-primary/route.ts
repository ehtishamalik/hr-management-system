import { and, eq } from "drizzle-orm";
import { db, wsdb } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { getValueFromRequest } from "@/lib/utils";
import { NextResponse } from "next/server";

import type { EmergencyContactTableSelectType } from "@/types";
import type { ApiResponse } from "@/types";

// PUT /api/emergency-contacts/set-primary?id=id
export const PUT = withAuth(async (request, _ctx, _session) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    throw new AppError("Missing required field: id", {
      detail:
        "Ensure that the 'id' query parameter is included in the request URL.",
      status: 400,
    });
  }

  const [contact] = await db
    .select()
    .from(EmergencyContactTable)
    .where(
      and(
        eq(EmergencyContactTable.id, id),
        eq(EmergencyContactTable.userId, _session.user.id),
      ),
    );

  if (!contact) {
    throw new AppError("Emergency contact not found", {
      detail: `No emergency contact found with id: ${id} for the current user.`,
      status: 404,
    });
  }

  const userId = contact.userId;

  const result = await wsdb.transaction(async (tx) => {
    // First, set isPrimary to false for all contacts of the user
    await tx
      .update(EmergencyContactTable)
      .set({ isPrimary: false })
      .where(eq(EmergencyContactTable.userId, userId));

    // Then, set isPrimary to true for the specified contact
    const [result] = await tx
      .update(EmergencyContactTable)
      .set({ isPrimary: true })
      .where(eq(EmergencyContactTable.id, id))
      .returning();

    return result;
  });

  return NextResponse.json<ApiResponse<EmergencyContactTableSelectType>>({
    success: true,
    data: result,
  });
}, "Error at /api/emergency-contacts/set-primary (PUT)");
