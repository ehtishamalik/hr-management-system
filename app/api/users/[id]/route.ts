import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { UserDetailTable, user as UserTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { AppError } from "@/lib/errors";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, UserType } from "@/types";
import type {
  UserDetailTableInsertType,
  UserDetailTableSelectType,
} from "@/types";

// GET /api/users/[id] — own data or ADMIN
export const GET = withAuth(
  async (
    _request: NextRequest,
    _ctx: RouteContext<"/api/users/[id]">,
    _session,
  ) => {
    const { id } = await _ctx.params;

    if (_session.user.role !== ROLE.ADMIN && _session.user.id !== id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            message: "Forbidden",
            description: "You can only access your own profile.",
            statusCode: 403,
          },
        },
        { status: 403 },
      );
    }

    const [data] = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
      .where(eq(UserTable.id, id))
      .limit(1);

    if (!data) {
      throw new AppError("Employee not found", {
        detail: `No employee found with id: ${id}`,
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<UserType>>({
      success: true,
      data,
    });
  },
  "Error at api/users/[id] (GET)",
);

// PUT /api/users/[id] — ADMIN only
export const PUT = withAuth(
  async (_request: NextRequest, _ctx: RouteContext<"/api/users/[id]">) => {
    const { id } = await _ctx.params;

    const body: UserDetailTableInsertType = await _request.json();

    const [data] = await db
      .update(UserDetailTable)
      .set({
        ...body,
      })
      .where(eq(UserDetailTable.userId, id))
      .returning();

    return NextResponse.json<ApiResponse<UserDetailTableSelectType>>({
      success: true,
      data,
    });
  },
  "Error at api/users/[id] (PUT)",
  [ROLE.ADMIN],
);

// DELETE /api/users/[id] — blocked for all roles
export const DELETE = withAuth(async () => {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error: {
        message: "Forbidden",
        description: "User deletion is not permitted.",
        statusCode: 403,
      },
    },
    { status: 403 },
  );
}, "Error at api/users/[id] (DELETE)");
