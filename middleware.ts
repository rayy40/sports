import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Regular expression to match the pattern: /{sport}/{category}/{id}
  const routePattern =
    /^\/(football|baseball|basketball|hockey|rugby|american-football)\/(league|team)\/(\d+)$/;

  const match = pathname.match(routePattern);

  if (match) {
    const newUrl = new URL(`${pathname}/fixtures`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/football/:path*",
    "/baseball/:path*",
    "/american-football/:path*",
    "/basketball/:path*",
    "/hockey/:path*",
    "/rugby/:path*",
  ],
};
