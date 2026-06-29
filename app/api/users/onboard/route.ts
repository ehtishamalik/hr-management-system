import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { UserDetailTable } from "@/db/schema";
import { wsdb } from "@/db/drizzle";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { nanoid } from "nanoid";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  EmergencyContactTableInsertType,
  UserDetailTableInsertType,
} from "@/types";
import { EmergencyContactTable } from "@/db/schema";

// POST /api/users/onboard — any authenticated user, but only once
export const POST = withAuth(async (_request: NextRequest, _ctx, _session) => {
  const {
    userDetailsValues,
    emergencyContactValues,
  }: {
    userDetailsValues: UserDetailTableInsertType;
    emergencyContactValues: EmergencyContactTableInsertType;
  } = await _request.json();

  // Guard: one onboarding per user
  const [existing] = await db
    .select({ id: UserDetailTable.id })
    .from(UserDetailTable)
    .where(eq(UserDetailTable.userId, _session.user.id))
    .limit(1);

  if (existing) {
    throw new AppError("Already onboarded", {
      detail: "This user has already completed onboarding.",
      status: 409,
    });
  }

  await wsdb.transaction(async (tx) => {
    await tx.insert(UserDetailTable).values({
      ...userDetailsValues,
      userId: _session.user.id,
      employeeId: nanoid(4),
    });

    await tx.insert(EmergencyContactTable).values({
      ...emergencyContactValues,
      userId: _session.user.id,
    });
  });

  return NextResponse.json<ApiResponse<null>>(
    { success: true, data: null },
    { status: 201 },
  );
}, "Error at api/users/onboard (POST)");
