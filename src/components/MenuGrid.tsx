"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { searchRestaurants } from "@/lib/hyperzod";
import type { Restaurant } from "@/lib/hyperzod";
import { useCity } from "@/contexts/CityContext";

const CITIES = [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Enschede",
    "Groningen"
];

export default function MenuGrid() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedCity, setSelectedCity, isDetectingLocation } = useCity();

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                setLoading(true);
                setError(null);

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

    return (
        <section id="menu-boxes" className="py-24 bg-transparent relative z-20 -mt-32">
            <div className="container mx-auto px-5 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-5">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                            Catering Restaurants
                        </h2>
                        <p className="text-light max-w-md mb-6">
                            Explore our diverse restaurant options. Each restaurant can be customized to your needs.
                        </p>

                        {/* City Selector - Improved Design */}
                        <div className="relative inline-block">
                            <label className="block text-sm font-semibold text-dark mb-2">
                                {isDetectingLocation ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-pulse">📍</span> Detecting your location...
                                    </span>
                                ) : (
                                    "📍 Select City"
                                )}
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="appearance-none w-full min-w-[240px] px-5 py-3 pr-12 border-2 border-orange/30 rounded-xl bg-white text-dark font-semibold text-base hover:border-orange focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10 transition-all shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    {CITIES.map((city) => (
                                        <option key={city} value={city} className="font-semibold">
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom Arrow */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-light mt-2">
                                Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} in {selectedCity}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="menu-prev w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors">
                            ←
                        </button>
                        <button className="menu-next w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors">
                            →
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="w-full text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
                    <p className="mt-4 text-light">Loading restaurants from {selectedCity}...</p>
                </div>
            )}

            {error && (
                <div className="w-full text-center py-20">
                    <p className="text-red-600 font-semibold">{error}</p>
                </div>
            )}

            {!loading && !error && restaurants.length === 0 && (
                <div className="w-full text-center py-20">
                    <p className="text-light">No restaurants found in {selectedCity}</p>
                </div>
            )}

            {!loading && !error && restaurants.length > 0 && (
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        prevEl: ".menu-prev",
                        nextEl: ".menu-next",
                    }}
                    spaceBetween={20}
                    slidesPerView={1.2}
                    centeredSlides={false}
                    loop={restaurants.length > 3}
                    breakpoints={{
                        640: { slidesPerView: 2.2, spaceBetween: 30 },
                        1024: { slidesPerView: 3.2, spaceBetween: 40 },
                        1280: { slidesPerView: 3.5, spaceBetween: 50 },
                    }}
                    className="w-full !pb-12 !pl-5 md:!pl-[max(8vw,2rem)] xl:!pl-[max(15vw,2rem)]"
                >
                    {restaurants.map((restaurant) => (
                        <SwiperSlide key={restaurant.id}>
                            <div className="bg-white rounded-[2rem] shadow-xl border border-white/40 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300 group">
                                {/* Cover Image with Logo Overlay */}
                                <div className="relative h-[280px] md:h-[320px] overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Small Logo - Top Left */}
                                    <div className="absolute top-4 left-4 w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                                        <img
                                            src={restaurant.logo || restaurant.image}
                                            alt={`${restaurant.name} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Cuisine Badge - Top Right */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-dark shadow-sm">
                                        {restaurant.cuisine}
                                    </div>

                                    {/* Rating Badge - Bottom Right */}
                                    <div className="absolute bottom-4 right-4 bg-black text-white flex items-center rounded-full text-sm py-2 px-3 shadow-lg">
                                        <svg className="w-4 h-4 fill-current text-yellow-400 mr-1.5" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                                    </div>

                                    {/* Price Range Badge - Bottom Left */}
                                    {restaurant.priceRange && (
                                        <div className="absolute bottom-4 left-4 bg-orange text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg">
                                            {restaurant.priceRange}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Restaurant Name */}
                                    <h3 className="text-2xl font-heading font-bold text-dark mb-2 transition-colors group-hover:text-orange line-clamp-2">
                                        {restaurant.name}
                                    </h3>

                                    {/* Location */}
                                    <p className="text-light text-sm font-medium uppercase tracking-wide mb-4">
                                        📍 {restaurant.address?.split(',')[0] || selectedCity}
                                    </p>

                                    {/* Divider */}
                                    <div className="border-t border-dark/10 pt-4 mt-auto">
                                        {/* Book Now Button */}
                                        <a
                                            href={restaurant.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-orange text-white text-sm font-bold uppercase tracking-wider py-3 rounded-full hover:bg-dark transition-colors text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            Book Now →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
}
