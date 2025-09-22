import { db } from "@/db/drizzle";
import { UserTable, LeaveRemarkTable } from "@/db/schema";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";

// GET Leave Remark(s)
export const GET = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");
  const leaveId = getValueFromRequest(request, "leaveId");

  try {
    if (leaveId) {
      const data = await db
        .select()
        .from(LeaveRemarkTable)
        .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
        .where(eq(LeaveRemarkTable.leaveId, leaveId))
        .orderBy(asc(LeaveRemarkTable.createdAt));

      return NextResponse.json<CustomResponse>(
        { success: true, data },
        { status: 200 }
      );
    }

    if (id) {
      const data = await db
        .select()
        .from(LeaveRemarkTable)
        .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
        .where(eq(LeaveRemarkTable.id, id));

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "Leave remark not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({
        success: true,
        data: data,
      });
    }

    const data = await db.select().from(LeaveRemarkTable);
    return NextResponse.json<CustomResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = handleError("Leave Remark GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// POST Leave Remark
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const [inserted] = await db
      .insert(LeaveRemarkTable)
      .values(body)
      .returning({ id: LeaveRemarkTable.id }); // Only need id for re-fetch

    // Step 2: Fetch joined remark + user
    const [data] = await db
      .select()
      .from(LeaveRemarkTable)
      .leftJoin(UserTable, eq(UserTable.id, LeaveRemarkTable.userId))
      .where(eq(LeaveRemarkTable.id, inserted.id));

    return NextResponse.json<CustomResponse>(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Leave Remark POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// PUT Leave Remark
export const PUT = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  if (!id) {
    return NextResponse.json<CustomResponse>(
      { success: false, error: "Missing 'id' in query parameters." },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const updatedData = { ...body, updatedAt: new Date() };

    const [result] = await db
      .update(LeaveRemarkTable)
      .set(updatedData)
      .where(eq(LeaveRemarkTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Remark PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// DELETE Leave Remark
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
      .delete(LeaveRemarkTable)
      .where(eq(LeaveRemarkTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Remark DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
