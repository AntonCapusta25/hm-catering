"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

const RESTAURANT_PPP: Record<string, number> = {
    lunch: 35, dinner: 65, drinks: 20, breakfast: 22,
};
const HOMEMADE_PPP: Record<string, number> = {
    lunch: 22, dinner: 40, drinks: 12, breakfast: 14,
};
const MEAL_LABELS: Record<string, string> = {
    lunch: "Team Lunch", dinner: "Team Dinner",
    drinks: "Drinks & Snacks", breakfast: "Breakfast Meeting",
};

function formatEur(v: number) {
    return "€" + Math.round(v).toLocaleString("nl-NL");
}

export default function CateringSavingsCalculator() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.cateringCalculator || {};

    const [guests, setGuests] = useState(25);
    const [mealType, setMealType] = useState<"lunch" | "dinner" | "drinks" | "breakfast">("lunch");
    const [events, setEvents] = useState(4);

    // DOM refs for instant visual updates (no React re-render during drag)
    const guestsInputRef = useRef<HTMLInputElement>(null);
    const eventsInputRef = useRef<HTMLInputElement>(null);

    const guestsLabelRef = useRef<HTMLSpanElement>(null);
    const eventsLabelRef = useRef<HTMLSpanElement>(null);

    // Result refs for extreme 60fps performance without React updates
    const savingsValRef = useRef<HTMLDivElement>(null);
    const savingsPctRef = useRef<HTMLSpanElement>(null);
    const perEventValRef = useRef<HTMLParagraphElement>(null);
    const over5YearsValRef = useRef<HTMLParagraphElement>(null);
    const restaurantTotalValRef = useRef<HTMLSpanElement>(null);
    const homemadeTotalValRef = useRef<HTMLSpanElement>(null);
    const barFillRef = useRef<HTMLDivElement>(null);

    // RAF refs for throttling
    const rafId = useRef<number | null>(null);

    // Keep mealType accessible to the vanilla JS event listener
    const mealTypeRef = useRef(mealType);
    useEffect(() => {
        mealTypeRef.current = mealType;
        // Trigger a visual recalculation whenever meal type changes
        if (guestsInputRef.current) guestsInputRef.current.dispatchEvent(new Event('input'));
    }, [mealType]);

    // Attach passive touch listeners directly
    useEffect(() => {
        const guestEl = guestsInputRef.current;
        const eventEl = eventsInputRef.current;
        if (!guestEl || !eventEl) return;

        const recalculate = () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                const g = Number(guestEl.value);
                const e = Number(eventEl.value);
                const mType = mealTypeRef.current;

                // 1. Math
                const restTotal = g * RESTAURANT_PPP[mType] * e;
                const hmTotal = g * HOMEMADE_PPP[mType] * e;
                const savings = restTotal - hmTotal;
                const savingsPct = Math.round((savings / restTotal) * 100);
                const perEventSaving = savings / e;
                const barPct = (hmTotal / restTotal) * 100;

                // 2. DOM Updates
                if (guestsLabelRef.current) guestsLabelRef.current.textContent = String(g);
                if (eventsLabelRef.current) eventsLabelRef.current.textContent = String(e);

                if (savingsValRef.current) savingsValRef.current.textContent = formatEur(savings);
                if (savingsPctRef.current) savingsPctRef.current.textContent = String(savingsPct);

                if (perEventValRef.current) perEventValRef.current.textContent = formatEur(perEventSaving);
                if (over5YearsValRef.current) over5YearsValRef.current.textContent = formatEur(savings * 5);

                if (restaurantTotalValRef.current) restaurantTotalValRef.current.textContent = formatEur(restTotal);
                if (homemadeTotalValRef.current) homemadeTotalValRef.current.textContent = formatEur(hmTotal);

                if (barFillRef.current) barFillRef.current.style.width = `${barPct}%`;
            });
        };

        // Passive: browser doesn't wait for JS before moving thumb
        guestEl.addEventListener("input", recalculate, { passive: true });
        eventEl.addEventListener("input", recalculate, { passive: true });

        return () => {
            guestEl.removeEventListener("input", recalculate);
            eventEl.removeEventListener("input", recalculate);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // For initial render (SSR matching), we still calculate the baseline values
    const restaurantTotal = guests * RESTAURANT_PPP[mealType] * events;
    const homemadeTotal = guests * HOMEMADE_PPP[mealType] * events;
    const savings = restaurantTotal - homemadeTotal;
    const savingsPct = Math.round((savings / restaurantTotal) * 100);
    const perEventSaving = savings / events;
    const barPct = (homemadeTotal / restaurantTotal) * 100;

    return (
        <section className="relative py-14 md:py-32 bg-gradient-to-b from-white to-cream overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F27D42]/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F27D42]/6 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-5 relative z-10 max-w-7xl">
                <div className="text-center mb-8 md:mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange/10 text-orange border border-orange/20 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest mb-6">
                        {t.badge || "💰 Savings Calculator"}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-dark mb-4 leading-tight">
                        {t.title1 || "See how much your team"}<br />
                        <span className="text-orange">{t.title2 || "could save"}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t.subtitle || "Compare the cost of restaurant catering vs. Homemade catering. Adjust the sliders to match your setup."}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
                    {/* Left: Controls */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-heading font-bold text-dark mb-8">{t.configTitle || "Configure your event"}</h3>

                        {/* Meal type */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t.eventTypeLabel || "Event type"}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(MEAL_LABELS).map(([key, defaultLabel]) => {
                                    const label = (t.mealLabels as Record<string, string>)?.[key] || defaultLabel;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setMealType(key as any)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-colors border ${mealType === key
                                                ? "bg-[#F27D42] text-white border-[#F27D42]"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#F27D42]/40 hover:text-[#F27D42]"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Guests slider */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t.guestsLabel || "Number of guests"}</label>
                                <span ref={guestsLabelRef} className="text-2xl font-heading font-bold text-dark">{guests}</span>
                            </div>
                            {/* Standard Native Slider */}
                            <input
                                ref={guestsInputRef}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                type="range"
                                min={5} max={200} step={5}
                                defaultValue={guests}
                                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#F27D42] outline-none"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium mt-3">
                                <span>{t.guestsMin || "5 guests"}</span>
                                <span>{t.guestsMax || "200 guests"}</span>
                            </div>
                        </div>

                        {/* Events slider */}
                        <div className="mb-2">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t.eventsLabel || "Events per year"}</label>
                                <span ref={eventsLabelRef} className="text-2xl font-heading font-bold text-dark">{events}</span>
                            </div>
                            {/* Standard Native Slider */}
                            <input
                                ref={eventsInputRef}
                                onChange={(e) => setEvents(Number(e.target.value))}
                                type="range"
                                min={1} max={24} step={1}
                                defaultValue={events}
                                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-[#F27D42] outline-none"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium mt-3">
                                <span>{t.eventsMin || "1x"}</span>
                                <span>{t.eventsMax || "24x / year"}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-500 leading-relaxed">
                            <p>{t.noteRef || "💡 Based on average Amsterdam restaurant catering rates vs. Homemade's transparent pricing. Actual savings may vary."}</p>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-[#1A2D20] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D42]/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-white/70 font-medium mb-2 text-lg">{t.saveText || "You could save"}</p>
                                <div
                                    ref={savingsValRef}
                                    className="font-heading text-7xl md:text-8xl font-bold mb-1 tracking-tight text-[#F27D42]"
                                >
                                    {formatEur(savings)}
                                </div>
                                <p className="text-white/70 font-medium mb-8 text-lg">
                                    {t.perYearText || "per year"} · <span ref={savingsPctRef}>{savingsPct}</span>% {t.lessThanText || "less than restaurants"}
                                </p>
                                <div className="w-full h-px bg-white/10 mb-8" />
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{t.perEventSave || "Per event saving"}</p>
                                        <p ref={perEventValRef} className="font-heading font-bold text-2xl">{formatEur(perEventSaving)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{t.over5Years || "Over 5 years"}</p>
                                        <p ref={over5YearsValRef} className="font-heading font-bold text-2xl">{formatEur(savings * 5)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h4 className="font-heading font-bold text-dark mb-6 text-lg">{t.costBreakdown || "Annual cost breakdown"}</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-gray-500">{t.restaurantCatering || "Restaurant catering"}</span>
                                        <span ref={restaurantTotalValRef} className="font-bold text-dark">{formatEur(restaurantTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-gray-300 h-2.5 rounded-full w-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-gray-500">{t.homemadeCatering || "Homemade catering"}</span>
                                        <span ref={homemadeTotalValRef} className="font-bold text-[#F27D42]">{formatEur(homemadeTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            ref={barFillRef}
                                            className="bg-[#F27D42] h-2.5 rounded-full"
                                            style={{ width: `${barPct}%`, transition: "width 0.15s ease-out" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <a
                                href="#booking"
                                className="mt-8 block w-full text-center bg-[#F27D42] text-white font-heading font-bold text-lg py-4 rounded-2xl transition-colors hover:bg-[#d66a35]"
                            >
                                {t.bookBtn || "Book your first event →"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
