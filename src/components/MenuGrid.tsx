"use client";

"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { menus } from "@/lib/data";
import MenuCard from "./ui/MenuCard";

export default function MenuGrid() {
    return (
        <section id="menu-boxes" className="py-24 bg-transparent relative z-20 -mt-32">
            <div className="container mx-auto px-5 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-5">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                            Menu Boxes
                        </h2>
                        <p className="text-light max-w-md">
                            Discover our curated Christmas menus from top chefs. Click a card to view full details.
                        </p>
                        <p className="mt-4 text-orange font-heading text-xl md:text-2xl font-bold tracking-wide">
                            Customization
                        </p>
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

            <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                    prevEl: ".menu-prev",
                    nextEl: ".menu-next",
                }}
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={false}
                loop={true}
                breakpoints={{
                    640: { slidesPerView: 2.2, spaceBetween: 30 },
                    1024: { slidesPerView: 3.2, spaceBetween: 40 },
                    1280: { slidesPerView: 3.5, spaceBetween: 50 },
                }}
                className="w-full !pb-12 !pl-5 md:!pl-[max(8vw,2rem)] xl:!pl-[max(15vw,2rem)]"
            >
                {menus.map((menu, index) => (
                    <SwiperSlide key={menu.id}>
                        <Link href={`/menus/${menu.id}`} className="block h-full">
                            <MenuCard menu={menu} index={index} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section >
    );
}
