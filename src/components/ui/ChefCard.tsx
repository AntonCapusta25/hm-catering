'use client';

import Image from 'next/image';
import { Chef } from '@/lib/data';

interface ChefCardProps {
    chef: Chef;
}

export default function ChefCard({ chef }: ChefCardProps) {
    return (
        <div className="w-full h-full rounded-[20px] overflow-hidden relative bg-black shadow-lg">
            <Image
                src={chef.image}
                alt={chef.name}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 300px, 400px"
            />

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8 text-center">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">{chef.name}</h3>
                <p className="text-white/80 text-sm font-medium">{chef.description}</p>
            </div>
        </div>
    );
}
