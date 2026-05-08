"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterHeadlineProps {
    phrases: string[];
    interval?: number;
    className?: string;
    speed?: number;
}

export default function TypewriterHeadline({ 
    phrases, 
    interval = 5000, 
    className = "",
    speed = 0.05 
}: TypewriterHeadlineProps) {
    const [index, setIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const currentPhrase = phrases[index];

        if (isDeleting) {
            // Deleting text
            timeout = setTimeout(() => {
                setCurrentText(prev => prev.slice(0, -1));
            }, speed * 500);

            if (currentText === "") {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % phrases.length);
            }
        } else {
            // Typing text
            timeout = setTimeout(() => {
                setCurrentText(currentPhrase.slice(0, currentText.length + 1));
            }, speed * 1000);

            if (currentText === currentPhrase) {
                // Pause at the end
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, interval);
            }
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, index, phrases, speed, interval]);

    return (
        <div className={`min-h-[1.5em] flex items-center justify-center ${className}`}>
            <span className="text-white">
                {currentText}
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-[2px] h-[0.9em] ml-1 bg-[#F27D42] align-middle"
                />
            </span>
        </div>
    );
}
