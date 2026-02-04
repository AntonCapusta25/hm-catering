"use client";

import { motion } from "framer-motion";
import { Check, Star, Users, Clock, Utensils, Wine, Phone, Camera } from "lucide-react";
import Link from "next/link";

const packages = [
    {
        name: "Starter Team Dinner",
        price: "€40",
        priceUnit: "per person",
        groupSize: "15-30 people",
        duration: "2.5-3 hours",
        badge: null,
        description: "Budget-conscious teams, first events",
        features: [
            { icon: Utensils, text: "2-course menu" },
            { icon: Check, text: "Non-alcoholic beverages" },
            { icon: Check, text: "Table setup & cleanup" },
            { icon: Check, text: "1 dietary accommodation" }
        ],
        highlight: false
    },
    {
        name: "Growth Team Dinner",
        price: "€50",
        priceUnit: "per person",
        groupSize: "20-50 people",
        duration: "3-3.5 hours",
        badge: "Most Popular",
        description: "Perfect balance of quality and value",
        features: [
            { icon: Utensils, text: "3-course menu" },
            { icon: Wine, text: "Alcoholic beverages (wine/beer)" },
            { icon: Check, text: "Premium table setup" },
            { icon: Check, text: "Unlimited dietary accommodations" },
            { icon: Phone, text: "Pre-event consultation (30 min)" },
            { icon: Check, text: "Custom menu adjustments" },
            { icon: Check, text: "5+ menu options" }
        ],
        highlight: true
    },
    {
        name: "Premium Team Celebration",
        price: "€65",
        priceUnit: "per person",
        groupSize: "30-100 people",
        duration: "3.5-4 hours",
        badge: null,
        description: "Ultimate experience for special occasions",
        features: [
            { icon: Utensils, text: "4-course menu" },
            { icon: Wine, text: "Premium beverage package" },
            { icon: Check, text: "Custom linens & premium setup" },
            { icon: Check, text: "Full culinary customization" },
            { icon: Phone, text: "1-hour planning call" },
            { icon: Check, text: "Post-event feedback" },
            { icon: Users, text: "Event coordinator/assistant" },
            { icon: Camera, text: "Optional professional photos" }
        ],
        highlight: false
    }
];

export default function PackageTiers() {
    return (
        <section id="packages" className="relative py-32 bg-dark overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#F27D42]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-5 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-cream mb-6">
                        Team Dinner Packages
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Transparent pricing, exceptional value. All packages include professional service and cleanup.
                    </p>
                </motion.div>

                {/* Package Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className={`relative ${pkg.highlight ? 'lg:-mt-4 lg:mb-4' : ''}`}
                        >
                            {/* Most Popular Badge */}
                            {pkg.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <div className="px-6 py-2 bg-gradient-to-r from-[#F27D42] to-[#FF9F6D] text-white text-sm font-bold rounded-full shadow-lg">
                                        ⭐ {pkg.badge}
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            <div className={`relative h-full rounded-3xl overflow-hidden ${pkg.highlight
                                ? 'bg-gradient-to-b from-[#F27D42]/20 to-[#F27D42]/5 border-2 border-[#F27D42]/50'
                                : 'bg-white/5 border border-white/10'
                                }`}>
                                <div className="p-8">
                                    {/* Package Name */}
                                    <h3 className="text-2xl font-heading font-bold text-cream mb-2">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        {pkg.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-cream">{pkg.price}</span>
                                            <span className="text-gray-400">{pkg.priceUnit}</span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 mb-8 pb-8 border-b border-white/10">
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <span className="text-[#F27D42] font-medium">Group:</span>
                                            <span>{pkg.groupSize}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <span className="text-[#F27D42] font-medium">Time:</span>
                                            <span>{pkg.duration}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-8">
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F27D42] flex-shrink-0" />
                                                <span className="text-gray-300 text-sm leading-relaxed">
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href="#booking"
                                        className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${pkg.highlight
                                            ? 'bg-[#F27D42] text-white hover:bg-[#d66a35] shadow-lg hover:shadow-xl'
                                            : 'bg-white/10 text-cream hover:bg-white/20 border border-white/20'
                                            }`}
                                    >
                                        Choose this package
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center text-gray-400 text-sm mt-12"
                >
                    All prices exclude VAT. Final quote provided after consultation. Minimum group sizes apply.
                </motion.p>
            </div>
        </section>
    );
}
