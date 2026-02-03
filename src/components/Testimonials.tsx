"use client";

import { motion } from "framer-motion";
import { Star, Quote, TrendingUp, Users, Award, ThumbsUp } from "lucide-react";

const testimonials = [
    {
        company: "TechFlow Solutions",
        eventType: "Quarterly Team Dinner",
        quote: "We switched from expensive restaurant reservations to private chef dinners and couldn't be happier. The food quality exceeded our expectations, and the intimate setting allowed our team to actually connect. The cost savings were significant—we're now doing these dinners monthly instead of quarterly!",
        author: "Sarah van der Berg",
        title: "HR Director",
        rating: 5
    },
    {
        company: "Creative Minds Agency",
        eventType: "Client Appreciation Event",
        quote: "Hosting our client appreciation dinner with a private chef was a game-changer. Our clients were impressed by the personalized menu and professional service. The chef accommodated all dietary restrictions seamlessly, and the whole experience felt exclusive without the restaurant markup.",
        author: "Marcus Johnson",
        title: "Managing Partner",
        rating: 5
    },
    {
        company: "StartupHub Amsterdam",
        eventType: "Team Building Dinner",
        quote: "As a startup, budget matters. Getting restaurant-quality food at 40% less cost meant we could invite the entire team instead of just leadership. The Growth package was perfect—great food, wine included, and the chef even shared cooking tips with our team. Highly recommend!",
        author: "Lisa Chen",
        title: "Operations Manager",
        rating: 5
    },
    {
        company: "Global Finance Corp",
        eventType: "Executive Retreat",
        quote: "The Premium package delivered on every promise. From the initial planning call to the post-event follow-up, everything was handled professionally. The 4-course menu was exquisite, and having an event coordinator made the day stress-free. Worth every euro.",
        author: "David Kowalski",
        title: "VP of Operations",
        rating: 5
    }
];

const metrics = [
    {
        icon: Users,
        value: "500+",
        label: "Companies Trust Us",
        color: "text-[#F27D42]"
    },
    {
        icon: Star,
        value: "4.8/5",
        label: "Average Rating",
        color: "text-yellow-500"
    },
    {
        icon: TrendingUp,
        value: "40%",
        label: "Savings vs. Restaurants",
        color: "text-green-500"
    },
    {
        icon: Award,
        value: "100%",
        label: "Customer Satisfaction",
        color: "text-[#F27D42]"
    }
];

export default function Testimonials() {
    return (
        <section className="relative py-24 bg-white overflow-hidden">
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
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[#F27D42] text-sm font-medium mb-6">
                        <ThumbsUp size={16} />
                        <span>Trusted by Teams</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Real experiences from companies who've transformed their team dinners.
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <metric.icon className={`${metric.color} mx-auto mb-3`} size={32} />
                            <div className="text-3xl md:text-4xl font-bold text-dark mb-2">
                                {metric.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {metric.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#F27D42] to-[#FF9F6D] rounded-full flex items-center justify-center shadow-lg">
                                <Quote className="text-white" size={20} />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="text-yellow-500" size={18} fill="currentColor" />
                                ))}
                            </div>

                            {/* Company & Event Type */}
                            <div className="mb-4">
                                <h4 className="font-heading font-bold text-dark text-lg">
                                    {testimonial.company}
                                </h4>
                                <p className="text-sm text-gray-500">{testimonial.eventType}</p>
                            </div>

                            {/* Quote */}
                            <p className="text-gray-700 leading-relaxed mb-6 italic">
                                "{testimonial.quote}"
                            </p>

                            {/* Attribution */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#F27D42]/20 to-[#FF9F6D]/20 rounded-full flex items-center justify-center">
                                    <span className="text-[#F27D42] font-bold text-lg">
                                        {testimonial.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-bold text-dark">{testimonial.author}</div>
                                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
                        Join hundreds of satisfied companies
                    </p>
                    <a
                        href="#booking"
                        className="inline-block px-8 py-4 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors shadow-lg hover:shadow-xl"
                    >
                        Book Your Team Dinner
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
