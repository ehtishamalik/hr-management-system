import { withAuth } from "@/lib/auth/with-auth";
import { NextResponse } from "next/server";
import { LEAVES } from "@/constants/leaves";

import type { ApiResponse, LeaveDefinition } from "@/types";

// GET api/leave/type
export const GET = withAuth(async () => {
  return NextResponse.json<ApiResponse<LeaveDefinition[]>>({
    success: true,
    data: LEAVES,
  });
}, "Error at /api/leave/type (GET)");
