"use client";

import { useState, useEffect } from 'react';
import styles from './AnimatedHeroHeadline.module.css';

interface AnimatedHeroHeadlineProps {
    staticText: string;
    words: string[];
}

/**
 * ✏️ EDIT THIS LIST in the i18n dictionaries (en.json, nl.json)
 * to change rotating words or the static part of the headline.
 */
export default function AnimatedHeroHeadline({ staticText, words }: AnimatedHeroHeadlineProps) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!words || words.length <= 1) return;

        const interval = setInterval(() => {
            // Fade out and slide up
            setVisible(false);

            setTimeout(() => {
                // Switch word
                setIndex((prev) => (prev + 1) % words.length);
                // Fade in and slide back to center
                setVisible(true);
            }, 400); // Transitions match 400ms duration
        }, 2900); // 2500ms hold + 400ms out

        return () => clearInterval(interval);
    }, [words]);

    return (
        <h1 className={`${styles.heroHeadline} text-6xl md:text-6xl lg:text-7xl drop-shadow-lg leading-tight md:leading-normal`}>
            {staticText}{' '}
            <span
                className={styles.rotatingWord}
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                }}
            >
                {words[index] || ''}
            </span>
        </h1>
    );
}
