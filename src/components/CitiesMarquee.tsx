"use client";

import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";
import Link from "next/link";
import { useParams } from "next/navigation";

// The 7 active operational cities
const CITIES = [
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Haarlem",
    "Hengelo",
    "Enschede",
    "Groningen"
];

export default function CitiesMarquee() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.citiesMarquee || {};
    const params = useParams();
    const lang = (params?.lang as string) || "en";

    return (
        <section className="py-12 bg-orange text-cream border-y border-orange/20 overflow-hidden flex flex-col items-center">
            <div className="container mx-auto px-5 mb-6 text-center">
                <p className="uppercase tracking-widest text-sm font-semibold opacity-90">
                    {t.heading || "Now delivering exceptional catering across"}
                </p>
            </div>

            <div className="relative flex w-full">
                {/* Gradient Masks for fade effect */}
                <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-orange to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-orange to-transparent z-10" />

                {/* Infinite Scroll Container */}
                <div className="flex w-full overflow-hidden">
                    <motion.div
                        className="flex gap-16 md:gap-32 items-center flex-nowrap whitespace-nowrap"
                        animate={{
                            x: [0, -1500] // Roughly the width of one full set of items
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30, // Slow, elegant scroll
                                ease: "linear",
                            },
                        }}
                    >
                        {/* Repeat cities multiple times to ensure continuous flow without jumping */}
                        {[...CITIES, ...CITIES, ...CITIES, ...CITIES].map((city, index) => (
                            <div
                                key={`${city}-${index}`}
                                className="flex items-center gap-16 md:gap-32"
                            >
                                <Link href={`/${lang}/${city.toLowerCase().replace(' ', '-')}`}>
                                    <span className="font-heading font-bold text-4xl md:text-6xl tracking-wide opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:text-white">
                                        {city}
                                    </span>
                                </Link>
                                {/* Dot separator */}
                                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cream/50" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
