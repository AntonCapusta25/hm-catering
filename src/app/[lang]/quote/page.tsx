import { Metadata } from 'next';
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
        <main className="min-h-screen bg-gradient-soft">
            <QuizForm />
        </main>
    );
}
