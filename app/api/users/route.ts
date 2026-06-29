import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { UserDetailTable, user as UserTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getValueFromRequest } from "@/lib/utils";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { UserDetailTableInsertType } from "@/types";
import type { ApiResponse, UserType } from "@/types";

// GET /api/users — ADMIN only
export const GET = withAuth(
  async (request: NextRequest) => {
    const email = getValueFromRequest(request, "email");

    if (email) {
      const [data] = await db
        .select()
        .from(UserTable)
        .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
        .where(eq(UserTable.email, email));

      return NextResponse.json<ApiResponse<UserType>>({
        success: true,
        data,
      });
    }

    const data = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId));

    return NextResponse.json<ApiResponse<UserType[]>>({
      success: true,
      data,
    });
  },
  "Error at api/users (GET)",
  [ROLE.ADMIN],
);

// POST /api/users — ADMIN only
export const POST = withAuth(
  async (request: NextRequest) => {
    const body: UserDetailTableInsertType = await request.json();

    const [data] = await db
      .insert(UserDetailTable)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json<ApiResponse<UserDetailTableInsertType>>(
      {
        success: true,
        data,
      },
      { status: 201 },
    );
  },
  "Error at api/users (POST)",
  [ROLE.ADMIN],
);
