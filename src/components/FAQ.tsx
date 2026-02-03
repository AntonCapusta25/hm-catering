"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What's included in each package?",
        answer: "Each package includes professional chef service, all ingredients, table setup, and cleanup. The Starter package includes a 2-course menu and non-alcoholic beverages. Growth adds a 3-course menu, alcoholic beverages, and pre-event consultation. Premium features a 4-course menu, premium beverages, event coordinator, and optional professional photos."
    },
    {
        question: "Can we customize the menu?",
        answer: "Absolutely! All packages allow menu customization. The Starter package offers standard adjustments, while Growth and Premium packages provide extensive customization options. We work with you to create a menu that matches your preferences, dietary needs, and event theme."
    },
    {
        question: "What about dietary restrictions?",
        answer: "We accommodate all dietary restrictions and preferences. The Starter package includes 1 dietary accommodation, while Growth and Premium packages offer unlimited accommodations. We handle vegetarian, vegan, gluten-free, halal, kosher, and all allergy-related requirements."
    },
    {
        question: "How many people can we accommodate?",
        answer: "Our packages serve different group sizes: Starter (15-30 people), Growth (20-50 people), and Premium (30-100 people). For groups outside these ranges, contact us for a custom quote. We can scale our service to match your needs."
    },
    {
        question: "Can we choose our preferred date and time?",
        answer: "Yes! We work around your schedule. During booking, you'll select your preferred date and time. We recommend booking at least 2-3 weeks in advance for best availability, though we can sometimes accommodate shorter notice for smaller events."
    },
    {
        question: "Is alcohol included?",
        answer: "Alcohol is included in the Growth (wine/beer) and Premium (full beverage package) tiers. The Starter package includes non-alcoholic beverages only. You can upgrade any package to include alcoholic beverages for an additional fee."
    },
    {
        question: "What if our headcount changes?",
        answer: "We understand headcounts can fluctuate. You can adjust your guest count up to 5 days before the event without penalty. Changes within 5 days may incur additional fees. We'll work with you to ensure we're prepared for your final number."
    },
    {
        question: "How far in advance should we book?",
        answer: "We recommend booking 2-4 weeks in advance to ensure availability and allow time for menu planning. For large events (50+ people) or during peak seasons, 4-6 weeks is ideal. Rush bookings may be possible—contact us to check availability."
    },
    {
        question: "What's your cancellation policy?",
        answer: "Cancellations made 14+ days before the event receive a full refund. Cancellations 7-13 days prior receive a 50% refund. Cancellations within 7 days are non-refundable, though we can reschedule based on availability. Weather-related cancellations are handled case-by-case."
    },
    {
        question: "Can we add wine pairing to our menu?",
        answer: "Yes! Wine pairing is included in the Premium package and available as an add-on for Starter and Growth packages. Our sommelier will select wines that complement each course. Pricing varies based on wine selection and guest count."
    },
    {
        question: "Do you work with our existing venue?",
        answer: "We can cater at most venues including offices, private homes, event spaces, and outdoor locations. We'll need basic kitchen access (or can bring portable equipment) and space for setup. During consultation, we'll discuss your venue's specific requirements."
    },
    {
        question: "Can we see photos from past events?",
        answer: "Absolutely! We have a portfolio of past events showcasing our food presentation, table setups, and happy clients. Contact us or check our social media for recent event photos. We're proud to share our work!"
    },
    {
        question: "How do you handle dietary restrictions?",
        answer: "We take dietary restrictions very seriously. During booking, you'll specify all dietary needs. Our chefs prepare separate dishes or modify recipes to ensure everyone enjoys the meal safely. We're experienced with allergies, religious requirements, and lifestyle preferences."
    },
    {
        question: "What's the lead time for booking?",
        answer: "Minimum lead time is typically 1 week for small events (under 20 people) and 2 weeks for larger groups. However, we've accommodated last-minute requests when possible. Contact us immediately if you have an urgent need—we'll do our best to help."
    },
    {
        question: "Do you offer team building activities?",
        answer: "While our focus is exceptional catering, we can coordinate with team building partners for activities like cooking classes, wine tastings, or interactive dining experiences. Let us know your interests during consultation, and we'll help create a complete event experience."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative py-24 bg-gradient-to-b from-white to-cream overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#F27D42]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-5 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-[#F27D42] text-sm font-medium mb-6">
                        <HelpCircle size={16} />
                        <span>Got Questions?</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Everything you need to know about our catering services. Can't find your answer? Contact us directly.
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 * index }}
                        >
                            <div
                                className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg' : 'hover:shadow-lg'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                                >
                                    <span className="text-lg font-heading font-bold text-dark pr-8 group-hover:text-[#F27D42] transition-colors">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown
                                            className={`transition-colors ${openIndex === index ? 'text-[#F27D42]' : 'text-gray-400'
                                                }`}
                                            size={24}
                                        />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="#booking"
                        className="inline-block px-8 py-4 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors shadow-lg hover:shadow-xl"
                    >
                        Contact Our Team
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
