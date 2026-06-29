import { LEAVE_STATUS, ROLE } from "@/enum";
import { withAuth } from "@/lib/auth/with-auth";
import { updateLeaveStatus } from "@/lib/leave-action-handler";

import type { NextRequest } from "next/server";

export const PUT = withAuth(
  async (request: NextRequest, _ctx, session) => {
    const newStatus =
      session.user.role === ROLE.MANAGER
        ? LEAVE_STATUS.ACCEPTED
        : LEAVE_STATUS.APPROVED;

    return updateLeaveStatus({
      request,
      session,
      newStatus,
      systemRemark: `Leave has been ${newStatus} by ${session.user.name}.`,
    });
  },
  "Error at /api/leave/approve (PUT)",
  [ROLE.MANAGER, ROLE.ADMIN],
);
