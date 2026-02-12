import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public files and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If already has locale prefix, continue
  const hasLocale = locales.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
  if (hasLocale) return NextResponse.next();

  // Default to /en (or configured defaultLocale)
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
