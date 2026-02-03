"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { trackCTAClick } from "@/lib/analytics";

const HERO_IMAGES = [
    "/images/hero-catering-new.png",
    "/images/hero-bg.jpg",
    "/images/Hero images/c0957052-7adc-456c-a804-d00325e75ac0 (1).png",
    "/images/Hero images/menu-south-indian.png"
];

export default function Hero() {
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
        <header className="relative h-screen w-full flex items-center justify-center overflow-hidden text-white bg-black">
            {/* Background Slideshow */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-full z-0"
                    style={{
                        backgroundImage: `url('${HERO_IMAGES[currentImageIndex]}')`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            </AnimatePresence>

            {/* Permanent Overlay to ensure text readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream to-transparent z-0" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl px-5">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="inline-block mb-4 px-6 py-2 rounded-full border border-orange/50 bg-white/10 backdrop-blur-md shadow-lg"
                >
                    <span className="text-orange font-bold tracking-wide uppercase text-sm md:text-base">
                        ✨ Elevate Your Event with Gourmet Catering
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6 drop-shadow-lg"
                >
                    Exceptional Catering
                    <br />
                    for Every <span className="text-orange italic font-serif">Occasion</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md"
                >
                    From intimate gatherings to grand celebrations, we bring restaurant-quality cuisine to your event.
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
                        Request Quote
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[26px] h-[40px] border-2 border-white rounded-full flex justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </header>
    );
}
