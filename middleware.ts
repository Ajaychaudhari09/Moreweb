// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Match editor paths
  const isEditor =
    pathname === "/editor" ||
    pathname.startsWith("/editor/");

  if (isEditor) {
    // Block in production
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  return NextResponse.next();
}

// Run middleware only on editor paths
export const config = {
  matcher: ["/editor/:path*"],
};
