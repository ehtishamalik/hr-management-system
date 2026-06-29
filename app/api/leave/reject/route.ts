import { LEAVE_STATUS, ROLE } from "@/enum";
import { withAuth } from "@/lib/auth/with-auth";
import { updateLeaveStatus } from "@/lib/leave-action-handler";

import type { NextRequest } from "next/server";

export const PUT = withAuth(
  async (request: NextRequest, _ctx, session) => {
    const body = await request.json().catch(() => ({}));

    return updateLeaveStatus({
      request,
      session,
      newStatus: LEAVE_STATUS.REJECTED,
      systemRemark: `Leave has been ${LEAVE_STATUS.REJECTED} by ${session.user.name}.`,
      extraRemark: body.remark ?? undefined,
    });
  },
  "Error at /api/leave/reject (PUT)",
  [ROLE.MANAGER, ROLE.ADMIN],
);
