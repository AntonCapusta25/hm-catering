import { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { notFound } from 'next/navigation';
import { CityProvider } from '@/contexts/CityContext';

import BookingForm from '@/components/BookingForm';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import CuisineShowcase from '@/components/CuisineShowcase';
import OccasionsCarousel from '@/components/OccasionsCarousel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import ProblemSolution from '@/components/ProblemSolution';
import Testimonials from '@/components/Testimonials';
import CitiesMarquee from '@/components/CitiesMarquee';
import FAQ from '@/components/FAQ';

export const SUPPORTED_CITIES = [
  'amsterdam',
  'rotterdam',
  'enschede',
  'den-haag',
  'haarlem',
  'hengelo',
  'groningen'
];

export const SUPPORTED_LOCALES = ['en', 'nl', 'fr', 'ar', 'hi'];

export async function generateStaticParams() {
  const params: { lang: string; city: string }[] = [];

  for (const lang of SUPPORTED_LOCALES) {
    for (const city of SUPPORTED_CITIES) {
      params.push({ lang, city });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city } = await params;

  if (!SUPPORTED_CITIES.includes(city)) {
    return { title: 'Not Found' };
  }

  const t = await getDictionary(lang as any);

  // Format city name: "den-haag" -> "Den Haag"
  const formattedCityName = city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // A generic fallback if the translation dictionary doesn't have a specific local string.
  const title = (t as any).cateringseo?.amsterdamHeroTitle
    ? (t as any).cateringseo.amsterdamHeroTitle.replace('Amsterdam', formattedCityName)
    : `Catering in ${formattedCityName} | Homemade Catering`;

  const description = (t as any).cateringseo?.amsterdamHeroSubtitle
    ? (t as any).cateringseo.amsterdamHeroSubtitle.replace('Amsterdam', formattedCityName)
    : `Delicious homemade catering services in ${formattedCityName} for your next event.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://homemademeals.net/${lang}/${city}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map(l => [l, `/${l}/${city}`])
      ),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://homemademeals.net/${lang}/${city}`,
    },
  };
}

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { city, lang } = await params;

  if (!SUPPORTED_CITIES.includes(city)) {
    notFound();
  }

  const formattedCityName = city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const geoData: Record<string, { lat: string; lon: string; desc: string }> = {
    "amsterdam": { lat: "52.3676", lon: "4.9041", desc: "Capital city and major catering hub." },
    "rotterdam": { lat: "51.9225", lon: "4.47917", desc: "Dynamic port city with excellent corporate catering reach." },
    "den-haag": { lat: "52.0705", lon: "4.3007", desc: "Home to international dining and high-end events." },
    "haarlem": { lat: "52.3874", lon: "4.6462", desc: "Historical center with exquisite boutique catering events." },
    "hengelo": { lat: "52.2658", lon: "6.7930", desc: "Tech and manufacturing hub ideal for business catering." },
    "enschede": { lat: "52.2215", lon: "6.8937", desc: "Eastern center for local private and group dining." },
    "groningen": { lat: "53.2194", lon: "6.5665", desc: "Northern base for extensive celebration catering." }
  };

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Homemade Catering - ${formattedCityName}`,
    "image": "https://homemademeals.net/icon.png",
    "description": `Premium private chef and catering services located and serving the ${formattedCityName} area.`,
    "@id": `https://homemademeals.net/${lang}/${city}#localbusiness`,
    "url": `https://homemademeals.net/${lang}/${city}`,
    "telephone": "+31xxxxxxxx",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": formattedCityName,
      "addressCountry": "NL"
    },
    ...geoData[city] ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geoData[city].lat,
        "longitude": geoData[city].lon
      }
    } : {}
  };

  return (
    <CityProvider initialCity={city}>
      <main className="relative min-h-screen bg-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
        />

        <Navbar />
        <Hero city={city} />
        <Partners />
        <ProblemSolution />
        <CuisineShowcase />
        <OccasionsCarousel />
        <Testimonials />
        <CitiesMarquee />
        <HowItWorks />
        <FAQ />

        <BookingForm />

        <Footer />
      </main>
    </CityProvider>
  );
}
