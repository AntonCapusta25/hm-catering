'use client';

import Image from 'next/image';
import { DoodleStory } from '@/lib/data';

interface StoryCardProps {
    story: DoodleStory;
}

export default function StoryCard({ story }: StoryCardProps) {
    const imageSrc = story.image || '/images/placeholder.png';

    return (
        <div className={`
            group relative w-full h-full rounded-[30px] overflow-hidden 
            ${story.bgColor} 
            transition-all duration-500 ease-out
        `}>
            {/* Background Pattern or Texture (Optional, adds a "creative" touch) */}
            <div className="absolute inset-0 opacity-10 bg-[url('/images/noise.png')] mix-blend-overlay pointer-events-none"></div>

            {/* Main Image Container - Centered and Large */}
            <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-12">
                <div className="relative w-full h-[60%] drop-shadow-xl">
                    <Image
                        src={imageSrc}
                        alt={story.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 300px, 400px"
                    />
                </div>
            </div>

            {/* Content Overlay - Slides up on Hover */}
            <div className="absolute inset-0 flex flex-col justify-end">
                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Initial State: Just Title (or minimalistic) */}
                <div className="absolute bottom-10 left-0 w-full text-center px-6 transition-all duration-500 group-hover:bottom-1/3 group-hover:opacity-0">
                    <h3 className="font-heading font-extrabold text-3xl text-gray-800/90">{story.title}</h3>
                </div>

                {/* Hover State: Full info with glassmorphism */}
                <div className="
                    relative w-full p-8 
                    translate-y-full group-hover:translate-y-0 
                    transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
                    bg-white/10 backdrop-blur-md border-t border-white/20
                    flex flex-col gap-3 text-left
                ">
                    <h3 className="font-heading font-bold text-2xl text-white drop-shadow-md">
                        {story.title}
                    </h3>
                    <p className="text-white/90 text-sm font-medium leading-relaxed font-sans drop-shadow-sm">
                        {story.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
