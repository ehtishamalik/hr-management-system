import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type HandlerFn = (request: NextRequest) => Promise<NextResponse>;

export function withAuth(handler: HandlerFn) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You are unauthorized to view this resource. Please login.",
        },
        { status: 401 }
      );
    }

    return handler(request);
  };
}
