"use client";

import BookingForm from "@/components/BookingForm";
import Hero from "@/components/Hero";
import MenuGrid from "@/components/MenuGrid";
import OccasionsCarousel from "@/components/OccasionsCarousel";
import ChefCarousel from "@/components/ChefCarousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { CityProvider } from "@/contexts/CityContext";


export default function Home() {
  return (
    <CityProvider>
      <main className="relative min-h-screen bg-cream">
        <Navbar />
        <Hero />
        <MenuGrid />
        <ChefCarousel />
        <OccasionsCarousel />
        <HowItWorks />
        <BookingForm />


        <Footer />
      </main>
    </CityProvider>
  );
}
