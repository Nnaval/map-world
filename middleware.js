import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Middleware Request URL:", req.nextUrl.pathname);
  // console.log("JWT Token in Middleware:", token);

  if (!token) {
    console.log("No token found → Redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("User is authenticated → Proceeding to requested page");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
    "/profile/edit",
    "/profile/settings",
  ],
};
