import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { checkPostRequest } from "./service";
import { ROLE } from "@/enum";
import { ForbiddenError } from "@/lib/errors";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  EmergencyContactTableInsertType,
  EmergencyContactTableSelectType,
} from "@/types";

// GET /api/emergency-contacts
// - No filter → ADMIN only
// - ?userId= → own data or ADMIN
export const GET = withAuth(async (request: NextRequest, _ctx, _session) => {
  const userId = getValueFromRequest(request, "userId");
  const isAdmin = _session.user.role === ROLE.ADMIN;

  if (userId) {
    if (!isAdmin && _session.user.id !== userId) {
      throw new ForbiddenError(
        "You can only view your own emergency contacts.",
      );
    }

    const contacts = await db
      .select()
      .from(EmergencyContactTable)
      .where(eq(EmergencyContactTable.userId, userId));

    return NextResponse.json<ApiResponse<EmergencyContactTableSelectType[]>>({
      success: true,
      data: contacts,
    });
  }

  if (!isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to list all emergency contacts.",
    );
  }

  const contacts = await db.select().from(EmergencyContactTable);
  return NextResponse.json<ApiResponse<EmergencyContactTableSelectType[]>>({
    success: true,
    data: contacts,
  });
}, "Error at /api/emergency-contacts (GET)");

// POST /api/emergency-contacts — any authenticated user
export const POST = withAuth(async (request: NextRequest) => {
  const body: EmergencyContactTableInsertType = await request.json();

  await checkPostRequest(body);

  const result = await db
    .insert(EmergencyContactTable)
    .values(body)
    .returning();

  return NextResponse.json<ApiResponse<EmergencyContactTableSelectType>>(
    { success: true, data: result[0] },
    { status: 201 },
  );
}, "Error at /api/emergency-contacts (POST)");
