import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/desk");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
  }

  if (
    isApiRoute &&
    !req.nextUrl.pathname.startsWith("/api/auth") &&
    !isLoggedIn
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/desk/:path*", "/api/tasks/:path*", "/api/stats/:path*"],
};
