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
            title: "Catering Amsterdam | Thuisgemaakte Catering & Verse Hapjes",
            description: "Huisgemaakte catering Amsterdam voor bruiloften, feesten en zakelijke events. Topkwaliteit catering op locatie in Amsterdam, vers door onze kok.",
        };
    }

    return {
        title: "Catering Amsterdam | Homemade Catering & Fresh Bites",
        description: "Homemade catering in Amsterdam for weddings, parties, and corporate events. Top quality on-site catering in Amsterdam.",
    };
}

export default async function CateringAmsterdamPage({
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
                        ? "Catering Amsterdam — Thuisgemaakte Catering voor Elk Evenement"
                        : "Catering Amsterdam — Homemade Catering for Every Event"}
                </h1>

                <p className="text-dark/70 text-lg leading-relaxed mb-8 max-w-3xl">
                    {lang === "nl"
                        ? "Vier jij binnenkort een feestje of organiseer je een event in Amsterdam? Met onze huisgemaakte catering in Amsterdam ben je verzekerd van ambachtelijke, verse gerechten. Van gezelige diners tot grote borrels, wij verzorgen de catering op locatie zodat jij kunt genieten."
                        : "Celebrating a party or organizing an event in Amsterdam soon? With our homemade catering in Amsterdam, you are assured of artisanal, fresh dishes. From intimate dinners to large drinks, we provide on-site catering so you can enjoy."}
                </p>

                {/* CTA Button specifically requested */}
                <div className="mb-16">
                    <a
                        href={`/${lang}/quote`}
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        {lang === "nl" ? "Vraag nu gratis offerte aan" : "Request a free quote now"}
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="font-serif text-2xl text-dark mb-4">
                            {lang === "nl" ? "Catering op Locatie in Amsterdam" : "On-Site Catering in Amsterdam"}
                        </h2>
                        <ul className="space-y-4 text-dark/70">
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Vanaf €25 per persoon" : "From €25 per person"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Buffetten, hapjes, en private dining" : "Buffets, bites, and private dining"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Inclusief bezorging in heel regio Amsterdam" : "Including delivery in the Amsterdam region"}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>



            <Footer />
        </main >
    );
}
