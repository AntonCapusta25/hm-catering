"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";

export default function HowItWorks() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.howItWorks || {};

    const steps = [
        {
            number: "01",
            title: t.step1Title || "Choose Your Menu",
            description: t.step1Desc || "Browse our curated catering packages or request custom options.",
            image: "/images/select-menu-47.png",
        },
        {
            number: "02",
            title: t.step2Title || "Confirm Details",
            description: t.step2Desc || "Select your date, guest count, and delivery preferences.",
            image: "/images/step-confirm.jpg",
        },
        {
            number: "03",
            title: t.step3Title || "We Deliver Excellence",
            description: t.step3Desc || "Professional setup, premium service, and seamless cleanup.",
            image: "/images/step-enjoy.png",
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white text-center">
            <div className="container mx-auto px-5">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-16">
                    {t.title || "How it Works"}
                </h2>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-dark/20 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-12 h-12 bg-cream border border-dark/20 rounded-xl flex items-center justify-center font-bold text-dark mb-8 shadow-sm">
                                    {step.number}
                                </div>

                                <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-md">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <h3 className="text-2xl font-heading font-bold text-dark mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-light text-sm max-w-[250px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
