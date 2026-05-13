import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizForm from '@/components/QuizForm';

type Props = {
    params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;

    return {
        title: lang === 'nl'
            ? 'Vraag een Offerte Aan | Homemade Catering'
            : 'Request a Quote | Homemade Catering',
        description: lang === 'nl'
            ? 'Ontvang binnen 24 uur een gepersonaliseerde offerte voor uw volgende evenement.'
            : 'Get a customized quote for your next event within 24 hours.',
        robots: {
            index: false, // Prevents SEO indexing of the pure form page (optional but common practice)
            follow: true,
        }
    };
}

export default async function QuotePage({ params }: Props) {
    const { lang } = await params;

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-[#2D2420]">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center pt-24 md:pt-32 pb-20 px-5">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <a 
                            href={`/${lang}`}
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#2D2420] transition-colors bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-full border border-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                            {lang === 'nl' ? 'Terug naar website' : 'Back to website'}
                        </a>
                    </div>
                    <div className="hidden md:block text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                            {lang === 'nl' ? 'Plan Uw Evenement' : 'Plan Your Event'}
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                            {lang === 'nl'
                                ? 'Beantwoord een paar snelle vragen en wij sturen u een gepersonaliseerde offerte met de perfecte chef voor uw gelegenheid.'
                                : 'Answer a few quick questions and we\'ll send you a customized quote with the perfect chef for your occasion.'}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 md:p-12 shadow-2xl">
                        <QuizForm />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
