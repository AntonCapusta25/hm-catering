"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Utensils, Users, Calendar, Mail, User, Phone, Info, MapPin, CookingPot, Flame, Coffee, Sandwich, PartyPopper, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";
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
    city: string;
};

function QuizFormContent() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.quizForm || {};
    const pathname = usePathname();
    const lang = pathname?.split('/')[1] || 'en';

    const [step, setStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
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
        city: "",
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
            case 1: return 'contact';
            case 2: return 'service_type';
            case 3: return 'cuisine';
            case 4: return 'guests';
            case 5: return 'occasion';
            case 6: return 'service_level';
            case 7: return 'extras';
            case 8: return 'dates';
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
                    message: `City: ${formData.city}\nService: ${formData.serviceType}\nOccasion: ${formData.occasion}\nService Level: ${formData.serviceLevel}\nExtras: ${formData.extras.join(', ')}`,
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
            if (step < totalSteps && step !== 8) {
                const canGoNext = 
                    (step === 1 && formData.name && formData.email && formData.phone && formData.city) ||
                    (step === 2 && formData.serviceType) ||
                    (step === 3 && formData.cuisine) ||
                    (step === 4 && formData.guests) ||
                    (step === 5 && formData.occasion) ||
                    (step === 6 && formData.serviceLevel);
                if (canGoNext) nextStep();
            } else if (step === totalSteps && formData.eventDates.length > 0) {
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
                    {/* STEP 1: Contact */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.contactTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.contactSubtitle}</p>

                            <form className="space-y-6 max-w-xl mx-auto bg-white/5 p-8 rounded-3xl border border-white/10 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                value={formData.name}
                                                onChange={(e) => updateData({ name: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42] focus:bg-black/60 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                                value={formData.email}
                                                onChange={(e) => updateData({ email: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42] focus:bg-black/60 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1 uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="tel"
                                                placeholder="+31 6 12345678"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => updateData({ phone: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42] focus:bg-black/60 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1 uppercase tracking-wider">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="text"
                                                placeholder={t.cityPlaceholder || "Amsterdam"}
                                                required
                                                value={formData.city}
                                                onChange={(e) => updateData({ city: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-cream placeholder-gray-600 focus:outline-none focus:border-[#F27D42] focus:bg-black/60 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-xs text-gray-500 italic">We use this to send you the most relevant quotes from chefs in your area.</p>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* STEP 2: Service Type */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.serviceTypeTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.serviceTypeSubtitle}</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                                {Object.entries(opt.serviceTypes || {}).map(([key, label]: [string, any]) => {
                                    const getIcon = () => {
                                        switch(key) {
                                            case 'buffet': return <CookingPot size={24} />;
                                            case 'hapjes': return <PartyPopper size={24} />;
                                            case 'bbq': return <Flame size={24} />;
                                            case 'diner': return <Utensils size={24} />;
                                            case 'lunch': return <Sandwich size={24} />;
                                            case 'breakfast': return <Coffee size={24} />;
                                            case 'notSure': return <HelpCircle size={24} />;
                                            default: return <Utensils size={24} />;
                                        }
                                    };
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => { 
                                                updateData({ serviceType: label }); 
                                                trackEvent('quiz_option_select', { step: 2, field: 'service_type', value: label });
                                                setTimeout(nextStep, 300); 
                                            }}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-2xl border text-center transition-all ${formData.serviceType === label
                                                ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                                : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                                }`}
                                        >
                                            <div className={formData.serviceType === label ? "text-[#F27D42]" : "text-gray-400"}>
                                                {getIcon()}
                                            </div>
                                            <span className="font-bold text-xs md:text-sm">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Cuisine */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.cuisineTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.cuisineSubtitle}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(opt.cuisines || {}).map(([key, label]: [string, any]) => {
                                    const getFlag = () => {
                                        switch(key) {
                                            case 'dutch': return "🇳🇱";
                                            case 'mediterranean': return "🍋";
                                            case 'italian': return "🇮🇹";
                                            case 'french': return "🇫🇷";
                                            case 'spanish': return "🇪🇸";
                                            case 'asian': return "🥢";
                                            case 'japanese': return "🇯🇵";
                                            case 'indian': return "🇮🇳";
                                            case 'mexican': return "🇲🇽";
                                            case 'thai': return "🇹🇭";
                                            case 'moroccan': return "🇲🇦";
                                            case 'lebanese': return "🇱🇧";
                                            case 'bbq': return "🔥";
                                            case 'international': return "🌐";
                                            case 'other': return "✨";
                                            case 'notSure': return "❓";
                                            default: return "🍽️";
                                        }
                                    };
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => { 
                                                updateData({ cuisine: label }); 
                                                trackEvent('quiz_option_select', { step: 3, field: 'cuisine', value: label });
                                                setTimeout(nextStep, 300); 
                                            }}
                                            className={`flex flex-col items-center justify-center gap-2 p-3 md:p-5 rounded-2xl border text-center transition-all ${formData.cuisine === label
                                                ? "bg-[#F27D42]/10 border-[#F27D42] text-[#F27D42]"
                                                : "bg-white/5 border-white/10 text-cream hover:bg-white/10"
                                                }`}
                                        >
                                            <span className="text-2xl md:text-3xl mb-1">{getFlag()}</span>
                                            <span className="font-bold text-[10px] md:text-xs tracking-tight">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Guests */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.guestsTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.guestsSubtitle}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                                {Object.entries(opt.guests || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ guests: label }); 
                                            trackEvent('quiz_option_select', { step: 4, field: 'guests', value: label });
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

                    {/* STEP 5: Occasion */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.occasionTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.occasionSubtitle}</p>

                            <div className="grid grid-cols-2 gap-2 md:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(opt.occasions || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ occasion: label }); 
                                            trackEvent('quiz_option_select', { step: 5, field: 'occasion', value: label });
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

                    {/* STEP 6: Service Level */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.serviceLevelTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.serviceLevelSubtitle}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(opt.serviceLevels || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => { 
                                            updateData({ serviceLevel: label }); 
                                            trackEvent('quiz_option_select', { step: 6, field: 'service_level', value: label });
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

                    {/* STEP 7: Extras */}
                    {step === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
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

                    {/* STEP 8: Date */}
                    {step === 8 && (
                        <motion.div
                            key="step8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-heading font-bold text-cream mb-2 md:mb-4">{t.dateTitle}</h2>
                            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-10">{t.dateSubtitle}</p>

                            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F27D42]/10 blur-3xl rounded-full -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F27D42]/5 blur-3xl rounded-full -ml-16 -mb-16" />

                                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                                    {/* Calendar View */}
                                    <div className="lg:col-span-7">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-cream flex items-center gap-3 capitalize">
                                                <Calendar className="text-[#F27D42]" size={22} />
                                                {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-500"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-500"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-2 mb-4">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                                <div key={d} className="text-center text-[10px] uppercase tracking-widest text-gray-500 font-bold py-2">{d}</div>
                                            ))}
                                            {(() => {
                                                const year = currentMonth.getFullYear();
                                                const month = currentMonth.getMonth();
                                                const firstDay = new Date(year, month, 1).getDay();
                                                const daysInMonth = new Date(year, month + 1, 0).getDate();
                                                const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
                                                
                                                return [
                                                    ...Array(adjustedFirstDay).fill(null),
                                                    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
                                                ].map((day, i) => {
                                                    if (day === null) return <div key={`empty-${i}`} />;
                                                    
                                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    const isSelected = formData.eventDates.includes(dateStr);
                                                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                                    const isPast = new Date(year, month, day) < new Date(new Date().setHours(0,0,0,0));

                                                    return (
                                                        <button
                                                            key={i}
                                                            disabled={isPast}
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    updateData({ eventDates: formData.eventDates.filter(d => d !== dateStr) });
                                                                } else {
                                                                    updateData({ eventDates: [...formData.eventDates, dateStr] });
                                                                }
                                                            }}
                                                            className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${
                                                                isSelected 
                                                                    ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg shadow-[#F27D42]/20 scale-105" 
                                                                    : isPast 
                                                                        ? "bg-transparent border-transparent text-gray-800 cursor-not-allowed"
                                                                        : "bg-white/5 border-transparent text-cream hover:border-white/20 hover:bg-white/10"
                                                            } ${isToday && !isSelected ? "border-[#F27D42]/50 text-[#F27D42]" : ""}`}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic mt-4">* You can select multiple dates if your event is flexible</p>
                                    </div>

                                    {/* Selected Dates List */}
                                    <div className="lg:col-span-5 flex flex-col">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Selected Dates</h4>
                                            <span className="bg-[#F27D42]/10 text-[#F27D42] px-3 py-1 rounded-full text-[10px] font-bold">
                                                {formData.eventDates.length} Dates
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            <AnimatePresence initial={false}>
                                                {formData.eventDates.length > 0 ? (
                                                    formData.eventDates.map(date => (
                                                        <motion.div
                                                            key={date}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl group hover:border-[#F27D42]/30 transition-colors"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long' })}
                                                                </span>
                                                                <span className="text-cream font-bold">
                                                                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <button 
                                                                onClick={() => updateData({ eventDates: formData.eventDates.filter(d => d !== date) })}
                                                                className="text-gray-600 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-full"
                                                            >
                                                                <ArrowLeft size={14} className="rotate-45" /> {/* Simple X cross */}
                                                            </button>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="h-full min-h-[150px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[24px] p-6 text-center">
                                                        <Calendar className="text-gray-700 mb-3" size={32} />
                                                        <p className="text-gray-500 text-sm">Please select event dates from the calendar</p>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            (step === 1 && (!formData.name || !formData.email || !formData.phone || !formData.city)) ||
                            (step === 2 && !formData.serviceType) ||
                            (step === 3 && !formData.cuisine) ||
                            (step === 4 && !formData.guests) ||
                            (step === 5 && !formData.occasion) ||
                            (step === 6 && !formData.serviceLevel) ||
                            (step === 7 && formData.extras.length === 0)
                        }
                        className="flex items-center gap-2 bg-[#F27D42] text-white px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.nextButton}
                        <ArrowRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => handleSubmit()}
                        disabled={formData.eventDates.length === 0 || isSubmitting}
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
