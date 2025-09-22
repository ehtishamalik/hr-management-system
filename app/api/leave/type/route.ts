import { db } from "@/db/drizzle";
import { LeaveTypeTable } from "@/db/schema";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";

export const GET = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  try {
    if (id) {
      const [data] = await db
        .select()
        .from(LeaveTypeTable)
        .where(eq(LeaveTypeTable.id, id));

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "Leave type not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({
        success: true,
        data: data,
      });
    }

    const data = await db.select().from(LeaveTypeTable);
    return NextResponse.json<CustomResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = handleError("Leave Type GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = await db.insert(LeaveTypeTable).values(body).returning();

    return NextResponse.json<CustomResponse>(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Leave Type POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

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
      .update(LeaveTypeTable)
      .set(updatedData)
      .where(eq(LeaveTypeTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Type PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

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
      .delete(LeaveTypeTable)
      .where(eq(LeaveTypeTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Type DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
