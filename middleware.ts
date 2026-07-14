import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const authorProfileId = req.auth?.user?.authorProfileId;

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (nextUrl.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/reader", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/dashboard/author") && !authorProfileId) {
    return NextResponse.redirect(new URL("/dashboard/reader", nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
