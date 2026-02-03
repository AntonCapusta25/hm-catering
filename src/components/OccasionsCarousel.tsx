"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { occasions } from "@/lib/data";
import OccasionCard from "./ui/OccasionCard";
import { trackOccasionView } from "@/lib/analytics";

export default function OccasionsCarousel() {
    return (
        <section id="occasions" className="py-24 bg-white relative">
            <div className="container mx-auto px-5 mb-10 flex justify-between items-end">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark">
                    Occasions
                </h2>
                <div className="flex gap-4">
                    <button className="custom-prev w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors">
                        ←
                    </button>
                    <button className="custom-next w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition-colors">
                        →
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                }}
                spaceBetween={20}
                slidesPerView={1.1}
                centeredSlides={false}
                loop={true}
                breakpoints={{
                    640: { slidesPerView: 2.1, spaceBetween: 20 },
                    1024: { slidesPerView: 3.1, spaceBetween: 30 },
                    1280: { slidesPerView: 3.5, spaceBetween: 30 },
                }}
                className="w-full h-[600px] !pl-5 md:!pl-[max(8vw,2rem)] xl:!pl-[max(15vw,2rem)]"
            >
                {occasions.map((occasion) => (
                    <SwiperSlide key={occasion.id} className="h-full">
                        <Link
                            href={`/occasions/${occasion.id}`}
                            onClick={() => trackOccasionView(occasion.title)}
                            className="block h-full"
                        >
                            <OccasionCard occasion={occasion} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
