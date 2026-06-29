import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { LateArrivalTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError, ForbiddenError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import type {
  LateArrivalTableInsertType,
  LateArrivalTableSelectType,
} from "@/types";

// GET /api/late-arrival/[id] — own data or ADMIN
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/late-arrival/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;
    const data = await db
      .select()
      .from(LateArrivalTable)
      .where(eq(LateArrivalTable.id, id));

    if (data.length === 0) {
      throw new AppError("Late arrival record not found.", {
        detail: "No late arrival record found with the given ID.",
        status: 404,
      });
    }

    const record = data[0];

    if (
      _session.user.role !== ROLE.ADMIN &&
      record.userId !== _session.user.id
    ) {
      throw new ForbiddenError(
        "You can only view your own late arrival records.",
      );
    }

    return NextResponse.json<ApiResponse<LateArrivalTableSelectType>>({
      success: true,
      data: record,
    });
  },
  "Error at /api/late-arrival/[id] (GET)",
);

// PUT /api/late-arrival/[id] — ADMIN only
export const PUT = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/late-arrival/[id]">,
  ) => {
    const { id } = await _ctx.params;

    const body: LateArrivalTableInsertType = await _request.json();

    const [lateArrival] = await db
      .update(LateArrivalTable)
      .set(body)
      .where(eq(LateArrivalTable.id, id))
      .returning();

    if (!lateArrival) {
      throw new AppError("Late arrival record not found.", {
        detail: "No late arrival record found with the given ID.",
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<LateArrivalTableSelectType>>({
      success: true,
      data: lateArrival,
    });
  },
  "Error at /api/late-arrival/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/late-arrival/[id] — ADMIN only
export const DELETE = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/late-arrival/[id]">,
  ) => {
    const { id } = await _ctx.params;

    const [lateArrival] = await db
      .delete(LateArrivalTable)
      .where(eq(LateArrivalTable.id, id))
      .returning();

    if (!lateArrival) {
      throw new AppError("Late arrival record not found.", {
        detail: "No late arrival record found with the given ID.",
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<LateArrivalTableSelectType>>({
      success: true,
      data: lateArrival,
    });
  },
  "Error at /api/late-arrival/[id] (DELETE)",
  [ROLE.ADMIN],
);
