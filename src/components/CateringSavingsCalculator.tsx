"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
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

// GPU-accelerated fill update - called inside RAF, zero React involvement
function updateFill(track: HTMLDivElement | null, label: HTMLSpanElement | null, pct: number, display: number) {
    if (track) track.style.width = `${pct}%`;
    if (label) label.textContent = String(display);
}

export default function CateringSavingsCalculator() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.cateringCalculator || {};

    const [guests, setGuests] = useState(25);
    const [mealType, setMealType] = useState<"lunch" | "dinner" | "drinks" | "breakfast">("lunch");
    const [events, setEvents] = useState(4);
    const [, startTransition] = useTransition();

    // DOM refs for instant visual updates (no React re-render during drag)
    const guestsTrackRef = useRef<HTMLDivElement>(null);
    const eventsTrackRef = useRef<HTMLDivElement>(null);
    const guestsLabelRef = useRef<HTMLSpanElement>(null);
    const eventsLabelRef = useRef<HTMLSpanElement>(null);
    const guestsInputRef = useRef<HTMLInputElement>(null);
    const eventsInputRef = useRef<HTMLInputElement>(null);

    // RAF refs for throttling
    const guestsRaf = useRef<number | null>(null);
    const eventsRaf = useRef<number | null>(null);

    // Attach passive touch listeners directly — not through React synthetic events
    useEffect(() => {
        const guestEl = guestsInputRef.current;
        const eventEl = eventsInputRef.current;
        if (!guestEl || !eventEl) return;

        const onGuestsInput = (e: Event) => {
            const val = Number((e.target as HTMLInputElement).value);
            if (guestsRaf.current) cancelAnimationFrame(guestsRaf.current);
            guestsRaf.current = requestAnimationFrame(() => {
                updateFill(guestsTrackRef.current, guestsLabelRef.current, ((val - 5) / 195) * 100, val);
            });
            startTransition(() => setGuests(val));
        };

        const onEventsInput = (e: Event) => {
            const val = Number((e.target as HTMLInputElement).value);
            if (eventsRaf.current) cancelAnimationFrame(eventsRaf.current);
            eventsRaf.current = requestAnimationFrame(() => {
                updateFill(eventsTrackRef.current, eventsLabelRef.current, ((val - 1) / 23) * 100, val);
            });
            startTransition(() => setEvents(val));
        };

        // Passive: browser doesn't wait for JS before moving thumb
        guestEl.addEventListener("input", onGuestsInput, { passive: true });
        eventEl.addEventListener("input", onEventsInput, { passive: true });

        return () => {
            guestEl.removeEventListener("input", onGuestsInput);
            eventEl.removeEventListener("input", onEventsInput);
            if (guestsRaf.current) cancelAnimationFrame(guestsRaf.current);
            if (eventsRaf.current) cancelAnimationFrame(eventsRaf.current);
        };
    }, [startTransition]);

    const restaurantTotal = guests * RESTAURANT_PPP[mealType] * events;
    const homemadeTotal = guests * HOMEMADE_PPP[mealType] * events;
    const savings = restaurantTotal - homemadeTotal;
    const savingsPct = Math.round((savings / restaurantTotal) * 100);
    const perEventSaving = savings / events;
    const barPct = (homemadeTotal / restaurantTotal) * 100;
    const guestsPct = ((guests - 5) / 195) * 100;
    const eventsPct = ((events - 1) / 23) * 100;

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
                            {/* Custom GPU-accelerated track */}
                            <div className="relative h-3 bg-gray-200 rounded-full" style={{ willChange: "transform" }}>
                                <div
                                    ref={guestsTrackRef}
                                    className="absolute left-0 top-0 h-3 bg-[#F27D42] rounded-full"
                                    style={{ width: `${guestsPct}%`, willChange: "width" }}
                                />
                            </div>
                            {/* Invisible native input layered on top — handles all touch/mouse events natively */}
                            <input
                                ref={guestsInputRef}
                                type="range"
                                min={5} max={200} step={5}
                                defaultValue={guests}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer -mt-3 relative opacity-0"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
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
                            <div className="relative h-3 bg-gray-200 rounded-full" style={{ willChange: "transform" }}>
                                <div
                                    ref={eventsTrackRef}
                                    className="absolute left-0 top-0 h-3 bg-[#F27D42] rounded-full"
                                    style={{ width: `${eventsPct}%`, willChange: "width" }}
                                />
                            </div>
                            <input
                                ref={eventsInputRef}
                                type="range"
                                min={1} max={24} step={1}
                                defaultValue={events}
                                className="w-full h-3 rounded-full appearance-none cursor-pointer -mt-3 relative opacity-0"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
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
                                <div className="font-heading text-7xl md:text-8xl font-bold mb-1 tracking-tight text-[#F27D42]">
                                    {formatEur(savings)}
                                </div>
                                <p className="text-white/70 font-medium mb-8 text-lg">{t.perYearText || "per year"} · {savingsPct}% {t.lessThanText || "less than restaurants"}</p>
                                <div className="w-full h-px bg-white/10 mb-8" />
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{t.perEventSave || "Per event saving"}</p>
                                        <p className="font-heading font-bold text-2xl">{formatEur(perEventSaving)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{t.over5Years || "Over 5 years"}</p>
                                        <p className="font-heading font-bold text-2xl">{formatEur(savings * 5)}</p>
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
                                        <span className="font-bold text-dark">{formatEur(restaurantTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-gray-300 h-2.5 rounded-full w-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-gray-500">{t.homemadeCatering || "Homemade catering"}</span>
                                        <span className="font-bold text-[#F27D42]">{formatEur(homemadeTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
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
