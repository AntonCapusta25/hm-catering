'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Occasion } from '@/lib/data';

interface OccasionCardProps {
    occasion: Occasion;
}

export default function OccasionCard({ occasion }: OccasionCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 0.98 }}
            className="relative h-full w-full rounded-2xl overflow-hidden group cursor-pointer bg-white"
        >
            <Image
                src={occasion.image}
                alt={occasion.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 text-white">
                <span className="uppercase tracking-[0.2em] text-xs font-semibold opacity-90 mb-2 block">
                    {occasion.subtitle}
                </span>
                <h3 className="text-3xl font-heading font-bold mb-4">
                    {occasion.title}
                </h3>
                <span className="text-sm font-semibold border-b border-white/50 pb-1 hover:text-orange hover:border-orange transition-colors">
                    Explore Menu &rarr;
                </span>
            </div>
        </motion.div>
    );
}
