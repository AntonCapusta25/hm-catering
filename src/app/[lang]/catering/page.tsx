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
    const dictionary = await getDictionary(lang as Locale);

    // Specific Dutch SEO metadata requested by user for NL, fallback to English for others
    if (lang === "nl") {
        return {
            title: "Huisgemaakte Catering Nederland | Vers & Betaalbaar voor Elk Evenement | Homemade",
            description: "Thuisgemaakte catering voor bedrijven, feesten en evenementen. Onze thuiskoks bereiden verse gerechten op locatie in Amsterdam en Nederland. Vraag nu een gratis offerte aan.",
        };
    }

    return {
        title: "Catering Services | Homemade Catering",
        description: "Professional catering services for your events.",
    };
}

export default async function CateringPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <LocalBusinessSchema city="Amsterdam" />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    {lang === "nl"
                        ? "Catering Amsterdam — Thuisgemaakte Catering voor Elk Evenement"
                        : "Catering — Homemade Catering for Every Event"}
                </h1>

                <p className="text-dark/70 text-lg leading-relaxed mb-8 max-w-3xl">
                    {lang === "nl"
                        ? "Op zoek naar verse, huisgemaakte catering in Amsterdam of daarbuiten? Onze thuiskoks bereiden de lekkerste gerechten op locatie voor jouw bruiloft, bedrijfsborrel of verjaardag."
                        : "Looking for fresh, homemade catering? Our home chefs prepare the most delicious dishes on location for your wedding, corporate drinks, or birthday."}
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
                            {lang === "nl" ? "Waarom Huisgemaakt?" : "Why Homemade?"}
                        </h2>
                        <ul className="space-y-4 text-dark/70">
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                Verse ingrediënten
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                Persoonlijke thuiskok
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                Op locatie bereid
                            </li>
                        </ul>
                    </div>

                    <div className="relative h-64 rounded-2xl overflow-hidden bg-brand/10">
                        <img
                            src="/images/hero-image.jpg"
                            alt={lang === "nl" ? "Verse huisgemaakte catering Amsterdam" : "Fresh homemade catering"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </section>



            <Footer />
        </main >
    );
}

