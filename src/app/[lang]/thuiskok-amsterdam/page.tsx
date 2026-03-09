import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalBusinessSchema, FAQSchema } from "@/components/SEO/Schemas";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    return {
        title: "Thuiskok Amsterdam | Boek een Prive Chef aan Huis | Homemade",
        description: "Huur een professionele thuiskok in Amsterdam voor een onvergetelijk diner aan huis. Ontdek de beste privékoks voor jouw evenement.",
    };
}

export default async function ThuiskokAmsterdamPage({
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
                    Thuiskok Amsterdam — Boek een Prive Chef aan Huis
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        Op zoek naar een onvergetelijke culinaire ervaring in de hoofdstad? Een <strong>thuiskok in Amsterdam</strong> boeken via Homemade betekent dat je kunt genieten van restaurantkwaliteit, gewoon bij jou aan de keukentafel. Of je nu een gezelig familiediner organiseert, een verjaardag viert, of een zakelijk diner host; onze geselecteerde privékoks in Amsterdam nemen al het werk uit handen.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Wat doet een thuiskok precies?</h2>
                    <p>
                        Een <Link href={`/${lang}/thuiskok-inhuren`} className="text-orange hover:underline">thuiskok inhuren</Link> betekent volledige ontzorging. De kok doet de boodschappen, neemt waar nodig eigen servies en pannen mee, kookt in jouw keuken, serveert de gerechten uit en laat de keuken na afloop weer blinkend schoon achter. Het enige wat jij hoeft te doen, is genieten met je gasten.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Wat kost een prive chef in Amsterdam?</h2>
                    <p>
                        De prijzen voor een chef aan huis variëren op basis van het gekozen menu en het aantal gangen. Over het algemeen kun je rekenen op bedragen vanaf €40 tot €120 per persoon. Via ons platform navigeer je eenvoudig naar <Link href={`/${lang}/catering`} className="text-orange hover:underline">catering</Link> opties of privé diners die perfect passen binnen jouw budget.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Klantreviews uit Amsterdam</h2>
                    <blockquote className="border-l-4 border-orange pl-4 italic my-6">
                        "Geweldige ervaring! De thuiskok was perfect op tijd in Oud-Zuid, het eten was verrukkelijk (echte Italiaanse smaken) en de keuken was schoner dan daarvoor." - <strong>Sanne V. (Amsterdam)</strong>
                    </blockquote>
                </div>

                <div className="mt-12 mb-8">
                    <a
                        href="#booking-section"
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Vind jouw Amsterdamse Thuiskok
                    </a>
                </div>
            </section>



            <Footer />
        </main>
    );
}
