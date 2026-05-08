// Google Analytics Event Tracking Helper
// Use this to track custom events throughout the app

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    console.log('[Analytics] trackEvent called:', eventName, eventParams);

    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", eventName, eventParams);
    }

    // Meta Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
        // Map common events to Meta standard events if applicable
        if (eventName === 'generate_lead' || eventName === 'form_submit') {
            (window as any).fbq('track', 'Lead', {
                content_name: eventParams?.event_label || eventName,
                value: eventParams?.value || 1.00,
                currency: eventParams?.currency || 'EUR'
            });
        } else if (eventName === 'contact_info_provided') {
            (window as any).fbq('track', 'Contact');
        } else {
            // Track as custom event
            (window as any).fbq('trackCustom', eventName, eventParams);
        }
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
