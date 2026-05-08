"use client";

import { useState, useEffect } from 'react';
import styles from './AnimatedHeroHeadline.module.css';

export interface HeadlineSegment {
    type: 'static' | 'rotating';
    text?: string;
    words?: string[];
    color?: string;
}

interface AnimatedHeroHeadlineProps {
    segments?: HeadlineSegment[];
    intervalDuration?: number;
    className?: string;
}

export default function AnimatedHeroHeadline({ segments = [], intervalDuration = 2900, className = "" }: AnimatedHeroHeadlineProps) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    // Find max length among all rotating segments to ensure we don't jump around if they have different lengths
    const maxLen = segments.reduce((max, seg) => {
        if (seg.type === 'rotating' && seg.words) {
            return Math.max(max, seg.words.length);
        }
        return max;
    }, 0);

    useEffect(() => {
        if (maxLen <= 1) return;

        const interval = setInterval(() => {
            // Fade out and slide up
            setVisible(false);

            setTimeout(() => {
                // Switch word
                setIndex((prev) => (prev + 1));
                // Fade in and slide back to center
                setVisible(true);
            }, 400); // Transitions match 400ms duration
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [maxLen, intervalDuration]);

    if (!segments || segments.length === 0) return null;

    return (
        <h1 className={`${styles.heroHeadline} ${className || "text-4xl md:text-5xl lg:text-7xl"} drop-shadow-lg leading-tight md:leading-normal font-bold flex flex-wrap justify-center items-center gap-x-2 gap-y-1`}>
            {segments.map((seg, i) => {
                const colorClass = seg.color || "text-white";

                if (seg.type === 'static' && seg.text) {
                    return <span key={i} className={`${colorClass} whitespace-pre-wrap`}>{seg.text}</span>;
                }
                
                if (seg.type === 'rotating' && seg.words && seg.words.length > 0) {
                    const word = seg.words[index % seg.words.length];
                    return (
                        <span
                            key={i}
                            className={`${styles.rotatingWord} ${colorClass}`}
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                                display: 'inline-block'
                            }}
                        >
                            {word}
                        </span>
                    );
                }
                
                return null;
            })}
        </h1>
    );
}
