import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FAQSchema } from "@/components/SEO/Schemas";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    return {
        title: "Kok Aan Huis Inhuren | Jouw Privechef voor een Speciaal Diner",
        description: "Direct een kok aan huis of een prive chef inhuren in Nederland. Laat ons koken in jouw keuken voor een exclusief diner. Bekijk de prijzen en menu's.",
    };
}

export default async function KokAanHuisPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <FAQSchema questions={[
                { question: "Heb ik een grote keuken nodig?", answer: "Nee, onze koks zijn getraind om te toveren in zowel grote kookeilanden als kleinere studentenkeukens. Bespreek de formaties van tevoren, soms neemt de chef extra kookapparatuur mee." },
                { question: "Hoe duur is een kok aan huis laten komen?", answer: "Prijzen starten vaak rond en €40,- tot €50,- per persoon voor 3 gangen. Premium fine-dining met 5 of meer gangen begint doorgaans bij €85,- per persoon." },
                { question: "Verzorgen de chefs ook de drankjes?", answer: "Standaard kunnen chefs zorgen voor passend wijnadvies of een complete pairing. Bespreek met uw chef of hij deze inkoopt (met eventueel glaswerk) of dat u zelf de drank koopt." }
            ]} />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    Kok Aan Huis Inhuren — Jouw Privechef voor een Speciaal Diner
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        Wilt u iets te vieren hebben zonder zelf dagen in de keuken te hoeven staan? Een <strong>kok aan huis inhuren</strong> biedt de perfecte balans tussen gezelige thuisgezelligheid en de verfijning van een sterrenrestaurant. Van 21-diners en jubilea tot gezellige familiebrunches, onze <Link href={`/${lang}/thuiskok-inhuren`} className="text-orange hover:underline">prive chiefs</Link> zorgen voor een avond om niet te vergeten.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Stap-voor-stap een kok boeken</h2>
                    <ol className="list-decimal pl-5 space-y-3">
                        <li><strong>Dien je aanvraag in:</strong> Vul ons formulier in met je datum, aantal gasten, locatie (bijv. <Link href={`/${lang}/thuiskok-amsterdam`} className="text-orange hover:underline">Amsterdam</Link> of <Link href={`/${lang}/thuiskok-rotterdam`} className="text-orange hover:underline">Rotterdam</Link>) en voorkeuren.</li>
                        <li><strong>Kies je menu en kok:</strong> Op basis van jouw wensen (bijv. klassiek Frans of juist modern Aziatisch) tonen we beschikbare koks.</li>
                        <li><strong>Persoonlijk overleg:</strong> Na goedkeuring bespreek je de laatste (dieet)wensen direct.</li>
                        <li><strong>Geniet:</strong> De kok neemt het stokje over inclusief ingrediënten, bereiding en de afwas!</li>
                    </ol>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Voor welke gelegenheden?</h2>
                    <p>
                        Een privéchef aan huis inhuren is populair voor formele en informele evenementen. Denk aan een babyshower, een afstudeerborrel, bachelorettes, een <Link href={`/${lang}/catering`} className="text-orange hover:underline">zakelijk diner of luxe catering</Link> voor de top relations, of simpelweg een gezellig samenzijn wanneer reserveren in een restaurant lastig wordt met een grote groep.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-12 mb-6 text-center">Meest Gestelde Vragen (FAQ)</h2>

                    <div className="space-y-6">
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Heb ik een grote keuken nodig?</h3>
                            <p>Nee, onze koks zijn getraind om te toveren in zowel grote kookeilanden als kleinere studentenkeukens. Bespreek de formaties van tevoren, soms neemt de chef extra kookapparatuur mee.</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Hoe duur is een kok aan huis laten komen?</h3>
                            <p>Prijzen starten vaak rond en €40,- tot €50,- per persoon voor 3 gangen. Premium fine-dining met 5 of meer gangen begint doorgaans bij €85,- per persoon.</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Verzorgen de chefs ook de drankjes?</h3>
                            <p>Standaard kunnen chefs zorgen voor passend wijnadvies of een complete pairing. Bespreek met uw chef of hij deze inkoopt (met eventueel glaswerk) of dat u zelf de drank koopt.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-8 text-center md:text-left">
                    <a
                        href="#booking-section"
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Boek Jouw Privékok Aan Huis
                    </a>
                </div>
            </section>



            <Footer />
        </main>
    );
}
