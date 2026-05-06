"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Utensils, Users, Calendar, Mail, User, Phone, Info } from "lucide-react";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type FormData = {
    serviceType: string;
    cuisine: string;
    guests: string;
    occasion: string;
    serviceLevel: string;
    extras: string[];
    eventDates: string[];
    name: string;
    email: string;
    phone: string;
};

function QuizFormContent() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.quizForm || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        serviceType: "",
        cuisine: "",
        guests: "",
        occasion: "",
        serviceLevel: "",
        extras: [],
        eventDates: [],
        name: "",
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalSteps = 8;

    const updateData = (fields: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...fields }));
    };

    const toggleExtra = (extra: string) => {
        setFormData(prev => ({
            ...prev,
            extras: prev.extras.includes(extra)
                ? prev.extras.filter(e => e !== extra)
                : [...prev.extras, extra]
        }));
    };

    const nextStep = () => {
        if (step < totalSteps) {
            const next = step + 1;
            setStep(next);
            trackEvent('quiz_step_complete', {
                step: step,
                step_name: getStepName(step),
                completed: true
            });
        }
    };

    const getStepName = (s: number) => {
        switch(s) {
            case 1: return 'service_type';
            case 2: return 'cuisine';
            case 3: return 'guests';
            case 4: return 'occasion';
            case 5: return 'service_level';
            case 6: return 'extras';
            case 7: return 'dates';
            case 8: return 'contact';
            default: return 'unknown';
        }
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
                    cuisine: formData.cuisine,
                    eventDate: formData.eventDates.join(', '),
                    guests: formData.guests,
                    message: `Service: ${formData.serviceType}\nOccasion: ${formData.occasion}\nService Level: ${formData.serviceLevel}\nExtras: ${formData.extras.join(', ')}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            // --- TRACKING START ---
            trackEvent('form_submit', {
                event_category: 'engagement',
                event_label: 'Quiz Form Success',
                form_id: 'quiz-form',
                service_type: formData.serviceType,
                occasion: formData.occasion,
                cuisine: formData.cuisine,
                guests: formData.guests
            });

            trackEvent('generate_lead', {
                event_category: 'conversion',
                event_label: 'Quiz Form Lead',
                value: 1,
                currency: 'EUR',
                occasion: formData.occasion,
                guests: formData.guests,
                service_type: formData.serviceType
            });

            // Meta Pixel Lead Tracking
            if (typeof (window as any).fbq === 'function') {
                (window as any).fbq('track', 'Lead', {
                    value: 1.00,
                    currency: 'EUR',
                    content_name: 'Quiz Form Submission',
                    content_category: formData.occasion,
                });
            }

            // TikTok Pixel Lead Tracking
            if (typeof (window as any).ttq === 'object' && (window as any).ttq.track) {
                (window as any).ttq.track('CompleteRegistration', {
                    value: 1.00,
                    currency: 'EUR',
                    content_name: 'Quiz Form Submission'
                });
            }

            // LinkedIn Insight Tag
            if (typeof (window as any).lintrk === 'function') {
                (window as any).lintrk('track', { conversion_id: 26646249 });
            }
            // --- TRACKING END ---

            setIsSubmitting(false);
            setIsSuccess(true);
            triggerConfetti();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            trackEvent('form_error', {
                event_category: 'error',
                event_label: 'Quiz Form Submission Error',
                error_message: error instanceof Error ? error.message : 'Unknown error'
            });
            alert('Submission failed. Please try again.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (step < totalSteps && step !== 6 && step !== 7) {
                const canGoNext = 
                    (step === 1 && formData.serviceType) ||
                    (step === 2 && formData.cuisine) ||
                    (step === 3 && formData.guests) ||
                    (step === 4 && formData.occasion) ||
                    (step === 5 && formData.serviceLevel);
                if (canGoNext) nextStep();
            } else if (step === totalSteps && formData.name && formData.email && formData.phone) {
                handleSubmit();
            }
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

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-cream mb-6">{t.successTitle || "Request Received!"}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto leading-relaxed">
                        {t.successMessage || "Thank you for your request. Our coordination team will contact you shortly with a personalized quote!"}
                    </p>

                    <Link href={`/${lang}`} className="inline-block px-10 py-4 bg-[#F27D42] text-white rounded-2xl font-bold hover:bg-[#d66a35] transition-colors text-lg">
                        {t.backHome || "Back to Home"}
                    </Link>
                </div>
            </motion.div>
        );
    }

    const opt = t.options || {};

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
            <div className="relative min-h-[450px] md:min-h-[550px]" onKeyDown={handleKeyDown}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: Service Type */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.serviceTypeTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.serviceTypeSubtitle}</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                                {Object.entries(opt.serviceTypes || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ serviceType: label }); 
                                            trackEvent('quiz_option_select', { step: 1, field: 'service_type', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-2xl border text-center transition-all ${formData.serviceType === label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <Utensils size={24} className={formData.serviceType === label ? "text-[#F27D42]" : "text-gray-400"} />
                                        <span className="font-bold text-xs md:text-sm">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Cuisine */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.cuisineTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.cuisineSubtitle}</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                                {Object.entries(opt.cuisines || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ cuisine: label }); 
                                            trackEvent('quiz_option_select', { step: 2, field: 'cuisine', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-2xl border text-center transition-all ${formData.cuisine === label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <Utensils size={24} className={formData.cuisine === label ? "text-[#F27D42]" : "text-gray-400"} />
                                        <span className="font-bold text-xs md:text-sm">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Guests */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.guestsTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.guestsSubtitle}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                                {Object.entries(opt.guests || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ guests: label }); 
                                            trackEvent('quiz_option_select', { step: 3, field: 'guests', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl border text-left transition-all ${formData.guests === label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <Users size={24} className={formData.guests === label ? "text-[#F27D42]" : "text-gray-400"} />
                                        <span className="font-bold text-sm md:text-lg">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Occasion */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.occasionTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.occasionSubtitle}</p>

                            <div className="grid grid-cols-2 gap-2 md:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(opt.occasions || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ occasion: label }); 
                                            trackEvent('quiz_option_select', { step: 4, field: 'occasion', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`group relative flex items-center gap-3 p-3 md:p-4 rounded-xl border text-left transition-all ${formData.occasion === label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <span className="font-bold text-xs md:text-sm flex-1">{label}</span>
                                        <Info size={14} className="text-gray-500 group-hover:text-cream transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: Service Level */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.serviceLevelTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.serviceLevelSubtitle}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(opt.serviceLevels || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ serviceLevel: label }); 
                                            trackEvent('quiz_option_select', { step: 5, field: 'service_level', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border text-center transition-all ${formData.serviceLevel === label
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        {key === 'full' ? <User size={48} /> : <Utensils size={48} />}
                                        <span className="font-bold text-lg md:text-xl">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: Extras */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.extrasTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.extrasSubtitle}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                {Object.entries(opt.extras || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => toggleExtra(label)}
                                        className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border text-left transition-all ${formData.extras.includes(label)
                                            ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                            : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.extras.includes(label) ? "bg-[#F27D42] border-[#F27D42]" : "border-white/20"}`}>
                                            {formData.extras.includes(label) && <ArrowRight size={14} className="text-white" />}
                                        </div>
                                        <span className="font-bold text-xs md:text-sm">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 7: Date */}
                    {step === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.dateTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.dateSubtitle}</p>

                            <div className="relative max-w-md">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                <input
                                    type="date"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val && !formData.eventDates.includes(val)) {
                                            updateData({ eventDates: [...formData.eventDates, val] });
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 md:px-6 md:py-6 pl-12 md:pl-16 text-lg md:text-xl text-cream focus:outline-none focus:border-[#F27D42] focus:bg-white/10 transition-all font-sans"
                                />
                                
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {formData.eventDates.map(date => (
                                        <span key={date} className="bg-[#F27D42]/20 text-[#F27D42] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                            {date}
                                            <button onClick={() => updateData({ eventDates: formData.eventDates.filter(d => d !== date) })} className="hover:text-white">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 8: Contact */}
                    {step === 8 && (
                        <motion.div
                            key="step8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.contactTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.contactSubtitle}</p>

                            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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
                    {t.backButton}
                </button>

                {step < totalSteps ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !formData.serviceType) ||
                            (step === 2 && !formData.cuisine) ||
                            (step === 3 && !formData.guests) ||
                            (step === 4 && !formData.occasion) ||
                            (step === 5 && !formData.serviceLevel) ||
                            (step === 6 && formData.extras.length === 0) ||
                            (step === 7 && formData.eventDates.length === 0)
                        }
                        className="flex items-center gap-2 bg-[#F27D42] text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.nextButton}
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => handleSubmit()}
                        disabled={!formData.name || !formData.email || !formData.phone || isSubmitting}
                        className="flex items-center gap-2 bg-[#F27D42] text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                    >
                        {isSubmitting ? t.submitting : t.submitButton}
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
