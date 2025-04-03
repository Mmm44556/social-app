import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(
  (_, req) => {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  },
  (req) => ({
    // Provide `domain` based on the request host
    domain: req.nextUrl.host,
  })
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Add root path
    "/",
  ],
};
