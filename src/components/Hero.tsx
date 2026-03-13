"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { trackCTAClick } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import AnimatedHeroHeadline from "./AnimatedHeroHeadline";
import { usePathname } from 'next/navigation';

const HERO_IMAGES = [
    "/images/hero-banners/hero_main.jpg",
    "/images/hero-banners/hero_latest_2.jpg",
    "/images/hero-banners/hero_latest_3.jpg",
    "/images/hero-banners/hero_latest_4.jpg",
    "/images/hero-banners/hero_latest_5.jpg"
];

const MOBILE_HERO_IMAGES = [
    "/images/hero-banners/hero_mobile_1.jpg",
    "/images/hero-banners/hero_mobile_2.jpg",
    "/images/hero-banners/hero_mobile_3.jpg",
    "/images/hero-banners/hero_mobile_4.jpg"
];

interface HeroProps {
    city?: string;
}

export default function Hero({ city }: HeroProps) {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.hero || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const [bookingLink, setBookingLink] = useState(`/${lang}/quote`);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const images = isMobile ? MOBILE_HERO_IMAGES : HERO_IMAGES;

    useEffect(() => {
        // Check for Typeform config
        const updateLink = () => {
            const saved = localStorage.getItem('formConfig');
            if (saved) {
                const config = JSON.parse(saved);
                if (config.useTypeform && config.typeformUrl) {
                    setBookingLink(config.typeformUrl);
                } else {
                    setBookingLink(`/${lang}/quote`);
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
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images]); // Re-run when image set changes

    // Reset index if it exceeds new array length
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [isMobile]);

    return (
        <header className="relative w-full overflow-hidden text-white bg-black" style={{ height: '100svh', maxHeight: '100svh' }}>
            {/* Background Slideshow using Next.js Image for LCP Optimization */}
            <AnimatePresence>
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-0 block"
                >
                    <Image
                        src={images[currentImageIndex]}
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

            <div className="relative z-10 w-full h-full flex flex-col justify-start md:justify-center items-center pt-36 md:pt-0 py-12 md:py-20 px-5">
                <div className="text-center max-w-4xl w-full flex flex-col items-center">
                    <AnimatedHeroHeadline
                        staticText={t.animatedTitleStatic || "Home Chefs. At Your Office. Delivering in "}
                        words={t.animatedRotatingWords || ["Amsterdam", "Rotterdam", "Den Haag", "Haarlem", "Enschede"]}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-xl lg:text-2xl text-white/90 mt-6 mb-0 max-w-2xl mx-auto drop-shadow-md font-medium"
                    >
                        {t.subtitle || "From intimate gatherings to grand celebrations, we bring restaurant-quality cuisine to your event."}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="w-full flex justify-center mt-12"
                >
                    <Link
                        href={bookingLink}
                        target={bookingLink.startsWith('http') ? "_blank" : "_self"}
                        onClick={() => trackCTAClick("Request Quote", "hero_section")}
                        className="bg-orange/90 hover:bg-orange text-white px-8 py-3.5 md:px-12 md:py-5 rounded-full font-bold text-base md:text-lg uppercase tracking-wider backdrop-blur-sm border-2 border-white/20 shadow-2xl hover:shadow-orange/40 hover:-translate-y-1 transition-all duration-300"
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
