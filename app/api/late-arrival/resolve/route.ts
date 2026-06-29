import { and, eq, inArray } from "drizzle-orm";
import { wsdb, db } from "@/db/drizzle";
import { LateArrivalTable, LeaveTable } from "@/db/schema";
import { withAuth } from "@/lib/auth/with-auth";
import { getActiveLeaveYear, formatDate } from "@/lib/utils";
import { checkPostRequest } from "../../leave/service";
import { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, LeaveTableInsertType } from "@/types";

// POST /api/late-arrival/resolve — ADMIN only
export const POST = withAuth(
  async (request: NextRequest, _ctx, _session) => {
    const { userId, lateArrivalIds, leaveTypeId } = await request.json();

    if (
      !userId ||
      !lateArrivalIds ||
      (lateArrivalIds as string[]).length !== 3 ||
      !leaveTypeId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request. Exactly 3 late arrivals and a leave type are required.",
        },
        { status: 400 },
      );
    }

    const lateArrivals = await db
      .select()
      .from(LateArrivalTable)
      .where(
        and(
          eq(LateArrivalTable.userId, userId),
          inArray(LateArrivalTable.id, lateArrivalIds),
        ),
      );

    if (lateArrivals.length !== 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not find all selected late arrivals for this user.",
        },
        { status: 404 },
      );
    }

    const alreadyResolved = lateArrivals.some((la) => la.resolved);
    if (alreadyResolved) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more selected late arrivals are already resolved.",
        },
        { status: 400 },
      );
    }

    const firstDate = new Date(lateArrivals[0].date);
    const month = firstDate.getMonth();
    const year = firstDate.getFullYear();

    const allSameMonth = lateArrivals.every((la) => {
      const d = new Date(la.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    if (!allSameMonth) {
      return NextResponse.json(
        {
          success: false,
          message: "All selected late arrivals must be from the same month.",
        },
        { status: 400 },
      );
    }

    const reason = `Resolved 3 late arrivals: ${lateArrivals
      .map((la) => `${formatDate(la.date)} at ${la.arrivalTime}`)
      .join(", ")}`;

    const leaveEntry: LeaveTableInsertType = {
      userId,
      leaveTypeId,
      fromDate: lateArrivals[0].date,
      toDate: lateArrivals[0].date,
      reason,
      numberOfDays: 1,
      leaveYear: getActiveLeaveYear(),
      leaveStatus: "LATE",
    };

    await checkPostRequest(leaveEntry, _session);

    const result = await wsdb.transaction(async (tx) => {
      const [insertedLeave] = await tx
        .insert(LeaveTable)
        .values(leaveEntry)
        .returning();

      await tx
        .update(LateArrivalTable)
        .set({ resolved: insertedLeave.id })
        .where(inArray(LateArrivalTable.id, lateArrivalIds));

      return insertedLeave;
    });

    return NextResponse.json<ApiResponse<typeof result>>({
      success: true,
      data: result,
      message: "Late arrivals resolved and leave deducted successfully.",
    });
  },
  "Error at /api/late-arrival/resolve (POST)",
  [ROLE.ADMIN],
);
