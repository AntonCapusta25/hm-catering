import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
    return {
        title: "Huisgemaakte Maaltijden Bestellen | Vers & Gezond Bezorgen | Homemade",
        description: "Huisgemaakte maaltijden bestellen en laten bezorgen door gecertificeerde thuiskoks. Geniet van vers, authentiek en gezond avondeten zonder te koken.",
    };
}

export default async function HuisgemaakteMaaltijdenPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    Huisgemaakte Maaltijden Bestellen — Vers van de Thuiskok
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        Geen zin om te koken, maar wél trek in een voedzame en smaakvolle maaltijd? <strong>Huisgemaakte maaltijden bestellen</strong> was nog nooit zo eenvoudig. Bij Homemade koppelen we gepassioneerde thuiskoks aan liefhebbers van authentiek, onbewerkt voedsel. Geen massaproductie, maar liefdevol bereide porties die direct uit de keuken bij jou op tafel verschijnen. Laat thuisgemaakt eten bezorgen met het gemak van moderne bezorgdiensten, maar met de ziel van echt <Link href={`/${lang}/catering`} className="text-orange hover:underline">catering</Link> vakmanschap.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Hoe werkt ons platform?</h2>
                    <p>
                        Via ons overzichtelijke platform ontdek je welke thuiskoks bij jou in de buurt actief zijn. Of je nu in Amsterdam, Rotterdam of Enschede woont, wij hebben een groeiend netwerk aan culinair talent. Kies simpelweg je gewenste locatie, blader door de verschillende menu-opties (bijvoorbeeld Surinaams, Italiaans of Aziatisch), selecteer de porties en plaats je reservering. <Link href={`/${lang}/thuiskok-inhuren`} className="text-orange hover:underline">Lees meer over een thuiskok inhuren</Link>.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Veiligheid en Certificering</h2>
                    <p>
                        Jouw gezondheid en veiligheid staan voorop. Elke thuiskok op ons platform is persoonlijk gescreend en bezit de benodigde HACCP-certificaten voor voedselveiligheid (hygiëne, temperatuurcontrole). Ingrediënten worden vers gekocht of komen van vertrouwde lokale leveranciers.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Prijsrange en Bezorggebied</h2>
                    <p>
                        Omdat je rechtstreeks bij de thuiskok afneemt zonder grote tussenpartijen, blijft het betaalbaar. Prijzen variëren vaak tussen de €12 en €25 per huisgemaakte maaltijd, afhankelijk van de ingrediënten en keukenstijl. Op dit moment is ons bezorggebied voornamelijk groot-Amsterdam, Rotterdam en Twente. Buiten deze regio’s bieden koks vaak wel de mogelijkheid tot afhalen of <Link href={`/${lang}/thuiskok-amsterdam`} className="text-orange hover:underline">koken op locatie in Amsterdam</Link>.
                    </p>
                </div>

                <div className="mt-12 mb-8">
                    <a
                        href="#booking-section"
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Bestel Nu Thuisgemaakt Eten
                    </a>
                </div>
            </section>


            <Footer />
        </main>
    );
}
