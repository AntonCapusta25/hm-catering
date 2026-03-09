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
            title: "Catering Feestje Thuis | Huisgemaakt & Vers aan Huis Bezorgd",
            description: "Catering voor een feestje thuis, verjaardag of kleinschalig evenement. Ontdek onze ambachtelijke buffetten en verse gerechten bij jou aan huis bezorgd.",
        };
    }

    return {
        title: "At Home Party Catering | Fresh & Homemade Delivery",
        description: "Catering for a party at home, birthday, or small-scale event. Discover our artisanal buffets and fresh dishes delivered right to your home.",
    };
}

export default async function CateringFeestThuisPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <LocalBusinessSchema city="Netherlands" />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    {lang === "nl"
                        ? "Catering voor Feestjes Thuis — Huisgemaakt & Vers aan Huis"
                        : "Catering for Parties at Home — Homemade & Fresh"}
                </h1>

                <p className="text-dark/70 text-lg leading-relaxed mb-8 max-w-3xl">
                    {lang === "nl"
                        ? "Iets speciaals te vieren? Of het nu gaat om een verjaardag thuis, een jubileumdiner of een tuinfeest met vrienden: wij nemen alle zorgen uit handen met onze persoonlijke thuiskok service. Perfect als catering voor een kleinschalig evenement."
                        : "Something special to celebrate? Whether it's a birthday at home, an anniversary dinner or a garden party with friends: we take all worries away with our personal chef service. Perfect as catering for a small scale event."}
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
                            {lang === "nl" ? "Ideaal voor elke viering" : "Ideal for every celebration"}
                        </h2>
                        <ul className="space-y-4 text-dark/70">
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Catering verjaardag thuis & privé-diners" : "Birthday catering at home & private dinners"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Catering voor kleinschalig evenement (bijv. 20 - 50 personen)" : "Small event catering (e.g. 20 - 50 people)"}
                            </li>
                            <li className="flex gap-3">
                                <span className="text-orange">✓</span>
                                {lang === "nl" ? "Van prachtig buffet tot walking dinner gerechten" : "From beautiful buffets to walking dinner dishes"}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>



            <Footer />
        </main>
    );
}
