import { withAuth } from "@/lib/auth/with-auth";
import { updateLeaveStatus } from "@/lib/leave-action-handler";
import { LEAVE_STATUS, ROLE } from "@/enum";

import type { NextRequest } from "next/server";

export const PUT = withAuth(
  async (request: NextRequest, _ctx, session) => {
    const body = await request.json().catch(() => ({}));

    return updateLeaveStatus({
      request,
      session,
      newStatus: LEAVE_STATUS.SUSPENDED,
      systemRemark: `Leave has been ${LEAVE_STATUS.SUSPENDED} by ${session.user.name}.`,
      extraRemark: body.remark ?? undefined,
    });
  },
  "Error at /api/leave/suspend (PUT)",
  [ROLE.ADMIN],
);
