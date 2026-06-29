import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { LEAVES } from "@/constants/leaves";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, LeaveDefinition } from "@/types";

// GET  /api/leave/type/[id]
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/leave/remark/[id]">,
  ) => {
    const { id } = await _ctx.params;

    const data = LEAVES.find((l) => l.id === id);

    if (!data) {
      throw new AppError("Leave type not found.", {
        detail: `No leave type found with id: ${id}`,
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<LeaveDefinition>>({
      success: true,
      data: data,
    });
  },
  "Error at /api/leave/type/[id] (GET)",
);
