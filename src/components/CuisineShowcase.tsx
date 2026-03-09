"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cuisines } from "@/lib/data";
import { trackCuisineClick, trackCTAClick } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import { usePathname } from 'next/navigation';

export default function CuisineShowcase() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.cuisineShowcase || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    return (
        <section id="menu-boxes" className="relative w-full py-14 md:py-32 bg-cream overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-20 left-10 w-64 h-64 bg-orange/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-5 relative z-10">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        {t.title1 || "Explore Our"} <span className="text-orange">{t.title2 || "Cuisines"}</span>
                    </h2>
                    <p className="text-light max-w-2xl mx-auto text-lg leading-relaxed">
                        {t.subtitle || "From authentic classics to modern fusion, choose a culinary theme that perfectly matches your event's vibe."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {cuisines.map((cuisine) => {
                        const translation = t.items?.[cuisine.id] || {};
                        return (
                            <div
                                key={cuisine.id}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="h-64 w-full overflow-hidden relative block">
                                    <Image
                                        src={cuisine.image}
                                        alt={translation.title || cuisine.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-dark mb-3 group-hover:text-orange transition-colors">
                                        {translation.title || cuisine.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {translation.description || cuisine.description}
                                    </p>

                                    <Link
                                        href={`/${lang}/quote`}
                                        onClick={() => trackCuisineClick(cuisine.title)}
                                        className="inline-flex items-center gap-2 font-bold text-orange uppercase tracking-wider text-sm hover:gap-3 transition-all"
                                    >
                                        {t.requestQuote || "Request Quote"}
                                        <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <Link
                        href="/#booking"
                        onClick={() => trackCTAClick("Plan Your Menu Now", "cuisine_section")}
                        className="inline-block bg-orange text-white text-lg font-bold uppercase tracking-wider py-4 px-10 rounded-full hover:bg-dark transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        {t.planMenu || "Plan Your Menu Now"}
                    </Link>
                    <p className="mt-4 text-light text-sm">
                        {t.customAlert || "Custom menus available upon request"}
                    </p>
                </div>
            </div>
        </section>
    );
}
