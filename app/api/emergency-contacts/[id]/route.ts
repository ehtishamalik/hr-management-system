import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { EmergencyContactTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError, ForbiddenError } from "@/lib/errors";
import { checkDeleteRequest, checkPutRequest } from "./service";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  EmergencyContactTableInsertType,
  EmergencyContactTableSelectType,
} from "@/types";

// GET /api/emergency-contacts/[id] — own data or ADMIN
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/emergency-contacts/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;

    const [contact] = await db
      .select()
      .from(EmergencyContactTable)
      .where(eq(EmergencyContactTable.id, id))
      .limit(1);

    if (!contact) {
      throw new AppError("Emergency contact not found.", {
        detail: "No emergency contact found with the given ID.",
        status: 404,
      });
    }

    if (
      _session.user.role !== ROLE.ADMIN &&
      contact.userId !== _session.user.id
    ) {
      throw new ForbiddenError(
        "You can only view your own emergency contacts.",
      );
    }

    return NextResponse.json<ApiResponse<EmergencyContactTableSelectType>>({
      success: true,
      data: contact,
    });
  },
  "Error at /api/emergency-contacts/[id] (GET)",
);

// PUT /api/emergency-contacts/[id] — own data or ADMIN
export const PUT = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/emergency-contacts/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;
    const body: EmergencyContactTableInsertType = await _request.json();

    // Fetch to verify ownership
    const [contact] = await db
      .select({ userId: EmergencyContactTable.userId })
      .from(EmergencyContactTable)
      .where(eq(EmergencyContactTable.id, id))
      .limit(1);

    if (!contact) {
      throw new AppError("Emergency contact not found.", {
        detail: "No emergency contact found with the given ID.",
        status: 404,
      });
    }

    if (
      _session.user.role !== ROLE.ADMIN &&
      contact.userId !== _session.user.id
    ) {
      throw new ForbiddenError(
        "You can only update your own emergency contacts.",
      );
    }

    await checkPutRequest(body);

    const [result] = await db
      .update(EmergencyContactTable)
      .set(body)
      .where(eq(EmergencyContactTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<EmergencyContactTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at /api/emergency-contacts/[id] (PUT)",
);

// DELETE /api/emergency-contacts/[id] — own data or ADMIN
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/emergency-contacts/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;

    // Fetch to verify ownership
    const [contact] = await db
      .select({ userId: EmergencyContactTable.userId })
      .from(EmergencyContactTable)
      .where(eq(EmergencyContactTable.id, id))
      .limit(1);

    if (!contact) {
      throw new AppError("Emergency contact not found.", {
        detail: "No emergency contact found with the given ID.",
        status: 404,
      });
    }

    if (
      _session.user.role !== ROLE.ADMIN &&
      contact.userId !== _session.user.id
    ) {
      throw new ForbiddenError(
        "You can only delete your own emergency contacts.",
      );
    }

    await checkDeleteRequest(id);

    const [result] = await db
      .delete(EmergencyContactTable)
      .where(eq(EmergencyContactTable.id, id))
      .returning();

    return NextResponse.json<ApiResponse<EmergencyContactTableSelectType>>({
      success: true,
      data: result,
    });
  },
  "Error at /api/emergency-contacts/[id] (DELETE)",
);
