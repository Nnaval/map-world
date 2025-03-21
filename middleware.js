import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Middleware function
export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If the user is not authenticated, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Continue request if authenticated
}

// Define protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile",
    "/profile/edit",
    "/profile/settings",
  ], // Apply middleware to these routes
};
