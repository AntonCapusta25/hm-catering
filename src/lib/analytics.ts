// Google Analytics Event Tracking Helper
// Use this to track custom events throughout the app

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    console.log('[Analytics] trackEvent called:', eventName, eventParams);

    if (typeof window !== "undefined" && (window as any).gtag) {
        console.log('[Analytics] gtag available, sending event');
        (window as any).gtag("event", eventName, eventParams);
    } else {
        console.warn('[Analytics] gtag not available. Window:', typeof window, 'gtag:', typeof (window as any)?.gtag);
    }
};

// Predefined event tracking functions for common actions

export const trackCTAClick = (ctaName: string, location: string) => {
    trackEvent("cta_click", {
        event_category: "engagement",
        event_label: ctaName,
        location: location,
    });
};

export const trackMenuView = (menuTitle: string, cuisine: string) => {
    trackEvent("menu_view", {
        event_category: "engagement",
        event_label: menuTitle,
        cuisine: cuisine,
    });
};

export const trackFAQClick = (question: string) => {
    trackEvent("faq_click", {
        event_category: "engagement",
        event_label: question,
    });
};

export const trackScrollDepth = (depth: number) => {
    trackEvent("scroll_depth", {
        event_category: "engagement",
        depth_percentage: depth,
    });
};

export const trackSectionView = (sectionName: string) => {
    trackEvent("section_view", {
        event_category: "engagement",
        event_label: sectionName,
    });
};

export const trackFormInteraction = (fieldName: string) => {
    trackEvent("form_interaction", {
        event_category: "engagement",
        event_label: fieldName,
    });
};

export const trackOccasionView = (occasionTitle: string) => {
    trackEvent("occasion_view", {
        event_category: "engagement",
        event_label: occasionTitle,
    });
};

export const trackCuisineClick = (cuisineTitle: string) => {
    trackEvent("cuisine_click", {
        event_category: "engagement",
        event_label: cuisineTitle,
    });
};
