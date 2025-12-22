"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CtaOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  // Show after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[90vw] md:w-[450px] max-w-lg"
          style={{ zIndex: 999999 }} // Force highest z-index via inline style
        >
          <div className="relative group perspective-1000">
            {/* Glassmorphism Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-primary/20">

              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
                aria-label="Close offer"
              >
                <X size={16} />
              </button>

              {/* Gradient Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

              {/* Content Wrapper */}
              <div className="relative flex flex-col">
                {/* Image Section - Main visual hook */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src="/images/cta-overlay.png"
                    alt="Hire a Private Chef - Experience luxury dining"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 90vw, 450px"
                    priority
                  />
                  {/* Overlay Gradient for text readability if needed, though image seems to have text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                  {/* Optional Text Overlay if image doesn't say it all, but image has text so keeping this minimal or hidden */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium tracking-wider uppercase text-yellow-300 mb-1 drop-shadow-md">Limited Availability</p>
                    <h3 className="text-2xl font-bold font-serif leading-tight drop-shadow-lg">Elevate Your Dining</h3>
                  </div>
                </div>

                {/* Call to Action Bar */}
                <div className="p-4 bg-white/95 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-sm">Book your private chef today.</p>
                    <p className="text-gray-500 text-xs mt-0.5">Unforgettable experiences at home.</p>
                  </div>
                  <a
                    href="https://zol4dc90rf4.typeform.com/to/MUaBZhSV"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap inline-block transform hover:scale-105 active:scale-95"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
