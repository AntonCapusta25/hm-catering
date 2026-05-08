"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterHeadlineProps {
    prefix?: string;
    subPrefix?: string;
    phrases: string[];
    interval?: number;
    className?: string;
    speed?: number;
    onCycleComplete?: () => void;
}

export default function TypewriterHeadline({ 
    prefix = "",
    subPrefix = "At Your ",
    phrases, 
    interval = 3000, 
    className = "",
    speed = 0.05,
    onCycleComplete
}: TypewriterHeadlineProps) {
    const [index, setIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const currentPhrase = phrases[index];
        const nextIndex = (index + 1) % phrases.length;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setCurrentText(prev => prev.slice(0, -1));
            }, speed * 1200);

            if (currentText === "") {
                setIsDeleting(false);
                if (index === phrases.length - 1 && onCycleComplete) {
                    onCycleComplete();
                }
                setIndex(nextIndex);
            }
        } else {
            timeout = setTimeout(() => {
                setCurrentText(currentPhrase.slice(0, currentText.length + 1));
            }, speed * 2500);

            if (currentText === currentPhrase) {
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, interval);
            }
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, index, phrases, speed, interval]);

    return (
        <div className={`w-full flex flex-col items-center justify-center text-center ${className}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={prefix}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="text-white mb-2 md:mb-0 md:mr-4"
                >
                    {prefix}
                </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center whitespace-nowrap">
                <span className="text-white">{subPrefix}</span>
                <div className="inline-flex items-center text-white ml-2">
                    <span>{currentText}</span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block w-[2px] h-[0.8em] ml-1 bg-white align-middle"
                    />
                </div>
            </div>
        </div>
    );
}
