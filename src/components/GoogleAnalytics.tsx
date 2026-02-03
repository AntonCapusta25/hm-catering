"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    );
}

// Helper function to track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", eventName, eventParams);
    }
};

// Helper function to track conversions
export const trackConversion = (conversionLabel: string, value?: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
            send_to: conversionLabel,
            value: value || 0,
            currency: "EUR",
        });
    }
};
