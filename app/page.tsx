'use client';

import Header from '@/components/Header';
import {Hero} from '@/components/Hero';
import {useScrollSpy} from './hooks/useScrollSpy';
import Problems from '@/components/Problems';
import HowItWorks from '@/components/HowItWorks';
import AmautaSurvey from '@/components/AmautaSurvey';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import {OfflineRotator} from "@/components/Solutions";

const REGISTER_URL =
    process.env.NEXT_PUBLIC_REGISTER_URL || '/register';

const SECTION_IDS = [
    "inicio",
    "problemas",
    "como-funciona",
    "soluciones",
    "encuesta",
    "faq",
] as const;

export default function Home() {
    const activeSection = useScrollSpy([...SECTION_IDS]);

    const handleParentCTA = () =>
        window.open(REGISTER_URL, '_blank', 'noopener,noreferrer');

    return (
        <div className="relative min-h-screen bg-background select-none">
            <Header onStartClick={handleParentCTA} activeSection={activeSection}/>
            <Hero onParentCTA={handleParentCTA}/>
            <Problems/>
            <HowItWorks/>
            <OfflineRotator onStartClick={handleParentCTA}/>
            <AmautaSurvey/>
            <FAQ/>
            {/*  <PricingCallout /> */}
            <CTASection onParentCTA={handleParentCTA}/>
            <Footer/>
        </div>
    );
}
