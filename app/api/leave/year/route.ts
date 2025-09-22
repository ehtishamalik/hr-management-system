import { db } from "@/db/drizzle";
import { LeaveTable, LeaveYearTable } from "@/db/schema";
import { LEAVE_STATUS } from "@/enum";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { subDays } from "date-fns";
import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";

// GET Leave Year(s)
export const GET = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  try {
    if (id) {
      const [data] = await db
        .select()
        .from(LeaveYearTable)
        .where(eq(LeaveYearTable.id, id));

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "Leave year not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({
        success: true,
        data,
      });
    }

    const data = await db.select().from(LeaveYearTable);
    return NextResponse.json<CustomResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = handleError("Leave Year GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// POST Leave Year
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const leaves = await db
      .select()
      .from(LeaveTable)
      .where(
        inArray(LeaveTable.leaveStatus, [
          LEAVE_STATUS.ACCEPTED,
          LEAVE_STATUS.PENDING,
        ])
      );

    if (leaves.length > 0) {
      return NextResponse.json<CustomResponse>(
        {
          success: false,
          error:
            "Cannot create a new leave year while there are pending or accepted leaves.",
        },
        { status: 400 }
      );
    }

    const previousDay = subDays(new Date(body.startDate), 1)
      .toISOString()
      .slice(0, 10);

    await db
      .update(LeaveYearTable)
      .set({ endDate: previousDay, isActive: false })
      .where(eq(LeaveYearTable.isActive, true));

    const result = await db.insert(LeaveYearTable).values(body).returning();

    return NextResponse.json<CustomResponse>(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Leave Year POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// PUT Leave Year
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
      .update(LeaveYearTable)
      .set(updatedData)
      .where(eq(LeaveYearTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Year PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// DELETE Leave Year
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
      .delete(LeaveYearTable)
      .where(eq(LeaveYearTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    const errorMessage = handleError("Leave Year DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
