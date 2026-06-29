import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { PFSettingsTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { AppError } from "@/lib/errors";
import type { ApiResponse, PFSettingsTableSelectType } from "@/types";

// PUT /api/pf/settings/[id] → ADMIN only
export const PUT = withAuth(
  async (request: NextRequest, ctx: RouteContext<"/api/pf/settings/[id]">) => {
    const { id } = await ctx.params;
    const body = await request.json();

    const result = await db
      .update(PFSettingsTable)
      .set(body)
      .where(eq(PFSettingsTable.id, id))
      .returning();

    if (result.length === 0) {
      throw new AppError("PF settings not found.", {
        status: 404,
        detail: `No PF settings with id ${id}`,
      });
    }

    return NextResponse.json<ApiResponse<PFSettingsTableSelectType>>({
      success: true,
      data: result[0],
    });
  },
  "Error at /api/pf/settings/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/pf/settings/[id] → ADMIN only
export const DELETE = withAuth(
  async (_request: NextRequest, ctx: RouteContext<"/api/pf/settings/[id]">) => {
    const { id } = await ctx.params;

    await db.delete(PFSettingsTable).where(eq(PFSettingsTable.id, id));

    return NextResponse.json<ApiResponse<null>>({ success: true, data: null });
  },
  "Error at /api/pf/settings/[id] (DELETE)",
  [ROLE.ADMIN],
);
