"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Meta Pixel PageView
        if ((window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }

        // Google Analytics PageView
        if ((window as any).gtag) {
            (window as any).gtag('config', 'G-GXYRK3H40X', {
                page_path: pathname + searchParams.toString(),
            });
        }

        // TikTok Pixel PageView
        if ((window as any).ttq) {
            (window as any).ttq.page();
        }

        console.log('[Analytics] PageView tracked:', pathname);
    }, [pathname, searchParams]);

    return null;
}
