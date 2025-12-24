"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { doodleStories } from "@/lib/data";
import StoryCard from "./ui/StoryCard";

export default function ChefCarousel() {
    // Duplicate logic for smooth loop
    const carouselItems = [...doodleStories, ...doodleStories, ...doodleStories];

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center bg-cream overflow-hidden py-24">
            <div className="container mx-auto px-5 mb-10 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                    The <span className="text-orange">HomeMade</span> Difference
                </h2>
                <p className="text-light max-w-xl mx-auto text-lg">
                    We don't just cater events—we create unforgettable culinary experiences.
                </p>
            </div>

            <div className="w-full">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    spaceBetween={50}
                    loop={true}
                    speed={800} // Smooth transition speed
                    autoplay={{
                        delay: 3500, // Slightly slower for reading stories
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: -10, // Adjusted rotation
                        stretch: -12, // Optimized separation
                        depth: 150, // Deep perspective to shrink sides
                        modifier: 1, // Standard modifier
                        slideShadows: false, // Cleaner look without defaults
                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="w-full py-10"
                >
                    {carouselItems.map((story, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[300px] md:!w-[400px] !h-[500px] md:!h-[550px] relative transition-all duration-500 group"
                        >
                            <StoryCard story={story} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* CSS adjustments to force the 'Active' slide to be fully opaque and others dimmed if needed */}
            <style jsx global>{`
        .swiper-slide {
           transition: all 0.5s ease;
           filter: brightness(0.8); /* make side cards darker/dimmed */
        }
        .swiper-slide-active {
           filter: brightness(1); /* Active card pops */
           z-index: 10;
           transform: scale(1.05);
        }
      `}</style>
        </section>
    );
}
