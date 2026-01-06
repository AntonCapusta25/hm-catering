"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { searchRestaurants } from "@/lib/hyperzod";
import type { Restaurant } from "@/lib/hyperzod";
import { useCity } from "@/contexts/CityContext";
import ChefCard from "./ui/ChefCard";

export default function ChefCarousel() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedCity } = useCity();

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                setLoading(true);
                setError(null);

                // Fetch restaurants - you can customize the search params
                const data = await searchRestaurants({
                    city: selectedCity,
                    limit: 100 // Fetch all restaurants
                });

                setRestaurants(data);
            } catch (err) {
                console.error("Failed to fetch restaurants:", err);
                setError("Failed to load restaurants");
            } finally {
                setLoading(false);
            }
        }

        fetchRestaurants();
    }, [selectedCity]);

    // Duplicate for smooth loop
    const carouselItems = restaurants.length > 0
        ? [...restaurants, ...restaurants, ...restaurants]
        : [];

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center bg-cream overflow-hidden py-24">
            <div className="container mx-auto px-5 mb-10 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                    Our <span className="text-orange">Featured</span> Restaurants
                </h2>
                <p className="text-light max-w-xl mx-auto text-lg">
                    Discover amazing home chefs and restaurants ready to cater your next event.
                </p>
            </div>

            {loading && (
                <div className="w-full text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                    <p className="mt-4 text-light">Loading restaurants...</p>
                </div>
            )}

            {error && (
                <div className="w-full text-center py-20">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {!loading && !error && carouselItems.length > 0 && (
                <div className="w-full">
                    <Swiper
                        effect={"coverflow"}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={"auto"}
                        spaceBetween={50}
                        loop={true}
                        speed={800}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        coverflowEffect={{
                            rotate: -10,
                            stretch: -12,
                            depth: 150,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        modules={[EffectCoverflow, Autoplay]}
                        className="w-full py-10"
                    >
                        {carouselItems.map((restaurant, index) => (
                            <SwiperSlide
                                key={`${restaurant.id}-${index}`}
                                className="!w-[300px] md:!w-[400px] !h-[500px] md:!h-[550px] relative transition-all duration-500 group"
                            >
                                <ChefCard restaurant={restaurant} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {!loading && !error && restaurants.length === 0 && (
                <div className="w-full text-center py-20">
                    <p className="text-light">No restaurants found.</p>
                </div>
            )}

            {/* CSS adjustments */}
            <style jsx global>{`
                .swiper-slide {
                    transition: all 0.5s ease;
                    filter: brightness(0.8);
                }
                .swiper-slide-active {
                    filter: brightness(1);
                    z-index: 10;
                    transform: scale(1.05);
                }
            `}</style>
        </section>
    );
}
