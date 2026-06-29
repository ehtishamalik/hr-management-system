import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { AppError } from "@/lib/errors";
import { db } from "@/db/drizzle";
import { PFLedgerTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ApiResponse } from "@/types";

// DELETE /api/pf/ledger/:id → ADMIN only
export const DELETE = withAuth(
  async (_request: NextRequest, ctx: RouteContext<"/api/pf/ledger/[id]">) => {
    const { id } = await ctx.params;

    if (!id) {
      throw new AppError("Ledger entry ID is required.", {
        status: 400,
        detail: "Provide a valid ledger entry ID in the URL.",
      });
    }

    const deleted = await db
      .delete(PFLedgerTable)
      .where(eq(PFLedgerTable.id, id))
      .returning();

    if (deleted.length === 0) {
      throw new AppError("Ledger entry not found.", {
        status: 404,
        detail: `No ledger entry with id ${id}.`,
      });
    }

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id },
    });
  },
  "Error at /api/pf/ledger/[id] (DELETE)",
  [ROLE.ADMIN],
);
