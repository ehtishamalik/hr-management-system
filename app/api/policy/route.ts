import { db } from "@/db/drizzle";
import { PolicyTable } from "@/db/schema";
import { handleError } from "@/lib/error";
import { getValueFromRequest } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

import type { CustomResponse } from "@/types";

// GET /api/policies or /api/policies?id=uuid
export const GET = withAuth(async (request: NextRequest) => {
  const id = getValueFromRequest(request, "id");

  try {
    if (id) {
      const [data] = await db
        .select()
        .from(PolicyTable)
        .where(eq(PolicyTable.id, id));

      if (!data) {
        return NextResponse.json<CustomResponse>(
          { success: false, error: "Policy not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<CustomResponse>({ success: true, data });
    }

    const data = await db.select().from(PolicyTable);
    return NextResponse.json<CustomResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = handleError("Policy GET error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// POST /api/policies
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = await db.insert(PolicyTable).values(body).returning();

    return NextResponse.json<CustomResponse>(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = handleError("Policy POST error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// PUT /api/policies?id=uuid
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
      .update(PolicyTable)
      .set(updatedData)
      .where(eq(PolicyTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({ success: true, data: result });
  } catch (error) {
    const errorMessage = handleError("Policy PUT error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});

// DELETE /api/policies?id=uuid
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
      .delete(PolicyTable)
      .where(eq(PolicyTable.id, id))
      .returning();

    return NextResponse.json<CustomResponse>({ success: true, data: result });
  } catch (error) {
    const errorMessage = handleError("Policy DELETE error:", error);
    return NextResponse.json<CustomResponse>(errorMessage, { status: 500 });
  }
});
