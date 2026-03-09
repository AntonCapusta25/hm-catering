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
        title: "Thuiskok Inhuren | Prive Chef Aan Huis in Nederland | Homemade",
        description: "Huur een professionele thuiskok voor een onvergetelijk diner aan huis. Onze gecertificeerde privechefs koken bij jou thuis in Amsterdam, Rotterdam en heel Nederland.",
    };
}

export default async function ThuiskokInhurenPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <main className="relative min-h-screen bg-cream pt-24 pb-12">
            <FAQSchema questions={[
                { question: "Moet ik zelf de boodschappen doen?", answer: "Nee, zeker niet. Bij het inhuren van een thuiskok is de inkoop inbegrepen. De chef brengt alle verse ingrediënten op de dag zelf mee." },
                { question: "Wat als mijn gasten allergieën hebben?", answer: "Dat is geen enkel probleem. Doordat de privéchef het menu op maat samenstelt, kunnen we rekening houden met lactose, gluten, notenvrij of andere allergieën." }
            ]} />
            <Navbar />

            <section className="max-w-[1000px] w-[90%] mx-auto mt-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                <h1 className="font-serif text-4xl md:text-5xl text-dark mb-6">
                    Thuiskok Inhuren — Ontdek Jouw Prive Chef Aan Huis in Nederland
                </h1>

                <div className="prose prose-lg text-dark/70 max-w-none">
                    <p>
                        Wanneer je écht wilt genieten van je eigen dinerparty zonder de stress van voorbereidingen en het schoonmaken, is een <strong>thuiskok inhuren</strong> het perfecte antwoord. Van exclusieve private dining ervaringen met 5-gangen tot <Link href={`/${lang}/catering-feest-thuis`} className="text-orange hover:underline">catering voor feesten thuis</Link>; onze privéchefs verzorgen het allemaal met passie en vakmanschap.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Landelijke Dekking, Lokale Smaak</h2>
                    <p>
                        Via ons platform kun je moeiteloos een <Link href={`/${lang}/kok-aan-huis-inhuren`} className="text-orange hover:underline">kok aan huis</Link> vinden door heel Nederland. Ben je specifiek op zoek? Ontdek direct een <Link href={`/${lang}/thuiskok-amsterdam`} className="text-orange hover:underline">thuiskok in Amsterdam</Link> of een getalenteerde <Link href={`/${lang}/thuiskok-rotterdam`} className="text-orange hover:underline">thuiskok in Rotterdam</Link>. Elk van onze aangesloten chefs brengt zijn eigen cultuur en specialiteit rechtstreeks naar jouw keukentafel.
                    </p>

                    <h2 className="font-serif text-2xl text-dark mt-8 mb-4">Waarom kiezen voor Homemade?</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Vooraf gescreende topkoks:</strong> Iedere chef is door ons geselecteerd op basis van kwaliteit en kookkunsten.</li>
                        <li><strong>Volledig ontzorgd:</strong> Inclusief boodschappen doen, tafeldekking en de afwas doen nadien.</li>
                        <li><strong>Transparante tarieven:</strong> Vanaf betaalbare menu's tot aan high-end fine dining, voor ieder budget.</li>
                        <li><strong>Direct contact met je chef:</strong> Verfijn samen het menu voor een extra persoonlijke stempel.</li>
                    </ul>

                    <h2 className="font-serif text-2xl text-dark mt-12 mb-6 text-center">Veelgestelde Vragen (FAQ)</h2>

                    <div className="space-y-6">
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Moet ik zelf de boodschappen doen?</h3>
                            <p>Nee, zeker niet. Bij het inhuren van een thuiskok is de inkoop inbegrepen. De chef brengt alle verse ingrediënten op de dag zelf mee.</p>
                        </div>
                        <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50">
                            <h3 className="font-bold text-lg text-dark mb-2">Wat als mijn gasten allergieën hebben?</h3>
                            <p>Dat is geen enkel probleem. Doordat de privéchef het menu op maat samenstelt, kunnen we rekening houden met lactose, gluten, notenvrij of andere allergieën.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-8 text-center md:text-left">
                    <a
                        href="#booking-section"
                        className="inline-block bg-orange hover:bg-orange/90 text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wide shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Prive Chef Inhuren
                    </a>
                </div>
            </section>



            <Footer />
        </main>
    );
}
