import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { LocalBusinessSchema } from "@/components/SEO/Schemas";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    const { lang } = await params;

    if (lang === "nl") {
        return {
            title: "Zakelijke Catering Amsterdam | Lunch Bezorgen & Bedrijfsborrels",
            description: "Zakelijke catering Amsterdam voor bedrijven, kantoorlunches en bedrijfsborrels. Lunch bezorgen op kantoor met verse, huisgemaakte ingrediënten.",
        };
    }

    return {
        title: "Corporate Catering Amsterdam | Office Lunch & Events",
        description: "Corporate catering Amsterdam for office lunches, corporate events, and business drinks. Freshly prepared and delivered to your office.",
    };
}

export default async function ZakelijkeCateringPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <LocalBusinessSchema city="Amsterdam" />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    {lang === "nl"
                        ? "Zakelijke Catering Amsterdam — Vers & Huisgemaakt voor Jouw Team"
                        : "Corporate Catering Amsterdam — Fresh & Homemade for Your Team"}
                </h1>

                <p className="text-dark/70 text-lg leading-relaxed mb-8 max-w-3xl">
                    {lang === "nl"
                        ? "Verander de dagelijkse kantoorlunch of de vrijdagmiddagborrel in een moment waar je team naar uitkijkt. Onze zakelijke catering in Amsterdam richt zich op startups, scale-ups en kantoren die kwaliteit waarderen. Wij verzorgen heerlijke werk-lunches, bedrijfsborrel catering, en team diners op locatie."
                        : "Turn the daily office lunch or Friday drinks into a moment your team looks forward to. Our corporate catering in Amsterdam focuses on startups, scale-ups, and offices that value quality. We provide delicious working lunches, corporate drinks catering, and team dinners on location."}
                </p>

                <div className="mb-16">
                    <a
                        href="#booking-section"
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {lang === "nl" ? "Vraag nu gratis offerte aan" : "Request a free quote now"}
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="font-serif text-2xl text-dark mb-4">
                            {lang === "nl" ? "Compleet Verzorgd" : "Fully Catered"}
                        </h2>
                        <ul className="space-y-4 text-dark/70">
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Lunch bezorgen op kantoor Amsterdam" : "Lunch delivery to office in Amsterdam"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Bedrijfsborrel catering (inclusief luxe borrelplanken)" : "Corporate drinks catering (including luxury snack boards)"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Mogelijkheden voor vaste, wekelijkse afdrachten" : "Options for recurring weekly setups"}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>



            <Footer />
        </main>
    );
}
