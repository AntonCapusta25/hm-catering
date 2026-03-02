"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { useState, useRef, useEffect } from "react";
import { setCookie } from "../i18n/actions";
import { Locale } from "../i18n/config";

const languages: { code: Locale; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export default function LanguageSwitcher() {
    const { lang: currentLang } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage =
        languages.find((l) => l.code === currentLang) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = async (newLang: Locale) => {
        await setCookie("NEXT_LOCALE", newLang);
        const parts = pathname.split("/");
        if (parts.length > 1) {
            parts[1] = newLang;
            router.push(parts.join("/"));
        }
        router.refresh();
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left z-50" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex w-full justify-between items-center gap-2 rounded-md bg-transparent px-3 py-2 text-sm font-medium text-dark hover:bg-black/5 focus:outline-none transition-colors"
            >
                <span>{selectedLanguage.flag}</span>
                <span className="hidden md:inline">{selectedLanguage.name}</span>
                <svg
                    className="-mr-1 h-4 w-4 text-dark/60"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => handleLanguageChange(l.code)}
                                className={`
                  ${l.code === currentLang
                                        ? "bg-dark/5 text-brand"
                                        : "text-dark hover:bg-dark/5"
                                    } 
                  group flex w-full items-center px-4 py-2 text-sm transition-colors text-left
                `}
                                role="menuitem"
                            >
                                <span className="mr-3 text-base">{l.flag}</span>
                                {l.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
