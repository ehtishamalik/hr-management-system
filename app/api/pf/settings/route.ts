import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import {
  PFSettingsTable,
  user as UserTable,
  UserDetailTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { ForbiddenError } from "@/lib/errors";
import { getValueFromRequest } from "@/lib/utils";
import { getPFSettingByUserIdQuery } from "@/queries/pf";
import type { ApiResponse } from "@/types";
import type {
  PFSettingsTableInsertType,
  PFSettingsTableSelectType,
} from "@/types";

// GET /api/pf/settings              → ADMIN: list all
// GET /api/pf/settings?userId=<id>  → ADMIN or own data: get one
export const GET = withAuth(async (request: NextRequest, _ctx, session) => {
  const isAdmin = session.user.role === ROLE.ADMIN;
  const userId = getValueFromRequest(request, "userId");

  if (userId) {
    if (!isAdmin && session.user.id !== userId) {
      throw new ForbiddenError("You can only view your own PF settings.");
    }

    const results = await getPFSettingByUserIdQuery(userId);

    return NextResponse.json<ApiResponse<PFSettingsTableSelectType | null>>({
      success: true,
      data: results[0] ?? null,
    });
  }

  if (!isAdmin) {
    throw new ForbiddenError("Only admins can list all PF settings.");
  }

  const results = await db
    .select({
      pfSettings: PFSettingsTable,
      user: {
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
      },
      userDetail: {
        employeeId: UserDetailTable.employeeId,
        designation: UserDetailTable.designation,
      },
    })
    .from(PFSettingsTable)
    .innerJoin(UserTable, eq(PFSettingsTable.userId, UserTable.id))
    .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
    .orderBy(UserTable.name);
  return NextResponse.json<ApiResponse<typeof results>>({
    success: true,
    data: results,
  });
}, "Error at /api/pf/settings (GET)");

// POST /api/pf/settings → ADMIN only (upsert)
export const POST = withAuth(async (request: NextRequest, _ctx, session) => {
  if (session.user.role !== ROLE.ADMIN) {
    throw new ForbiddenError("Only admins can configure PF settings.");
  }

  const body: PFSettingsTableInsertType = await request.json();

  // If company contribution is disabled, zero out the amount
  const companyContributionAmount =
    body.companyContributionEnabled === false
      ? "0"
      : (body.companyContributionAmount ?? "0");

  const result = await db
    .insert(PFSettingsTable)
    .values({ ...body, companyContributionAmount })
    .onConflictDoUpdate({
      target: PFSettingsTable.userId,
      set: {
        employeeMonthlyAmount: body.employeeMonthlyAmount,
        companyContributionEnabled: body.companyContributionEnabled,
        companyContributionType: body.companyContributionType,
        companyContributionAmount,
        effectiveFrom: body.effectiveFrom,
        status: body.status,
      },
    })
    .returning();

  return NextResponse.json<ApiResponse<PFSettingsTableSelectType>>(
    { success: true, data: result[0] },
    { status: 201 },
  );
}, "Error at /api/pf/settings (POST)");
