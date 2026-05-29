import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/client", req.url));
    }
    if (path.startsWith("/dashboard/client") && token?.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
    if (path === "/dashboard") {
      if (token?.role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      return NextResponse.redirect(new URL("/dashboard/client", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
