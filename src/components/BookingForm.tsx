"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Calendar, Users, Utensils, ArrowRight, Star, Sparkles, ChefHat, BookOpen, CheckCircle2 } from "lucide-react";
import { menus, chefs } from "@/lib/data";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/analytics";

function BookingFormContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();

    // Form State
    const [selectedMenuId, setSelectedMenuId] = useState("");
    const [selectedChefName, setSelectedChefName] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState("");

    // Auto-fill logic from URL
    useEffect(() => {
        const menuTitleParam = searchParams.get('menu');
        if (menuTitleParam) {
            const decodedTitle = decodeURIComponent(menuTitleParam);
            const foundMenu = menus.find(m => m.title === decodedTitle);

            if (foundMenu) {
                setSelectedMenuId(foundMenu.id);
                setSelectedChefName(foundMenu.chef);
                setSelectedCuisine(foundMenu.badge);
            }
        }
    }, [searchParams]);

    // Handle Menu Selection Change
    const handleMenuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const menuId = e.target.value;
        setSelectedMenuId(menuId);

        const foundMenu = menus.find(m => m.id === menuId);
        if (foundMenu) {
            setSelectedChefName(foundMenu.chef);
            setSelectedCuisine(foundMenu.badge);
        } else {
            // Reset if "Custom/None" selected
            setSelectedChefName("");
            setSelectedCuisine("");
        }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const bookingData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            selectedMenu: selectedMenuId || null,
            selectedChef: selectedChefName || null,
            cuisine: selectedCuisine || null,
            eventDate: formData.get('eventDate') as string || null,
            guests: formData.get('guests') as string || null,
            message: formData.get('message') as string || null,
        };

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit booking');
            }

            // Track successful booking conversion in Google Analytics
            trackEvent('booking_submitted', {
                event_category: 'conversion',
                event_label: 'Booking Form',
                value: 1,
                menu: selectedMenuId || 'custom',
                chef: selectedChefName || 'any',
                cuisine: selectedCuisine || 'custom',
                guests: formData.get('guests') as string,
            });

            setIsSubmitting(false);
            setIsSuccess(true);
            triggerConfetti();
        } catch (error: any) {
            console.error('Booking error:', error);
            setIsSubmitting(false);
            alert(error.message || 'Failed to submit booking. Please try again.');
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto text-center"
            >
                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/20 to-white/0 shadow-2xl backdrop-blur-xl">
                    <div className="bg-[#2D2420]/95 rounded-[22px] p-12 border border-white/10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500"
                        >
                            <CheckCircle2 size={48} />
                        </motion.div>

                        <h3 className="text-3xl font-heading font-bold text-cream mb-4">You're Booked!</h3>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                            Thank you for your request. Our catering team will contact you shortly to finalize your event details!
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setIsSuccess(false); setSelectedMenuId(""); setSelectedChefName(""); setSelectedCuisine(""); }}
                            className="px-8 py-3 bg-[#F27D42] text-white rounded-xl font-bold hover:bg-[#d66a35] transition-colors"
                        >
                            Book Another
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Side: Visual Hook */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center lg:text-left"
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#F27D42] text-sm font-medium tracking-wide mb-6"
                >
                    <Sparkles size={14} />
                    <span>Exclusive Culinary Experiences</span>
                </motion.div>

                <h2 className="text-5xl lg:text-7xl font-heading font-bold text-cream mb-6 leading-tight">
                    Reserve Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D42] to-[#FF9F6D]">
                        Catering Service
                    </span>
                </h2>

                <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    From corporate events to celebrations, we deliver exceptional catering experiences tailored to your needs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-white/5 text-[#F27D42]">
                            <Star size={16} fill="currentColor" />
                        </div>
                        <span>5-Star Rated Chefs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-white/5 text-[#F27D42]">
                            <Utensils size={16} />
                        </div>
                        <span>Custom Curated Menus</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Trendy Form Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 w-full max-w-md"
            >
                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-white/20 to-white/0 shadow-2xl backdrop-blur-xl">
                    <div className="relative bg-[#2D2420]/90 rounded-[22px] p-8 border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                {/* Menu Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">Select Menu</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F27D42] transition-colors" size={18} />
                                        <select
                                            value={selectedMenuId}
                                            onChange={handleMenuChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                        >
                                            <option className="bg-[#2D2420]" value="">-- I'll Customize My Own --</option>
                                            {menus.filter(menu => !menu.soldOut).map(menu => (
                                                <option key={menu.id} value={menu.id} className="bg-[#2D2420]">
                                                    {menu.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Chef & Cuisine (Auto-filled or Manual) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">Preferred Chef</label>
                                        <div className="relative group">
                                            <ChefHat className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F27D42] transition-colors" size={18} />
                                            {selectedMenuId ? (
                                                <input
                                                    type="text"
                                                    value={selectedChefName}
                                                    readOnly
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream/70 focus:outline-none cursor-not-allowed"
                                                />
                                            ) : (
                                                <select
                                                    value={selectedChefName}
                                                    onChange={(e) => setSelectedChefName(e.target.value)}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option className="bg-[#2D2420]" value="">Any Chef</option>
                                                    {chefs.map(chef => (
                                                        <option key={chef.name} value={chef.name} className="bg-[#2D2420]">{chef.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">Cuisine Style</label>
                                        <div className="relative group">
                                            <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F27D42] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={selectedCuisine}
                                                onChange={(e) => setSelectedCuisine(e.target.value)}
                                                placeholder="e.g. Italian"
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all ${selectedMenuId ? 'text-cream/70' : ''}`}
                                                readOnly={!!selectedMenuId}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 ml-1">Event Details</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F27D42] transition-colors" size={18} />
                                        <input
                                            name="eventDate"
                                            type="date"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all font-sans"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F27D42] transition-colors" size={18} />
                                        <select name="guests" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-cream focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                                            <option className="bg-[#2D2420]">2 Guests</option>
                                            <option className="bg-[#2D2420]">3-5 Guests</option>
                                            <option className="bg-[#2D2420]">6-10 Guests</option>
                                            <option className="bg-[#2D2420]">10+ Guests</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42]/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full relative group overflow-hidden rounded-xl bg-[#F27D42] p-4 font-bold text-white transition-all hover:bg-[#d66a35]"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Book Now</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                                {/* Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            </motion.button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                No payment required instantly. <br />You'll be contacted to finalize details.
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function BookingForm() {
    return (
        <section id="booking" className="relative py-32 overflow-hidden bg-dark">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#F27D42]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-5 relative z-10">
                <Suspense fallback={<div className="text-white text-center">Loading form...</div>}>
                    <BookingFormContent />
                </Suspense>
            </div>
        </section>
    );
}
