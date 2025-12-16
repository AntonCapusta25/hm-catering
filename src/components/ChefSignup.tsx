"use client";

import Link from "next/link";

export default function ChefSignup() {
    return (
        <section id="chef-signup" className="py-24 bg-white text-center">
            <div className="container mx-auto px-5">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4 drop-shadow-sm">
                    Are You a Chef?
                </h2>
                <p className="text-light mb-10 text-lg max-w-xl mx-auto">
                    Join our exclusive network of top-tier private chefs and showcase your christmas menus.
                </p>
                <Link
                    href="/chef-application"
                    className="inline-block bg-transparent text-orange border-2 border-orange px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-orange hover:text-white transition-all shadow-sm hover:shadow-orange/30 duration-300"
                >
                    Apply as Chef
                </Link>
            </div>
        </section>
    );
}
