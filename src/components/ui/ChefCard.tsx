'use client';

import Image from 'next/image';
import { Restaurant } from '@/lib/hyperzod';

interface ChefCardProps {
    restaurant: Restaurant;
}

export default function ChefCard({ restaurant }: ChefCardProps) {
    return (
        <a
            href={restaurant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full rounded-[20px] overflow-hidden relative bg-black shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                sizes="(max-width: 768px) 300px, 400px"
            />

            {/* Price Range Badge */}
            <div className="absolute top-4 right-4 bg-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                {restaurant.priceRange}
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-center">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">{restaurant.name}</h3>
                <p className="text-white/80 text-sm font-medium mb-2">{restaurant.cuisine}</p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 text-yellow-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-white text-sm font-semibold">{restaurant.rating.toFixed(1)}</span>
                </div>
            </div>
        </a>
    );
}
