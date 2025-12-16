"use client";

import { motion } from "framer-motion";

export default function BookingForm() {
    const typeformUrl = 'https://zol4dc90rf4.typeform.com/to/MUaBZhSV';

    return (
        <section id="booking" className="py-24 bg-cream">
            <div className="container mx-auto px-5 max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">
                        Book Your Experience
                    </h2>
                    <p className="text-light">
                        Secure your private chef or menu box today.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-[#D4AF37]/30 group cursor-pointer"
                    onClick={() => window.open(typeformUrl, '_blank')}
                >
                    {/* Background Image with Parallax Effect */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/hero-chef.png"
                            alt="Booking Background"
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                        <span className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] mb-4 font-semibold">Start Your Journey</span>
                        <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 max-w-lg leading-tight">
                            Ready to Book Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F2D06B]">Private Chef?</span>
                        </h3>
                        <p className="text-gray-300 text-lg mb-10 max-w-xl">
                            Complete our brief booking request form to secure your date. We'll curate the perfect menu for your occasion.
                        </p>

                        <a
                            href={typeformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative inline-flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-5 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>Complete Booking Form</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </a>
                    </div>

                    {/* Decorative Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-[#D4AF37]/10 rounded-2xl pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}
