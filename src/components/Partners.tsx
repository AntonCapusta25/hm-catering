"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

const PARTNERS = [
    { name: "El Nino", logo: "/images/partners/el-nino.png" },
    { name: "Upfront", logo: "/images/partners/upfront.png" },
    { name: "Sure Mobility", logo: "/images/partners/sure-mobility.png" },
    { name: "University of Twente", logo: "/images/partners/utwente.png" },
    { name: "Novel-T", logo: "/images/partners/novel-t.png" },
    { name: "Create Tomorrow", logo: "/images/partners/create-tomorrow.png" },
];

export default function Partners() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.partners || {};

    return (
        <section className="py-12 md:py-24 bg-[#FFF8F0] border-b border-gray-100 overflow-hidden">
            <div className="container mx-auto px-5 mb-8 text-center">
                <p className="text-light uppercase tracking-widest text-xs font-bold">
                    {t.heading || "Proudly Partnering With"}
                </p>
            </div>

            <div className="relative flex w-full">
                {/* Gradient Masks for fade effect */}
                <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#FFF8F0] to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#FFF8F0] to-transparent z-10" />

                {/* Infinite Scroll Container */}
                <div className="flex w-full overflow-hidden">
                    <motion.div
                        className="flex gap-8 md:gap-16 items-center flex-nowrap"
                        animate={{
                            x: [0, -1000] // Adjust based on width of content
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 25,
                                ease: "linear",
                            },
                        }}
                    >
                        {/* Repeat logos multiple times to ensure continuous flow */}
                        {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
                            <div
                                key={`${partner.name}-${index}`}
                                className={`relative flex-shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${partner.name === 'Sure Mobility'
                                    ? 'w-56 h-28 md:w-80 md:h-40 mx-[-30px] md:mx-[-50px]'
                                    : partner.name === 'Upfront'
                                        ? 'w-36 h-18 md:w-52 md:h-26'
                                        : 'w-28 h-14 md:w-36 md:h-18'
                                    }`}
                            >
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
