'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu } from '@/lib/data';

interface MenuCardProps {
    menu: Menu;
    index?: number;
    priority?: boolean;
}

export default function MenuCard({ menu, index = 0, priority = false }: MenuCardProps) {
    const isSoldOut = menu.soldOut;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className={`
                group h-full flex flex-col bg-white p-4 rounded-[2rem] shadow-xl border border-white/40
                transition-all duration-300 relative
                ${isSoldOut ? 'opacity-80 grayscale-[0.8] cursor-not-allowed hover:shadow-none bg-gray-50' : 'cursor-pointer hover:shadow-2xl'}
            `}
        >
            <div className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden mb-6 bg-gray-200">
                <Image
                    src={menu.image}
                    alt={menu.title}
                    fill
                    priority={priority}
                    className={`object-cover transition-transform duration-500 ${isSoldOut ? '' : 'group-hover:scale-105'}`}
                />

                {!isSoldOut && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-dark shadow-sm">
                        {menu.badge}
                    </div>
                )}

                {/* Creative Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                        <div className="-rotate-12 border-4 border-red-600 px-4 py-2 rounded-xl bg-white/90 shadow-lg animate-pulse backdrop-blur-sm">
                            <span className="block text-xl md:text-2xl font-black text-red-600 uppercase tracking-widest text-center leading-tight font-heading">
                                Sorry!<br />
                                <span className="text-sm text-red-500 font-bold tracking-normal">Sold Out Spots</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <h3 className={`text-2xl font-heading font-bold text-dark mb-1 transition-colors ${isSoldOut ? 'text-gray-500' : 'group-hover:text-orange'}`}>
                {menu.title}
            </h3>
            <p className="text-light text-sm font-medium uppercase tracking-wide mb-4">
                {menu.chef}
            </p>

            <div className="flex justify-between items-center border-t border-dark/10 pt-4 mt-auto">
                <span className={`font-bold text-dark text-lg ${isSoldOut ? 'line-through text-gray-400' : ''}`}>
                    {menu.price}
                </span>

                {!isSoldOut ? (
                    <span className="text-orange font-semibold text-sm uppercase tracking-wide group-hover:underline decoration-2 underline-offset-4">
                        View Details &rarr;
                    </span>
                ) : (
                    <span className="text-gray-400 font-semibold text-xs uppercase tracking-wide">
                        Fully Booked
                    </span>
                )}
            </div>
        </motion.div>
    );
}
