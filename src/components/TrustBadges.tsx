"use client";

import { motion } from "framer-motion";
import { Shield, Award, RefreshCw, CheckCircle2, CreditCard } from "lucide-react";

const guarantees = [
    {
        icon: Award,
        title: "Professional Chef Guarantee",
        description: "Experienced, certified chefs for every event"
    },
    {
        icon: CheckCircle2,
        title: "Dietary Accommodation Guarantee",
        description: "All dietary needs handled safely and deliciously"
    },
    {
        icon: RefreshCw,
        title: "Flexible Cancellation Policy",
        description: "Full refund up to 14 days before your event"
    },
    {
        icon: Shield,
        title: "Money-Back if Unsatisfied",
        description: "100% satisfaction or your money back"
    }
];

const paymentMethods = [
    { name: "Visa", logo: "💳" },
    { name: "Mastercard", logo: "💳" },
    { name: "American Express", logo: "💳" },
    { name: "iDEAL", logo: "🏦" }
];

export default function TrustBadges() {
    return (
        <section className="relative py-16 bg-gradient-to-b from-cream to-white border-t border-gray-200">
            <div className="container mx-auto px-5">
                {/* Guarantees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {guarantees.map((guarantee, index) => (
                        <motion.div
                            key={guarantee.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <guarantee.icon className="text-green-600" size={24} />
                            </div>
                            <h4 className="font-bold text-dark text-sm mb-2">
                                {guarantee.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                                {guarantee.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Payment Methods & Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Shield className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-600 font-medium">Secure Payment Methods</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.name}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200"
                            >
                                <span className="text-2xl">{method.logo}</span>
                                <span className="text-sm font-medium text-gray-700">{method.name}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                        All transactions are secure and encrypted. Your payment information is never stored on our servers.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
