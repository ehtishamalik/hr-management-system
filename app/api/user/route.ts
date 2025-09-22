import { db } from "@/db/drizzle";
import { UserTable, UserDetailTable } from "@/db/schema";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { nanoid } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";
import type {
  UserDetailTableInsertType,
  UserTableInsertType,
} from "@/db/types";

/**
 * GET /api/users?id=...
 * - If id provided → fetch single user
 * - If no id → fetch all users
 */
export const GET = async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");
  const email = getValueFromRequest(request, "email");

  try {
    if (id || email) {
      const condition = id ? eq(UserTable.id, id) : eq(UserTable.email, email!);

      const [data] = await db
        .select()
        .from(UserTable)
        .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId))
        .where(condition);

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "User not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({
        success: true,
        data,
      });
    }

    const data = await db
      .select()
      .from(UserTable)
      .leftJoin(UserDetailTable, eq(UserTable.id, UserDetailTable.userId));
    return NextResponse.json<CustomResponse>({
      success: true,
      data,
    });
  } catch (error) {
    const errorMessage = handleError("Users GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
};

/**
 * POST /api/users
 * - Create a new user
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body: UserTableInsertType & UserDetailTableInsertType =
      await request.json();

    const [userResult] = await db
      .insert(UserTable)
      .values({
        id: nanoid(),
        email: body.email,
        name: body.name,
        image: body.image,
      })
      .returning();

    const [detailResult] = await db
      .insert(UserDetailTable)
      .values({
        userId: userResult.id,
        employeeId: body.employeeId,
        address: body.address,
        cnic: body.cnic,
        phone: body.phone,
        role: body.role,
        designation: body.designation,
        dob: body.dob,
        joinedAt: body.joinedAt,
        salary: body.salary,
        taxAmount: body.taxAmount,
        teamLeadId: body.teamLeadId,
        status: body.status,
      })
      .returning();

    return NextResponse.json<CustomResponse>(
      { success: true, data: { user: userResult, user_detail: detailResult } },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Users POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

/**
 * PUT /api/users?id=...
 * - Update a user by id
 */
export const PUT = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    return NextResponse.json<CustomResponse>(
      { success: false, error: "Missing 'id' in query parameters." },
      { status: 400 }
    );
  }

  try {
    const body: UserTableInsertType & UserDetailTableInsertType =
      await request.json();

    const updatedData = { ...body, updatedAt: new Date() };

    const [userResult] = await db
      .update(UserTable)
      .set({
        email: updatedData.email,
        name: updatedData.name,
        image: body.image,
        updatedAt: updatedData.updatedAt,
      })
      .where(eq(UserTable.id, id))
      .returning();

    const [detailResult] = await db
      .update(UserDetailTable)
      .set({
        userId: userResult.id,
        employeeId: body.employeeId,
        address: body.address,
        cnic: body.cnic,
        phone: body.phone,
        role: body.role,
        designation: body.designation,
        dob: body.dob,
        joinedAt: body.joinedAt,
        salary: body.salary,
        taxAmount: body.taxAmount,
        teamLeadId: body.teamLeadId,
        status: body.status,
      })
      .where(eq(UserDetailTable.userId, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: { user: userResult, user_detail: detailResult },
    });
  } catch (error) {
    const errorMessage = handleError("Users PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

/**
 * DELETE /api/users?id=...
 * - Delete a user by id
 */
export const DELETE = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    return NextResponse.json<CustomResponse>(
      { success: false, error: "Missing 'id' in query parameters." },
      { status: 400 }
    );
  }

  try {
    const [result] = await db
      .delete(UserTable)
      .where(eq(UserTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Users DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
