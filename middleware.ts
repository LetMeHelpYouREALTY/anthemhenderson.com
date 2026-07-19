import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname || "/";
  const response = NextResponse.next();
  response.headers.set("x-domain", hostname);
  response.headers.set("x-pathname", pathname);
  response.headers.set("x-url", request.nextUrl.href);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon|images|videos|realty|robots|sitemap).*)"],
};
