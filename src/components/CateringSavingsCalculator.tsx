"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

// Average restaurant catering costs per person by meal type
const RESTAURANT_PPP: Record<string, number> = {
    lunch: 35,
    dinner: 65,
    drinks: 20,
    breakfast: 22,
};

// Our pricing per person by meal type
const HOMEMADE_PPP: Record<string, number> = {
    lunch: 22,
    dinner: 40,
    drinks: 12,
    breakfast: 14,
};

const MEAL_LABELS: Record<string, string> = {
    lunch: "Team Lunch",
    dinner: "Team Dinner",
    drinks: "Drinks & Snacks",
    breakfast: "Breakfast Meeting",
};

function formatEur(value: number) {
    return "€" + Math.round(value).toLocaleString("nl-NL");
}

export default function CateringSavingsCalculator() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.cateringCalculator || {};

    const [guests, setGuests] = useState(25);
    const [mealType, setMealType] = useState<"lunch" | "dinner" | "drinks" | "breakfast">("lunch");
    const [events, setEvents] = useState(4); // per year

    const mealLabels = t.mealLabels || MEAL_LABELS;

    const restaurantTotal = useMemo(() => guests * RESTAURANT_PPP[mealType] * events, [guests, mealType, events]);
    const homemadeTotal = useMemo(() => guests * HOMEMADE_PPP[mealType] * events, [guests, mealType, events]);
    const savings = useMemo(() => restaurantTotal - homemadeTotal, [restaurantTotal, homemadeTotal]);
    const savingsPct = useMemo(() => Math.round((savings / restaurantTotal) * 100), [savings, restaurantTotal]);

    const perEventSaving = useMemo(() => savings / events, [savings, events]);

    return (
        <section className="relative py-32 bg-gradient-to-b from-white to-cream overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F27D42]/8 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F27D42]/6 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-5 relative z-10 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
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
                </motion.div>

                {/* Two-column layout */}
                <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">

                    {/* Left: Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
                    >
                        <h3 className="text-2xl font-heading font-bold text-dark mb-8">{t.configTitle || "Configure your event"}</h3>

                        {/* Meal type selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{t.eventTypeLabel || "Event type"}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(MEAL_LABELS).map(([key, defaultLabel]) => {
                                    const label = (t.mealLabels as Record<string, string>)?.[key] || defaultLabel;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setMealType(key as any)}
                                            className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${mealType === key
                                                ? "bg-[#F27D42] text-white border-[#F27D42] shadow-lg shadow-orange/20"
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
                                <span className="text-2xl font-heading font-bold text-dark">{guests}</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={200}
                                step={5}
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#F27D42] bg-gray-100"
                                style={{ background: `linear-gradient(to right, #F27D42 ${((guests - 5) / 195) * 100}%, #e5e7eb ${((guests - 5) / 195) * 100}%)` }}
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                                <span>{t.guestsMin || "5 guests"}</span>
                                <span>{t.guestsMax || "200 guests"}</span>
                            </div>
                        </div>

                        {/* Events per year */}
                        <div className="mb-2">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t.eventsLabel || "Events per year"}</label>
                                <span className="text-2xl font-heading font-bold text-dark">{events}</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={24}
                                step={1}
                                value={events}
                                onChange={(e) => setEvents(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#F27D42]"
                                style={{ background: `linear-gradient(to right, #F27D42 ${((events - 1) / 23) * 100}%, #e5e7eb ${((events - 1) / 23) * 100}%)` }}
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                                <span>{t.eventsMin || "1x"}</span>
                                <span>{t.eventsMax || "24x / year"}</span>
                            </div>
                        </div>

                        {/* Comparison note */}
                        <div className="mt-8 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-500 leading-relaxed">
                            <p>{t.noteRef || "💡 Based on average Amsterdam restaurant catering rates vs. Homemade's transparent pricing. Actual savings may vary."}</p>
                        </div>
                    </motion.div>

                    {/* Right: Results card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-5"
                    >
                        {/* Main savings card */}
                        <div className="bg-[#1A2D20] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F27D42]/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-white/70 font-medium mb-2 text-lg">{t.saveText || "You could save"}</p>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="font-heading text-7xl md:text-8xl font-bold mb-1 tracking-tight text-[#F27D42]"
                                >
                                    {formatEur(savings)}
                                </motion.div>
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

                        {/* Cost breakdown */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h4 className="font-heading font-bold text-dark mb-6 text-lg">{t.costBreakdown || "Annual cost breakdown"}</h4>
                            <div className="space-y-4">
                                {/* Restaurant */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-gray-500">{t.restaurantCatering || "Restaurant catering"}</span>
                                        <span className="font-bold text-dark">{formatEur(restaurantTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-gray-300 h-2.5 rounded-full w-full" />
                                    </div>
                                </div>
                                {/* Homemade */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-gray-500">{t.homemadeCatering || "Homemade catering"}</span>
                                        <span className="font-bold text-[#F27D42]">{formatEur(homemadeTotal)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-[#F27D42] h-2.5 rounded-full"
                                            animate={{ width: `${(homemadeTotal / restaurantTotal) * 100}%` }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#booking"
                                className="mt-8 block w-full text-center bg-[#F27D42] text-white font-heading font-bold text-lg py-4 rounded-2xl transition-all hover:bg-[#d66a35] shadow-lg hover:shadow-xl hover:scale-[1.02]"
                            >
                                {t.bookBtn || "Book your first event →"}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
