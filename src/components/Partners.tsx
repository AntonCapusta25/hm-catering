"use client";

import React from "react";
import { motion } from "framer-motion";

const PARTNERS = [
    { name: "El Nino", logo: "/images/partners/el-nino.png" },
    { name: "Upfront", logo: "/images/partners/upfront.png" },
    { name: "Sure Mobility", logo: "/images/partners/sure-mobility.png" },
    { name: "University of Twente", logo: "/images/partners/utwente.png" },
    { name: "Novel-T", logo: "/images/partners/novel-t.png" },
    { name: "Create Tomorrow", logo: "/images/partners/create-tomorrow.png" },
];

export default function Partners() {
    return (
        <section className="py-12 bg-[#FFF8F0] border-b border-gray-100 overflow-hidden">
            <div className="container mx-auto px-5 mb-8 text-center">
                <p className="text-light uppercase tracking-widest text-xs font-bold">
                    Proudly Partnering With
                </p>
            </div>

            <div className="relative flex w-full">
                {/* Gradient Masks for fade effect */}
                <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#FFF8F0] to-transparent z-10" />
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#FFF8F0] to-transparent z-10" />

                {/* Infinite Scroll Container */}
                <div className="flex w-full overflow-hidden">
                    <motion.div
                        className="flex gap-16 md:gap-24 items-center flex-nowrap"
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
                                        ? 'w-52 h-24 md:w-80 md:h-40'
                                        : partner.name === 'Upfront'
                                            ? 'w-40 h-20 md:w-56 md:h-28'
                                            : 'w-32 h-16 md:w-40 md:h-20'
                                    }`}
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
