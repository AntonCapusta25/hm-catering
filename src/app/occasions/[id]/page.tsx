"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { occasions } from "@/lib/data";

export default function OccasionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params
    const resolvedParams = use(params);
    const occasion = occasions.find((o) => o.id === resolvedParams.id);

    if (!occasion) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Link
                href="/#occasions"
                className="fixed top-6 left-6 z-50 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white hover:text-dark transition-all flex items-center gap-2 shadow-lg"
            >
                &larr; All Occasions
            </Link>

            {/* Immersive Header */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                <Image
                    src={occasion.image}
                    alt={occasion.title}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-5">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "0.2em" }}
                        transition={{ duration: 1 }}
                        className="uppercase font-bold text-sm md:text-base mb-6"
                    >
                        {occasion.subtitle}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-heading font-bold mb-8"
                    >
                        {occasion.title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link
                            href="/#booking"
                            className="bg-orange text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-orange transition-all shadow-xl hover:shadow-2xl"
                        >
                            Start Planning
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 container mx-auto px-5 max-w-4xl text-center">
                <h2 className="text-3xl font-heading font-bold text-dark mb-8">
                    Experience The Vibe
                </h2>
                <p className="text-xl md:text-2xl text-light leading-relaxed mb-16">
                    {occasion.description}
                </p>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {occasion.features.map((feature, i) => (
                        <div key={i} className="bg-cream p-8 rounded-3xl">
                            <span className="text-4xl mb-4 block text-orange">✦</span>
                            <h3 className="font-bold text-lg text-dark">{feature}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
