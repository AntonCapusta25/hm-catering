"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Utensils, Users, Calendar, Mail, User, Phone, Info, MapPin, CookingPot, Flame, Coffee, Sandwich, PartyPopper, HelpCircle, ChevronRight, ChevronLeft, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/contexts/I18nContext";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, MessageCircle } from "lucide-react";

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

const WHATSAPP_URL = "https://wa.me/310640090902";

function QuizFormContent() {
    const { dictionary } = useI18n();
    const t = (dictionary as any)?.quizForm || {};
    const pathname = usePathname();
    const router = useRouter();
    const lang = pathname?.split('/')[1] || 'en';

    const handleLanguageChange = (newLang: string) => {
        const parts = pathname.split("/");
        if (parts.length > 1) {
            parts[1] = newLang;
            router.push(parts.join("/"));
        }
    };

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
    const [submissionId, setSubmissionId] = useState<string | null>(null);

    const totalSteps = 9;

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
            
            // Special tracking for contact info (Step 1)
            if (step === 1) {
                trackEvent('contact_info_provided', {
                    name: formData.name,
                    method: 'quiz_step_1'
                });
            }

            // Save partial lead after Step 2 (Contact Info)
            if (step === 2) {
                captureLead();
            }

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
            case 1: return 'location';
            case 2: return 'contact';
            case 3: return 'service_type';
            case 4: return 'cuisine';
            case 5: return 'guests';
            case 6: return 'occasion';
            case 7: return 'service_level';
            case 8: return 'extras';
            case 9: return 'dates';
            default: return 'unknown';
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();

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

    const captureLead = async () => {
        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    isPartial: true,
                    id: submissionId
                }),
            });
            const data = await res.json();
            if (data.id) setSubmissionId(data.id);
        } catch (error) {
            console.error('Failed to capture lead:', error);
        }
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
                    id: submissionId
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
                    (step === 1 && formData.name && formData.email && formData.phone) ||
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
                <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 lg:p-20 shadow-2xl flex flex-col items-center">
                    <div className="mb-12">
                        <img src="/images/logo-homemade.png" alt="Homemade" width="80" height="80" className="h-20 w-20 object-contain" />
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-8 text-green-500"
                    >
                        <CheckCircle2 size={56} />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#2D2420] mb-6">{t.successTitle || "Request Received!"}</h2>
                    <p className="text-gray-600 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto leading-relaxed">
                        {t.successMessage || "Thank you for your request. Our coordination team will contact you shortly with a personalized quote!"}
                    </p>

                    <Link href={`/${lang}`} className="inline-block px-10 py-4 bg-[#F27D42] text-white rounded-2xl font-bold hover:bg-[#d66a35] transition-colors text-lg mb-4">
                        {t.backHome || "Back to Home"}
                    </Link>

                    <a 
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#25D366] hover:text-[#128C7E] transition-colors font-bold text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                        <span>{lang === 'nl' ? 'Vragen? Chat met ons' : 'Questions? Chat with us'}</span>
                    </a>
                </div>
            </motion.div>
        );
    }

    const opt = t.options || {};

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {/* Custom Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href={`/${lang}`} className="flex items-center gap-3">
                        <img src="/images/logo-homemade.png" alt="Homemade" width="40" height="40" className="h-10 w-10 object-contain" />
                    </Link>
                    
                    <label className="inline-flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                        <Globe className="w-4 h-4" />
                        <select 
                            className="bg-transparent font-medium text-[#2D2420] outline-none cursor-pointer"
                            value={lang}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                        >
                            <option value="en">🇬🇧 EN</option>
                            <option value="nl">🇳🇱 NL</option>
                            <option value="ar">🇸🇦 AR</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex gap-2">
                <a 
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 md:px-5 md:py-3 rounded-full shadow-xl transition-all hover:scale-105 text-sm font-bold"
                >
                    <MessageCircle className="w-5 h-5 md:w-4 md:h-4" />
                    <span className="hidden md:inline">WhatsApp</span>
                </a>
                <a 
                    href="tel:+310640090902"
                    className="flex items-center gap-2 bg-[#F27D42] hover:bg-[#d66a35] text-white p-3 md:px-5 md:py-3 rounded-full shadow-xl transition-all hover:scale-105 text-sm font-bold"
                >
                    <Phone className="w-5 h-5 md:w-4 md:h-4" />
                    <span className="hidden md:inline">{lang === 'nl' ? 'Bel ons' : 'Call us'}</span>
                </a>
            </div>

            {/* Segmented Progress Bar */}
            <div className="mb-12 animate-fade-in">
                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-[#F27D42] bg-[#F27D42]/10 px-3 py-1 rounded-full">
                                {step}/5
                            </span>
                            <span className="font-bold text-[#2D2420]">
                                {getStepName(step).charAt(0).toUpperCase() + getStepName(step).slice(1).replace('_', ' ')}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">
                            {Math.round((step / totalSteps) * 100)}%
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                                    i < Math.ceil((step / totalSteps) * 5) ? 'bg-[#F27D42]' : 'bg-gray-100'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="relative min-h-[400px] md:min-h-[500px]" onKeyDown={handleKeyDown}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: City */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full flex flex-col h-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">
                                    {lang === 'nl' ? 'Waar bevindt u zich?' : 'Where are you based?'}
                                </h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">
                                    {lang === 'nl' ? 'Selecteer uw stad om aan de slag te gaan' : 'Select your city to get started'}
                                </p>
                            </div>

                            <div className="flex-1">
                                <div className="max-w-2xl mx-auto">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                        {Object.entries(opt.cities || {}).map(([key, label]: [string, any]) => (
                                            key !== 'other' && (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => {
                                                        updateData({ city: label });
                                                        trackEvent('quiz_option_select', { step: 1, field: 'city', value: label });
                                                        setTimeout(nextStep, 300);
                                                    }}
                                                    className={`h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-bold text-sm md:text-base shadow-sm ${
                                                        formData.city === label
                                                        ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                                        : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                                    }`}
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    {label}
                                                </button>
                                            )
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateData({ city: (opt.cities as any)?.other || 'Other' });
                                                trackEvent('quiz_option_select', { step: 1, field: 'city', value: 'Other' });
                                            }}
                                            className={`h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center font-bold text-sm md:text-base col-span-2 md:col-span-3 ${
                                                formData.city === (opt.cities as any)?.other || (formData.city && !Object.values(opt.cities || {}).includes(formData.city))
                                                ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                                : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                            }`}
                                        >
                                            {lang === 'nl' ? 'Andere stad' : 'Other city'}
                                        </button>
                                    </div>

                                    {(formData.city === (opt.cities as any)?.other || (formData.city && !Object.values(opt.cities || {}).includes(formData.city))) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="max-w-md mx-auto"
                                        >
                                            <input
                                                type="text"
                                                placeholder={lang === 'nl' ? "Voer uw stad in..." : "Enter your city..."}
                                                required
                                                autoFocus
                                                value={Object.values(opt.cities || {}).includes(formData.city) ? "" : formData.city}
                                                onChange={(e) => updateData({ city: e.target.value })}
                                                className="w-full bg-white border-2 border-[#F27D42] rounded-2xl px-6 py-4 text-base text-[#2D2420] focus:outline-none shadow-sm"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Contact */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <div className="text-center mb-8 md:mb-12">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-[#2D2420] mb-4">{t.contactTitle}</h2>
                                <p className="text-gray-500 text-base md:text-xl">{t.contactSubtitle}</p>
                            </div>

                            <div className="bg-white border border-gray-100 p-6 md:p-10 rounded-3xl shadow-sm max-w-xl mx-auto">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                                value={formData.name}
                                                onChange={(e) => updateData({ name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-[#2D2420] focus:outline-none focus:border-[#F27D42] focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                                value={formData.email}
                                                onChange={(e) => updateData({ email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-[#2D2420] focus:outline-none focus:border-[#F27D42] focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#F27D42]" size={20} />
                                            <input
                                                type="tel"
                                                placeholder="+31 6 12345678"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => updateData({ phone: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 pl-12 md:pl-16 text-base text-[#2D2420] focus:outline-none focus:border-[#F27D42] focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Service Type */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.serviceTypeTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.serviceTypeSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
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
                                            type="button"
                                            onClick={() => { 
                                                updateData({ serviceType: label }); 
                                                trackEvent('quiz_option_select', { step: 3, field: 'service_type', value: label });
                                                setTimeout(nextStep, 300); 
                                            }}
                                            className={`h-20 md:h-24 px-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 font-bold text-xs md:text-sm shadow-sm ${
                                                formData.serviceType === label
                                                ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                                : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                            }`}
                                        >
                                            <span className={formData.serviceType === label ? "text-white" : "text-[#F27D42]"}>
                                                {getIcon()}
                                            </span>
                                            <span>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: Cuisine */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.cuisineTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.cuisineSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
                                            type="button"
                                            onClick={() => { 
                                                updateData({ cuisine: label }); 
                                                trackEvent('quiz_option_select', { step: 4, field: 'cuisine', value: label });
                                                setTimeout(nextStep, 300); 
                                            }}
                                            className={`h-16 px-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-bold text-xs md:text-sm shadow-sm ${
                                                formData.cuisine === label
                                                ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                                : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                            }`}
                                        >
                                            <span className="text-xl">{getFlag()}</span>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: Guests */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.guestsTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.guestsSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {Object.entries(opt.guests || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { 
                                            updateData({ guests: label }); 
                                            trackEvent('quiz_option_select', { step: 5, field: 'guests', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`h-16 px-8 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between font-bold text-sm md:text-base shadow-sm ${
                                            formData.guests === label
                                            ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                            : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                        }`}
                                    >
                                        <span>{label}</span>
                                        <Users className={formData.guests === label ? "text-white" : "text-[#F27D42]"} size={20} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: Occasion */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.occasionTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.occasionSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {Object.entries(opt.occasions || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { 
                                            updateData({ occasion: label }); 
                                            trackEvent('quiz_option_select', { step: 6, field: 'occasion', value: label });
                                            setTimeout(nextStep, 300); 
                                        }}
                                        className={`h-16 px-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center text-center font-bold text-xs md:text-sm shadow-sm ${
                                            formData.occasion === label
                                            ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                            : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 7: Service Level */}
                    {step === 7 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.serviceLevelTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.serviceLevelSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {Object.entries(opt.serviceLevels || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => { 
                                            updateData({ serviceLevel: label }); 
                                            trackEvent('quiz_option_select', { step: 7, field: 'service_level', value: label });
                                            setTimeout(nextStep, 300);
                                        }}
                                        className={`h-24 px-8 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between font-bold text-sm md:text-base shadow-sm ${
                                            formData.serviceLevel === label
                                            ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                            : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                        }`}
                                    >
                                        <span>{label}</span>
                                        <div className={formData.serviceLevel === label ? "text-white" : "text-[#F27D42]"}>
                                            {key === 'full' ? <User size={32} /> : <Utensils size={32} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 8: Extras */}
                    {step === 8 && (
                        <motion.div
                            key="step8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.extrasTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.extrasSubtitle}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                {Object.entries(opt.extras || {}).map(([key, label]: [string, any]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            toggleExtra(label);
                                            trackEvent('quiz_option_toggle', { step: 8, field: 'extras', value: label });
                                        }}
                                        className={`h-16 px-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 font-bold text-xs md:text-sm shadow-sm ${
                                            formData.extras.includes(label)
                                            ? "bg-[#F27D42] border-[#F27D42] text-white shadow-lg"
                                            : "bg-white border-gray-100 text-[#2D2420] hover:border-[#F27D42] hover:bg-[#F27D42]/5"
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.extras.includes(label) ? "bg-white border-white" : "border-gray-300"}`}>
                                            {formData.extras.includes(label) && <Check size={14} className="text-[#F27D42]" />}
                                        </div>
                                        <span className="text-left">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 9: Dates */}
                    {step === 9 && (
                        <motion.div
                            key="step9"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <div className="text-center mb-10">
                                <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#2D2420] mb-4">{t.datesTitle}</h1>
                                <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto">{t.datesSubtitle}</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 md:p-8 overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    {/* Calendar Component */}
                                    <div className="lg:col-span-7">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                                                {currentMonth.toLocaleDateString(lang, { month: 'long', year: 'numeric' })}
                                            </h4>
                                            <div className="flex gap-2">
                                                <button onClick={prevMonth} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={nextMonth} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                                                <div key={d} className="text-[10px] font-bold text-gray-600 uppercase py-2">{d}</div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {(() => {
                                                const year = currentYear;
                                                const month = currentMonthNum;
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
                                                                    ? "bg-[#F27D42] border-[#F27D42] text-white" 
                                                                    : isPast 
                                                                        ? "bg-transparent border-transparent text-gray-400 cursor-not-allowed"
                                                                        : "bg-gray-50 border-transparent text-[#2D2420] hover:border-gray-200"
                                                            } ${isToday && !isSelected ? "border-[#F27D42]/50 text-[#F27D42]" : ""}`}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>

                                    {/* Selected Dates List */}
                                    <div className="lg:col-span-5 hidden lg:flex flex-col">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Selected Dates</h4>
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
                                                            className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl group hover:border-[#F27D42]/30 transition-colors"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long' })}
                                                                </span>
                                                                <span className="text-[#2D2420] font-bold">
                                                                    {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <button 
                                                                onClick={() => updateData({ eventDates: formData.eventDates.filter(d => d !== date) })}
                                                                className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-gray-50 rounded-full"
                                                            >
                                                                <ArrowLeft size={14} className="rotate-45" /> {/* Simple X cross */}
                                                            </button>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="h-full min-h-[150px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[24px] p-6 text-center">
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
            <div className="mt-auto flex justify-between items-center pt-8 border-t border-gray-100">
                <button
                    onClick={prevStep}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-gray-100 h-12 px-6 ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500'}`}
                    disabled={step === 1 || isSubmitting}
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.backButton}
                </button>

                {step < totalSteps && (step === 2 || step === 8) && (
                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 2 && (!formData.name || !formData.email || !formData.phone)) ||
                            (step === 7 && !formData.serviceLevel) ||
                            (step === 8 && formData.extras.length === 0)
                        }
                        className={`flex items-center gap-3 bg-[#F27D42] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {t.nextButton}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
                
                {step === totalSteps && (
                    <button
                        onClick={() => handleSubmit()}
                        disabled={formData.eventDates.length === 0 || isSubmitting}
                        className="flex items-center gap-3 bg-[#F27D42] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#d66a35] transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? t.submitting : t.submitButton}
                        {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function QuizForm() {
    return (
        <Suspense fallback={<div className="text-gray-400 text-center">Loading...</div>}>
            <QuizFormContent />
        </Suspense>
    );
}
