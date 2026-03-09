import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalBusinessSchema } from "@/components/SEO/Schemas";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    return {
        title: "Thuiskok Rotterdam | Privechef bij Jou Thuis | Homemade",
        description: "Laat een professionele privechef bij jou thuis koken in Rotterdam. Boek gecertificeerde koks aan huis voor de ultieme diner ervaring.",
    };
}

export default async function ThuiskokRotterdamPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <LocalBusinessSchema city="Rotterdam" />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    Thuiskok Rotterdam — Laat een Privechef bij Jou Thuis Koken
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        Genieten van topgastronomie met het comfort van je eigen eetkamer in de Maasstad? Boek een <strong>thuiskok in Rotterdam</strong> en verander jouw huis in een privé-restaurant. Perfect voor feestelijke gelegenheden, zakelijke besprekingen of een ontspannen diner met vrienden.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">De voordelen van een kok aan huis in Rotterdam</h2>
                    <p>
                        Wanneer je een <Link href={`/${lang}/kok-aan-huis-inhuren`} className="text-orange hover:underline">kok aan huis inhuren</Link> via Homemade overweegt, kies je voor gemak en kwaliteit. Geen gedoe met reserveringen in een druk restaurant aan de Witte de Withstraat, maar gezelig dineren. De kok verzorgt alles: van het zorgvuldig selecteren van verse ingrediënten tot aan de afwas.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Ruim aanbod aan culinaire stijlen</h2>
                    <p>
                        Onze chefs in Rotterdam bieden uiteenlopende wereldkeukens. Zin in authentieke Italiaanse pasta's, verfijnde Aziatische fusion of juist klassiek Frans? Bekijk het aanbod en navigeer naar onze <Link href={`/${lang}/catering`} className="text-orange hover:underline">catering services</Link> voor grotere evenementen.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Onze Klanten aan het Woord</h2>
                    <blockquote className="border-l-4 border-orange pl-4 italic my-6">
                        "Voor mijn 40e verjaardag een chef laten komen in Kralingen. Alles klopte. Prachtige opmaak, heerlijke wijnen en de keuken was helemaal schoon bij vertrek. Een echte aanrader!" - <strong>Mark de J. (Rotterdam)</strong>
                    </blockquote>
                </div>

                <div className="mt-12 mb-8">
                    <a
                        href={`/${lang}/quote`}
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Vind jouw Rotterdamse Thuiskok
                    </a>
                </div>
            </section>


            <Footer />
        </main>
    );
}
