"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { usePathname } from 'next/navigation';

const testimonialConfig = [
    { author: "Carlos Alberto", rating: 5 },
    { author: "Filip", rating: 5 },
    { author: "Syrine", rating: 5 },
    { author: "M.A. Van Der Waal", rating: 5 },
    { author: "Syukri Ainun Alfatg", rating: 5 },
    { author: "Robert", rating: 5 },
    { author: "Sibbir", rating: 5 }
];

const fallbackItems = [
    {
        company: "Birthday Celebration",
        eventType: "Custom Tiramisu Order",
        quote: "Ordered Tiramisú for my Bday instead of the regular Bday cake!!! What to say... Best choice ever!!! All my friends loved it and Domenico fulfilled my order with only 48 hours to go before my party! Ordered 3 trays and we finished all of it!! Thanks Dome, I knew I could count on you!"
    },
    {
        company: "Private Dinner",
        eventType: "Steak & Empanadas",
        quote: "The food was amazing, steak was cooked perfectly with tasty chimichurri, and the empanada was exactly how authentic empanadas should taste!"
    },
    {
        company: "Special Occasion",
        eventType: "Italian Dessert Catering",
        quote: "This is by far one of the best Tiramisu I have tasted! It somehow melts inside the mouth! Super Good!!"
    },
    {
        company: "Family Gathering",
        eventType: "Private Chef Service",
        quote: "Delicious!! Approved by my tiramisu loved boyfriend. He said it's the best he's ever had!"
    },
    {
        company: "Direct Order",
        eventType: "Recurring Client",
        quote: "I ordered from Bottega da Dome a few times and they have hands down the best tiramisu! Will keep ordering from them again :)"
    },
    {
        company: "Catering",
        eventType: "Event Catering",
        quote: "Delicious tiramisu! We all loved it. Very well made and Domenico is a very friendly chef. Will order again!"
    },
    {
        company: "Dinner Party",
        eventType: "Authentic Biryani",
        quote: "The biryani was very hearty and tasty! Good portion with chicken and potatoes. Definitely will order again."
    }
];

const metricConfig = [
    { value: "500+", key: "happyClients", color: "text-[#F27D42]" },
    { value: "4.8/5", key: "averageRating", color: "text-yellow-500" },
    { value: "40%", key: "savings", color: "text-green-500" },
    { value: "100%", key: "guarantee", color: "text-[#F27D42]" }
];

export default function Testimonials() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.testimonials || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    return (
        <section className="relative py-14 md:py-32 bg-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F27D42]/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-5 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        {t.title || "What Our Customers Say"}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t.subtitle || "Real experiences from clients who've enjoyed our private chef services."}
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
                    {metricConfig.map((metric, index) => (
                        <motion.div
                            key={metric.key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                            <div className={`text-4xl md:text-5xl font-heading font-bold mb-2 ${metric.color}`}>
                                {metric.value}
                            </div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                {t.metrics?.[metric.key] || metric.key}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {testimonialConfig.map((config, index) => {
                        const item = t.items?.[index] || fallbackItems[index];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col"
                            >
                                {/* Quote Icon */}
                                <div className="text-6xl text-orange/20 font-heading leading-none mb-2">“</div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(config.rating)].map((_, i) => (
                                        <Star key={i} className="text-[#F27D42]" size={16} fill="currentColor" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-dark text-lg font-medium leading-relaxed mb-6 flex-grow">
                                    "{item.quote}"
                                </p>

                                {/* Company & Event Type */}
                                <div className="mb-4">
                                    <h4 className="font-heading font-bold text-dark text-sm uppercase tracking-wide">
                                        {item.company}
                                    </h4>
                                    <p className="text-xs text-gray-500">{item.eventType}</p>
                                </div>

                                {/* Attribution */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-bold text-sm">
                                            {config.author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-dark">{config.author}</div>
                                        <div className="text-sm text-gray-500">{t.verifiedClient || "Verified Client"}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-600 mb-4 text-lg">
                        {t.joinText || "Join hundreds of satisfied clients"}
                    </p>
                    <a
                        href={`/${lang}/quote`}
                        className="inline-block px-8 py-4 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors shadow-lg hover:shadow-xl"
                    >
                        {t.bookButton || "Book Your Team Dinner"}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
