"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [bookingLink, setBookingLink] = useState("#booking");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

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
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("storage", updateLink); // Listen for admin changes

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("storage", updateLink);
        };
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[1100px] z-50 rounded-full px-8 py-4 flex justify-between items-center transition-all duration-300 border border-white/20 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-lg"
                : "bg-white/90 backdrop-blur-sm shadow-sm"
                }`}
        >
            <Link href="/" className="flex items-center gap-2">
                {/* Placeholder Logo or Text if image missing */}
                <div className="relative w-32 h-12">
                    <img
                        src="/images/logo-homemade.png"
                        alt="HomeMade Logo"
                        className="object-contain w-full h-full"
                    />
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-light font-medium text-sm tracking-wide">
                <Link href="#how-it-works" className="hover:text-orange transition-colors">
                    How it Works
                </Link>
                <Link href="#menu-boxes" className="hover:text-orange transition-colors">
                    Menus
                </Link>
                <Link href="#occasions" className="hover:text-orange transition-colors">
                    Occasions
                </Link>
            </div>

            <Link
                href={bookingLink}
                target={bookingLink.startsWith('http') ? "_blank" : "_self"}
                className="bg-orange hover:bg-orange/90 text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
                Book Now
            </Link>
        </motion.nav>
    );
}
