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
        title: "Lunchclub Amsterdam | Wekelijkse Gezonde Lunch Bezorgd op je Werk",
        description: "Abonneer je op de Homemade Lunchclub en ontvang elke week verse, huisgemaakte lunch op je werk in Amsterdam. Gezond, lekker en betaalbaar. Vraag een proefpakket aan.",
    };
}

export default async function LunchclubPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <FAQSchema questions={[
                { question: "Kan ik de lunch aftrekken voor de zaak (WKR)?", answer: "Ja, als de maaltijden op de werkplek worden genuttigd gelden er specifieke fiscale regelingen voor zakelijk aftrekbare lunch en catering kosten in de WKR." },
                { question: "Leveren jullie warme of koude lunchmaaltijden?", answer: "Dat hangt af van het afgestemde weekmenu. We leveren zowel rijkgevulde koude opties (salades, grain bowls, luxe sandwiches) als opties die eventueel enkel nog opgewarmd dienen te worden op kantoor." }
            ]} />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    Lunchclub Amsterdam — Wekelijkse Gezonde Lunch Bezorgd op je Werk
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        De dagelijkse broodtrommel beu of klaar met de droge, in plastic verpakte salades uit de supermarkt? Met de <strong>Homemade Lunchclub</strong> voor bedrijven haal je elke werkweek <Link href={`/${lang}/huisgemaakte-maaltijden-bestellen`} className="text-orange hover:underline">huisgemaakte kwaliteit</Link> rechtstreeks naar de kantoortafel in Amsterdam. Wij combineren verse seizoensgroenten met ambachtelijke smaken voor de ultieme lunchbreak op het werk.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Waarom een Lunch Abonnement in Amsterdam sluiten?</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>100% Gezond en Voedzaam:</strong> Volledige maaltijden die energie geven voor de rest van de werkdag, boordevol vitamines. Geen verborgen toegevoegde suikers.</li>
                        <li><strong>Bedrijfsbrede Ontzorging:</strong> Of je nu voor een klein team van 5 personen bestelt of <Link href={`/${lang}/zakelijke-catering-amsterdam`} className="text-orange hover:underline">zakelijke catering</Link> afneemt voor grote kantoren, wij plannen wekelijks de bezorging.</li>
                        <li><strong>Variatie in Menu:</strong> Elke week presenteren onze koks een nieuw lunchmenu, variërend van hartige soepen, buddha bowls en goedgevulde wraps tot warme stoofpotjes in de winter.</li>
                        <li><strong>Flexibel & Betaalbaar:</strong> Eerlijke porties en duidelijke afspraken (bijvoorbeeld ma t/m vr). Ook pauzeren rondom vakanties is altijd in overleg mogelijk.</li>
                    </ul>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Vraag een Proefpakket aan</h2>
                    <p>
                        Wij geloven dat je kantoormaaltijden eerst moet proeven voordat je je vastlegt. Vul het boekingsformulier op deze pagina in, noteer in het opmerkingenveld het woord "Lunchclub Amsterdam" met je bedrijfsnaam en we nemen contact op om de mogelijkheden voor een proeftijd af te stemmen. <Link href={`/${lang}/catering`} className="text-orange hover:underline">Ontdek meer over onze catering expertises</Link>.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-12 mb-6 text-center">Veelgestelde Vragen (FAQ)</h2>

                    <div className="space-y-6">
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Kan ik de lunch aftrekken voor de zaak (WKR)?</h3>
                            <p>Ja, als de maaltijden op de werkplek worden genuttigd gelden er specifieke fiscale regelingen voor zakelijk aftrekbare lunch en catering kosten in de WKR.</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Leveren jullie warme of koude lunchmaaltijden?</h3>
                            <p>Dat hangt af van het afgestemde weekmenu. We leveren zowel rijkgevulde koude opties (salades, grain bowls, luxe sandwiches) als opties die eventueel enkel nog opgewarmd dienen te worden op kantoor.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-8 text-center md:text-left">
                    <a
                        href={`/${lang}/quote`}
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Abonneer of Plan een Proeflunch
                    </a>
                </div>
            </section>



            <Footer />
        </main>
    );
}
