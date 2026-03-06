"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { trackCTAClick } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";

const HERO_IMAGES = [
    "/images/hero-banners/hero_main.jpg",
    "/images/hero-banners/hero_latest_2.jpg",
    "/images/hero-banners/hero_latest_3.jpg",
    "/images/hero-banners/hero_latest_4.jpg",
    "/images/hero-banners/hero_latest_5.jpg"
];

interface HeroProps {
    city?: string;
}

export default function Hero({ city }: HeroProps) {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.hero || {};

    const [bookingLink, setBookingLink] = useState("#booking");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Check for Typeform config
        const updateLink = () => {
            const saved = localStorage.getItem('formConfig');
            if (saved) {
                const config = JSON.parse(saved);
                if (config.useTypeform && config.typeformUrl) {
                    setBookingLink(config.typeformUrl);
                } else {
                    setBookingLink("#booking");
                }
            }
        };

        updateLink();
        window.addEventListener("storage", updateLink); // Listen for admin changes

        return () => {
            window.removeEventListener("storage", updateLink);
        };
    }, []);

    // Slideshow transition logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="relative w-full flex items-center justify-center overflow-hidden text-white bg-black" style={{ height: '90svh', maxHeight: '90svh' }}>
            {/* Background Slideshow using Next.js Image for LCP Optimization */}
            <AnimatePresence>
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-[-10%] z-0 block"
                >
                    <Image
                        src={HERO_IMAGES[currentImageIndex]}
                        alt={`Hero Background ${currentImageIndex + 1}`}
                        fill
                        priority={currentImageIndex === 0}
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Permanent Overlay to ensure text readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream to-transparent z-0" />

            <div className="relative z-10 text-center max-w-4xl px-5">

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 drop-shadow-lg"
                >
                    {t.titlePart1 || "Exceptional Catering"} {city && `in ${city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`}
                    <br />
                    {t.titlePart2 || "for Every"} <span className="text-orange italic font-serif">{t.titleHighlight || "Occasion"}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-base md:text-lg text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md"
                >
                    {t.subtitle || "From intimate gatherings to grand celebrations, we bring restaurant-quality cuisine to your event."}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col md:flex-row gap-5 justify-center"
                >
                    <Link
                        href={bookingLink}
                        target={bookingLink.startsWith('http') ? "_blank" : "_self"}
                        onClick={() => trackCTAClick("Request Quote", "hero_section")}
                        className="bg-orange/90 hover:bg-orange text-white px-10 py-4 rounded-full font-semibold uppercase tracking-wide backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-orange/40 hover:-translate-y-1 transition-all duration-300"
                    >
                        {t.cta || "Request Quote"}
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator — hidden on mobile so it doesn't cover the CTA */}
            <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10 opacity-70">
                <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[26px] h-[40px] border-2 border-white rounded-full flex justify-center pt-2">
                    <div className="w-1 h-1.5 bg-white rounded-full animate-bounce" />
                </div>
            </div>
        </header>
    );
}
