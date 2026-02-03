"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, Users, Sparkles } from "lucide-react";

const benefits = [
    {
        icon: CheckCircle2,
        title: "Better food than restaurants",
        description: "Chef-prepared meals with premium ingredients, tailored to your preferences"
    },
    {
        icon: Users,
        title: "Intimate atmosphere for real bonding",
        description: "Create meaningful connections in a comfortable, private setting"
    },
    {
        icon: Sparkles,
        title: "Fully customizable & flexible",
        description: "Adapt menus, timing, and service to match your exact needs"
    }
];

export default function ProblemSolution() {
    return (
        <section className="relative py-24 bg-gradient-to-b from-cream to-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F27D42]/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-5 relative z-10">
                {/* Problem Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-6">
                        <TrendingDown size={16} />
                        <span>The Challenge</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-dark mb-4 leading-tight">
                        Restaurant catering is expensive.
                        <br />
                        Team bonding is hard.
                    </h2>
                </motion.div>

                {/* Solution Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F27D42] to-[#FF9F6D] text-white mb-6">
                        <h3 className="text-2xl md:text-4xl font-heading font-bold">
                            Private chef team dinners at 40% less cost
                        </h3>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Skip the overpriced restaurants. Get exceptional food, real connections, and significant savings.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="relative group"
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-gradient-to-br from-[#F27D42] to-[#FF9F6D] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="text-white" size={28} />
                                </div>

                                {/* Content */}
                                <h4 className="text-xl font-heading font-bold text-dark mb-3">
                                    {benefit.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
