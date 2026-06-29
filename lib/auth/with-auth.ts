import { handleError } from "@/lib/error-handling";
import { auth } from "@/lib/auth";

import type { ROLE } from "@/enum";

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse, SessionType } from "@/types";
import { AppError } from "../errors";

type HandlerFn<TCtx = unknown> = (
  request: NextRequest,
  ctx: TCtx,
  session: SessionType,
) => Promise<NextResponse>;

export function withAuth<TCtx>(
  handler: HandlerFn<TCtx>,
  message: string,
  allowedRoles?: ROLE[],
) {
  return async (request: NextRequest, ctx: TCtx): Promise<NextResponse> => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user?.id) {
        throw new AppError("Unauthorized", {
          detail: "You are unauthorized to view this resource. Please login.",
          status: 401,
        });
      }

      if (allowedRoles && !allowedRoles.includes(session.user.role as ROLE)) {
        throw new AppError("Forbidden", {
          detail: "You do not have permission to perform this action.",
          status: 403,
        });
      }

      return await handler(request, ctx, session);
    } catch (error) {
      const errorResponse = handleError(message, error);
      return NextResponse.json<ApiResponse<null>>(errorResponse, {
        status: errorResponse.error.statusCode,
      });
    }
  };
}
