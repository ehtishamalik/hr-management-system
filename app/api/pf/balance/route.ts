import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/with-auth";
import { ROLE } from "@/enum";
import { ForbiddenError } from "@/lib/errors";
import { getPFBalance, getAllUsersPFBalance } from "@/services/pf";
import { getValueFromRequest } from "@/lib/utils";
import type { ApiResponse } from "@/types";

// GET /api/pf/balance              → ADMIN: all users' balances
// GET /api/pf/balance?userId=<id>  → ADMIN or own data: single user balance
export const GET = withAuth(async (request: NextRequest, _ctx, session) => {
  const isAdmin = session.user.role === ROLE.ADMIN;
  const userId = getValueFromRequest(request, "userId");

  if (userId) {
    if (!isAdmin && session.user.id !== userId) {
      throw new ForbiddenError("You can only view your own PF balance.");
    }
    const data = await getPFBalance(userId);
    return NextResponse.json<ApiResponse<typeof data>>({ success: true, data });
  }

  if (!isAdmin) {
    throw new ForbiddenError("Only admins can view all PF balances.");
  }

  const data = await getAllUsersPFBalance();
  return NextResponse.json<ApiResponse<typeof data>>({ success: true, data });
}, "Error at /api/pf/balance (GET)");
