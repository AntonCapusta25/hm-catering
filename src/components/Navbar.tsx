"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [bookingLink, setBookingLink] = useState("#booking");

    // Fallbacks incase dictionary misses keys
    const i18n = useI18n();
    const t = i18n?.dictionary?.navigation || {
        howItWorks: "How it Works",
        menu: "Menus",
        occasions: "Occasions",
        bookNow: "Book Now"
    };

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
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[1000px] z-50 rounded-full px-6 py-2.5 flex justify-between items-center transition-all duration-300 border border-white/20 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-lg"
                : "bg-white/90 backdrop-blur-sm shadow-sm"
                }`}
        >
            <div className="flex-1 flex justify-start">
                <Link href="/" className="flex items-center gap-2">
                    {/* Logo */}
                    <div className="h-9 w-auto">
                        <img
                            src="/images/logo-new.png"
                            alt="Homemade Logo"
                            className="h-full w-auto object-contain rounded-md"
                        />
                    </div>
                </Link>
            </div>

            <div className="hidden md:flex flex-none justify-center items-center gap-8 text-light font-medium text-sm tracking-wide">
                <Link href="#how-it-works" className="hover:text-orange transition-colors">
                    {t.howItWorks || "How it Works"}
                </Link>
                <Link href="#menu-boxes" className="hover:text-orange transition-colors">
                    {t.menu || "Menus"}
                </Link>
                <Link href="#occasions" className="hover:text-orange transition-colors">
                    {(t as any).occasions || "Occasions"}
                </Link>
                <Link href={`/${i18n.lang || 'en'}/blog`} className="hover:text-orange transition-colors">
                    {(t as any).blog || "Blog"}
                </Link>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
                <LanguageSwitcher />

                <Link
                    href={bookingLink}
                    target={bookingLink.startsWith('http') ? "_blank" : "_self"}
                    className="bg-orange hover:bg-orange/90 text-white px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                    {t.bookNow || "Book Now"}
                </Link>
            </div>
        </motion.nav>
    );
}
