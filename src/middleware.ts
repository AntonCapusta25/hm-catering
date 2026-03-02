import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore locales are readonly
    const negotiatorLocales: string[] = [...locales];

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        negotiatorLocales
    );

    const locale = match(languages, negotiatorLocales, defaultLocale);
    return locale;
}

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;

    // Skip public files, api routes, and static Next.js assets
    if (
        pathname.includes("/api/") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/images/") ||
        pathname.includes("/favicon.ico") ||
        pathname.includes("/icon.png") ||
        pathname.includes(".svg") ||
        pathname.includes("sitemap.xml") ||
        pathname.includes("robots.txt")
    ) {
        return NextResponse.next();
    }

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    // Create response with redirect
    const response = NextResponse.redirect(request.nextUrl);
    return response;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, images)
        '/((?!api|_next/static|_next/image|images|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
    ],
};
