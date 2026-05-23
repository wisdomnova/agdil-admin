import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "agdil_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    if (token && secret && pathname.startsWith("/login")) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        /* stay on login */
      }
    }
    return NextResponse.next();
  }

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
