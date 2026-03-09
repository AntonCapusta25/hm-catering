"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { trackFAQClick, trackCTAClick } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import { usePathname } from 'next/navigation';

const fallbackFaqs = [
    {
        question: "What's included in your service?",
        answer: "Our service includes a professional chef, all premium ingredients, table setup, and complete cleanup after the event. We ensure a seamless dining experience."
    },
    {
        question: "Can we customize the menu?",
        answer: "Absolutely! We work with you to create a menu that matches your preferences, dietary needs, and event theme."
    },
    {
        question: "What about dietary restrictions?",
        answer: "We accommodate all dietary restrictions and preferences. We handle vegetarian, vegan, gluten-free, halal, kosher, and all allergy-related requirements."
    },
    {
        question: "How many people can we accommodate?",
        answer: "Our service serves a wide range of group sizes, from 15 to 100+ people. Contact us for a custom quote and we can scale our service to match your needs."
    },
    {
        question: "Can we choose our preferred date and time?",
        answer: "Yes! We work around your schedule. During booking, you'll select your preferred date and time. We recommend booking at least 2-3 weeks in advance for best availability, though we can sometimes accommodate shorter notice for smaller events."
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
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.faq || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const items = t.items || fallbackFaqs;

    const toggleFAQ = (index: number) => {
        const isOpening = openIndex !== index;
        setOpenIndex(openIndex === index ? null : index);
        if (isOpening) {
            trackFAQClick(items[index].question);
        }
    };

    return (
        <section className="relative py-14 md:py-32 bg-gradient-to-b from-white to-cream overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#F27D42]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-5 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        {t.title || "Frequently Asked Questions"}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t.subtitle || "Everything you need to know about our catering services. Can't find your answer? Contact us directly."}
                    </p>
                </div>

                {/* FAQ Accordion — CSS-only transitions, no Framer Motion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {items.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl shadow-md overflow-hidden transition-shadow duration-200 ${isOpen ? 'shadow-lg' : 'hover:shadow-lg'}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-lg font-heading font-bold text-dark pr-8 group-hover:text-[#F27D42] transition-colors">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#F27D42]' : 'text-gray-400'}`}
                                        size={24}
                                    />
                                </button>

                                {/* CSS grid trick for smooth height animation */}
                                <div
                                    className="grid transition-[grid-template-rows] duration-200 ease-out"
                                    style={{
                                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                                        willChange: 'grid-template-rows'
                                    }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">{t.stillQuestions || "Still have questions?"}</p>
                    <a
                        href={`/${lang}/quote`}
                        onClick={() => trackCTAClick("Contact Our Team", "faq_section")}
                        className="inline-block px-8 py-4 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors shadow-lg hover:shadow-xl"
                    >
                        {t.contactTeam || "Contact Our Team"}
                    </a>
                </div>
            </div>
        </section>
    );
}
