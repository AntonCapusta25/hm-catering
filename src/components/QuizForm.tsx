"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Utensils, Users, Calendar, Mail, User, Phone } from "lucide-react";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type FormData = {
    occasion: string;
    guests: string;
    eventDate: string;
    name: string;
    email: string;
    phone: string;
};

const OCCASIONS = [
    { id: "lunch", label: "Team Lunch", icon: Utensils },
    { id: "dinner", label: "Company Dinner", icon: Utensils },
    { id: "drinks", label: "Drinks & Bites", icon: Utensils },
    { id: "party", label: "Corporate Party", icon: Utensils },
    { id: "other", label: "Other", icon: Utensils },
];

const GUESTS_OPTIONS = [
    { id: "small", label: "5-20 Guests" },
    { id: "medium", label: "20-50 Guests" },
    { id: "large", label: "50-100 Guests" },
    { id: "xlarge", label: "100+ Guests" },
];

function QuizFormContent() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.quizForm || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        occasion: "",
        guests: "",
        eventDate: "",
        name: "",
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalSteps = 4;

    const updateData = (fields: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    selectedMenu: null,
                    selectedChef: null,
                    cuisine: formData.occasion,
                    eventDate: formData.eventDate,
                    guests: formData.guests,
                    message: `Occasion: ${formData.occasion}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            trackEvent('form_submit', {
                event_category: 'engagement',
                event_label: 'Quiz Form',
                form_id: 'quiz-form',
            });

            trackEvent('generate_lead', {
                event_category: 'conversion',
                event_label: 'Quiz Form',
                value: 1,
                currency: 'EUR',
                occasion: formData.occasion,
                guests: formData.guests,
            });

            // Meta Pixel Lead Tracking
            if (typeof (window as any).fbq === 'function') {
                (window as any).fbq('track', 'Lead', {
                    value: 1.00,
                    currency: 'EUR',
                    content_name: 'Quiz Form',
                });
            }

            // TikTok Pixel Lead Tracking
            if (typeof (window as any).ttq === 'object' && (window as any).ttq.track) {
                (window as any).ttq.track('CompleteRegistration', {
                    value: 1.00,
                    currency: 'EUR',
                    content_name: 'Quiz Form'
                });
            }

            if (typeof (window as any).lintrk === 'function') {
                (window as any).lintrk('track', { conversion_id: 26646249 });
            }

            setIsSubmitting(false);
            setIsSuccess(true);
            triggerConfetti();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert('Submission failed. Please try again.');
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (step === 1 && formData.occasion) nextStep();
            if (step === 2 && formData.guests) nextStep();
            if (step === 3 && formData.eventDate) nextStep();
            if (step === 4 && formData.name && formData.email && formData.phone) handleSubmit();
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto text-center"
            >
                <div className="bg-[#2D2420]/95 rounded-[32px] p-8 md:p-12 lg:p-20 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-8 text-green-500"
                    >
                        <CheckCircle2 size={56} />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-cream mb-6">{t.successTitle || "You're Booked!"}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto leading-relaxed">
                        {t.successMessage || "Thank you for your request. Our catering team will contact you shortly to finalize your event details!"}
                    </p>

                    <Link href={`/${lang}`} className="inline-block px-10 py-4 bg-[#F27D42] text-white rounded-2xl font-bold hover:bg-[#d66a35] transition-colors text-lg">
                        {t.backHome || "Back to Home"}
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6 md:mb-12">
                <div className="flex justify-between text-[10px] md:text-sm font-medium text-gray-500 mb-2 md:mb-4 tracking-widest uppercase">
                    <span>{t.stepProgress?.replace('{current}', step.toString()).replace('{total}', totalSteps.toString()) || `Step ${step} of ${totalSteps}`}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="bg-[#F27D42] h-full"
                        initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Form Container */}
            <div className="relative min-h-[320px] md:min-h-[400px]" onKeyDown={handleKeyDown}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: Occasion */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.occasionTitle || "What's the occasion?"}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.occasionSubtitle || "Select the type of event you're planning."}</p>
 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                                {OCCASIONS.map((occ) => (
                                    <button
                                        key={occ.id}
                                        onClick={() => { updateData({ occasion: occ.label }); setTimeout(nextStep, 300); }}
                                        className={`flex items-center gap-3 md:gap-4 p-3 md:p-6 rounded-2xl border text-left transition-all ${formData.occasion === occ.label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <occ.icon size={18} className={`md:w-6 md:h-6 ${formData.occasion === occ.label ? "text-[#F27D42]" : "text-gray-400"}`} />
                                        <span className="font-bold text-sm md:text-lg">{occ.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Guests */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.guestsTitle || "How many guests?"}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.guestsSubtitle || "Rough estimates are fine. Minimum 5 guests."}</p>
 
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                                {GUESTS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { updateData({ guests: opt.label }); setTimeout(nextStep, 300); }}
                                        className={`flex items-center gap-3 md:gap-4 p-3 md:p-6 rounded-2xl border text-left transition-all ${formData.guests === opt.label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <Users size={18} className={`md:w-6 md:h-6 ${formData.guests === opt.label ? "text-[#F27D42]" : "text-gray-400"}`} />
                                        <span className="font-bold text-sm md:text-lg">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Date */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.dateTitle || "When is the event?"}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.dateSubtitle || "Select your preferred date."}</p>

                            <div className="relative max-w-md">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                <input
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={(e) => updateData({ eventDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-6 pl-12 md:pl-16 text-lg md:text-xl text-cream focus:outline-none focus:border-[#F27D42] focus:bg-white/10 transition-all font-sans"
                                    autoFocus
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Contact & Submit */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.contactTitle || "Your Details"}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.contactSubtitle || "Where should we send the quote?"}</p>

                            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateData({ name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-5 pl-12 md:pl-16 text-base md:text-lg text-cream placeholder-gray-500 focus:outline-none focus:border-[#F27D42] focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={(e) => updateData({ email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-5 pl-12 md:pl-16 text-base md:text-lg text-cream placeholder-gray-500 focus:outline-none focus:border-[#F27D42] focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => updateData({ phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-5 pl-12 md:pl-16 text-base md:text-lg text-cream placeholder-gray-500 focus:outline-none focus:border-[#F27D42] focus:bg-white/10 transition-all"
                                    />
                                </div>

                                <p className="text-sm text-gray-500 py-2">
                                    We respect your privacy. No immediate payment required.
                                </p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="mt-8 md:mt-16 flex items-center justify-between border-t border-white/10 pt-4 md:pt-8">
                <button
                    onClick={prevStep}
                    className={`flex items-center gap-2 font-bold transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                    disabled={step === 1 || isSubmitting}
                >
                    <ArrowLeft size={20} />
                    {t.backButton || "Back"}
                </button>

                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !formData.occasion) ||
                            (step === 2 && !formData.guests) ||
                            (step === 3 && !formData.eventDate)
                        }
                        className="flex items-center gap-2 bg-[#F27D42] text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.nextButton || "Next"}
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!formData.name || !formData.email || !formData.phone || isSubmitting}
                        className="flex items-center gap-2 bg-[#F27D42] text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                    >
                        {isSubmitting ? t.submitting || "Submitting..." : t.submitButton || "Submit Request"}
                        {!isSubmitting && <CheckCircle2 size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function QuizForm() {
    return (
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
            <QuizFormContent />
        </Suspense>
    );
}
