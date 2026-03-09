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
        <main className="min-h-screen bg-dark flex flex-col font-sans text-cream">
            <Navbar />

            <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-5">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                            {lang === 'nl' ? 'Plan Uw Evenement' : 'Plan Your Event'}
                        </h1>
                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                            {lang === 'nl'
                                ? 'Beantwoord een paar snelle vragen en wij sturen u een gepersonaliseerde offerte met de perfecte chef voor uw gelegenheid.'
                                : 'Answer a few quick questions and we\'ll send you a customized quote with the perfect chef for your occasion.'}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-12 shadow-2xl backdrop-blur-md">
                        <QuizForm />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
