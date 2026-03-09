"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { usePathname } from 'next/navigation';

const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
        return value ? (
            <div className="w-3 h-3 bg-[#F27D42] rounded-full mx-auto" />
        ) : (
            <div className="w-4 h-0.5 bg-gray-200 mx-auto rounded-full" />
        );
    }
    return <span className="text-gray-500 text-sm font-medium">{value}</span>;
};

export default function PackageComparison() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.packageComparison || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const featuresData = [
        { category: "Menu", name: t.features?.numberOfCourses || "Number of Courses", starter: t.features?.courses2 || "2 courses", growth: t.features?.courses3 || "3 courses", premium: t.features?.courses4 || "4 courses" },
        { category: "Menu", name: t.features?.menuOptions || "Menu Options", starter: t.features?.standard || "Standard", growth: t.features?.options5 || "5+ options", premium: t.features?.unlimited || "Unlimited" },
        { category: "Menu", name: t.features?.customMenuAdjustments || "Custom Menu Adjustments", starter: false, growth: true, premium: true },
        { category: "Menu", name: t.features?.dietaryAccommodations || "Dietary Accommodations", starter: t.features?.type1 || "1 type", growth: t.features?.unlimited || "Unlimited", premium: t.features?.unlimited || "Unlimited" },

        { category: "Beverages", name: t.features?.nonAlcoholicDrinks || "Non-Alcoholic Drinks", starter: true, growth: true, premium: true },
        { category: "Beverages", name: t.features?.wineBeer || "Wine & Beer", starter: false, growth: true, premium: true },
        { category: "Beverages", name: t.features?.premiumBeverage || "Premium Beverage Package", starter: false, growth: false, premium: true },

        { category: "Service", name: t.features?.tableSetup || "Table Setup & Cleanup", starter: true, growth: true, premium: true },
        { category: "Service", name: t.features?.premiumTableSetup || "Premium Table Setup", starter: false, growth: true, premium: true },
        { category: "Service", name: t.features?.customLinens || "Custom Linens", starter: false, growth: false, premium: true },
        { category: "Service", name: t.features?.eventCoordinator || "Event Coordinator", starter: false, growth: false, premium: true },

        { category: "Planning", name: t.features?.preEventConsultation || "Pre-Event Consultation", starter: false, growth: t.features?.min30 || "30 min", premium: t.features?.hour1 || "1 hour" },
        { category: "Planning", name: t.features?.postEventFeedback || "Post-Event Feedback", starter: false, growth: false, premium: true },
        { category: "Planning", name: t.features?.professionalPhotos || "Professional Photos", starter: false, growth: false, premium: t.features?.optional || "Optional" },

        { category: "Details", name: t.features?.groupSize || "Group Size", starter: t.features?.size1530 || "15-30", growth: t.features?.size2050 || "20-50", premium: t.features?.size30100 || "30-100" },
        { category: "Details", name: t.features?.duration || "Duration", starter: t.features?.dur253 || "2.5-3h", growth: t.features?.dur335 || "3-3.5h", premium: t.features?.dur354 || "3.5-4h" },
    ];

    return (
        <section className="relative py-12 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-5">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        {t.title || "Compare Packages"}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {t.subtitle || "See exactly what's included in each package to find the perfect fit for your team."}
                    </p>
                </motion.div>

                {/* Desktop Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden lg:block overflow-x-auto"
                >
                    <table className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        <thead>
                            <tr className="bg-dark text-white">
                                <th className="text-left p-6 font-heading text-lg">{t.featureCol || "Feature"}</th>
                                <th className="text-center p-6 font-heading text-lg">
                                    {t.starter || "Starter"}
                                    <div className="text-[#F27D42] text-2xl font-bold mt-2">€40</div>
                                    <div className="text-gray-400 text-xs font-normal">{t.perPerson || "per person"}</div>
                                </th>
                                <th className="text-center p-6 font-heading text-lg bg-[#F27D42]/20 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#F27D42] text-white text-xs rounded-full">
                                        {t.mostPopular || "Most Popular"}
                                    </div>
                                    {t.growth || "Growth"}
                                    <div className="text-[#F27D42] text-2xl font-bold mt-2">€50</div>
                                    <div className="text-gray-400 text-xs font-normal">{t.perPerson || "per person"}</div>
                                </th>
                                <th className="text-center p-6 font-heading text-lg">
                                    {t.premium || "Premium"}
                                    <div className="text-[#F27D42] text-2xl font-bold mt-2">€65</div>
                                    <div className="text-gray-400 text-xs font-normal">{t.perPerson || "per person"}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {featuresData.map((feature, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                >
                                    <td className="p-4 text-dark font-medium">{feature.name}</td>
                                    <td className="p-4 text-center">{renderCell(feature.starter)}</td>
                                    <td className="p-4 text-center bg-[#F27D42]/5">{renderCell(feature.growth)}</td>
                                    <td className="p-4 text-center">{renderCell(feature.premium)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50">
                                <td className="p-6"></td>
                                <td className="p-6 text-center">
                                    <Link
                                        href="#booking"
                                        className="inline-block px-6 py-3 bg-dark text-white rounded-xl font-bold hover:bg-dark/90 transition-colors"
                                    >
                                        {t.select || "Select"}
                                    </Link>
                                </td>
                                <td className="p-6 text-center bg-[#F27D42]/5">
                                    <Link
                                        href="#booking"
                                        className="inline-block px-6 py-3 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors shadow-lg"
                                    >
                                        {t.select || "Select"}
                                    </Link>
                                </td>
                                <td className="p-6 text-center">
                                    <Link
                                        href="#booking"
                                        className="inline-block px-6 py-3 bg-dark text-white rounded-xl font-bold hover:bg-dark/90 transition-colors"
                                    >
                                        {t.select || "Select"}
                                    </Link>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </motion.div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-6">
                    {["Starter", "Growth", "Premium"].map((pkg, pkgIndex) => {
                        const isGrowth = pkg === "Growth";
                        const price = pkg === "Starter" ? "€40" : pkg === "Growth" ? "€50" : "€65";
                        const displayPkg = pkg === "Starter" ? (t.starter || "Starter") : pkg === "Growth" ? (t.growth || "Growth") : (t.premium || "Premium");

                        return (
                            <motion.div
                                key={pkg}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 * pkgIndex }}
                                className={`rounded-2xl overflow-hidden shadow-lg ${isGrowth ? 'border-2 border-[#F27D42]' : 'border border-gray-200'
                                    }`}
                            >
                                <div className={`p-6 ${isGrowth ? 'bg-[#F27D42]' : 'bg-dark'} text-white`}>
                                    {isGrowth && (
                                        <div className="text-xs font-bold mb-2">⭐ {t.mostPopular || "Most Popular"}</div>
                                    )}
                                    <h3 className="text-2xl font-heading font-bold">{displayPkg}</h3>
                                    <div className="text-3xl font-bold mt-2">{price}</div>
                                    <div className="text-sm opacity-80">{t.perPerson || "per person"}</div>
                                </div>
                                <div className="p-6 bg-white">
                                    <div className="space-y-3">
                                        {featuresData.map((feature, idx) => {
                                            const value = pkg === "Starter" ? feature.starter : pkg === "Growth" ? feature.growth : feature.premium;
                                            return (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-sm text-dark font-medium">{feature.name}</span>
                                                    <div>{renderCell(value)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Link
                                        href="#booking"
                                        className={`block w-full text-center py-4 rounded-xl font-bold mt-6 transition-colors ${isGrowth
                                            ? 'bg-[#F27D42] text-white hover:bg-[#d66a35]'
                                            : 'bg-dark text-white hover:bg-dark/90'
                                            }`}
                                    >
                                        {t.selectPkg ? t.selectPkg.replace("{pkg}", displayPkg) : `Select ${displayPkg}`}
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
