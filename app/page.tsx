'use client';

import Header from '@/components/Header';
import { Hero } from '@/components/Hero';
import { useMascotPage } from './hooks/useMascotPage';
import { useScrollSpy } from './hooks/useScrollSpy';
import Problems from '@/components/Problems';
import HowItWorks from '@/components/HowItWorks';
import Solutions from '@/components/Solutions';
import AmautaSurvey from '@/components/AmautaSurvey';
import FAQ from '@/components/FAQ';
import PricingCallout from '@/components/PricingCallout';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const SECTION_IDS = [
  "inicio",
  "problemas",
  "como-funciona",
  "soluciones",
  "encuesta",
  "faq",
] as const;

export default function Home() {
  const {
    handleParentCTA,
  } = useMascotPage();

  const activeSection = useScrollSpy([...SECTION_IDS]);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden select-none">
      <Header onStartClick={handleParentCTA} activeSection={activeSection} />
      <Hero onParentCTA={handleParentCTA} />
      <Problems />
      <HowItWorks />
      <Solutions onStartClick={handleParentCTA} />
      <AmautaSurvey />
      <FAQ />
      <PricingCallout />
      <CTASection onParentCTA={handleParentCTA} />
      <Footer />
    </div>
  );
}
