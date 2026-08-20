'use client';

import {Award} from 'lucide-react';
import Image from 'next/image';
import {useLanguage} from '@/lib/locale/hooks/useLanguage';
import {AmautaButton} from '@/components/ui/AmautaPrimaryButton';

interface CTASectionProps {
    onParentCTA: () => void;
}

export default function CTASection({onParentCTA}: CTASectionProps) {
    const {t} = useLanguage();

    return (
        <section
            id="empieza-ahora"
            className="relative py-12 sm:py-24 bg-linear-to-tr from-amauta-blue via-amauta-blue-dark to-amauta-orange text-white overflow-hidden"
        >
            <div className="noise-overlay"/>
            <div
                className="absolute top-1/2 left-1/4 w-72 h-72 bg-white/5 blur-3xl rounded-full animate-float-gentle pointer-events-none"/>
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amauta-orange/15 blur-3xl rounded-full animate-pulse-ring pointer-events-none"/>

            {/* Fade de salida — el borde inferior converge siempre al navy del footer,
          sin importar en qué punto del gradiente diagonal esté */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-linear-to-b from-transparent to-amauta-blue-dark"/>

            <div
                className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center gap-10 md:gap-6">
                {/* Columna de texto */}
                <div className="text-center md:text-left space-y-6">

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-sans">
                        {t('cta:title')}
                    </h2>

                    <p className="text-base sm:text-lg text-amauta-slate-100 font-extrabold max-w-md mx-auto md:mx-0">
                        {t('cta:description')}
                    </p>

                    <div className="pt-2 space-y-4 flex flex-col items-center md:items-start">
                        <AmautaButton variant="primary" onClick={onParentCTA} className="self-center md:self-start">
                            {t('cta:cta')}
                        </AmautaButton>

                        <p className="text-xs font-semibold text-amauta-slate-300">
                            {t('cta:note')}
                        </p>

                    </div>
                </div>

                {/* Columna de mascota — contenida, sin sangrar hacia el footer */}
                <div
                    className="flex flex-col items-center gap-8 justify-center md:justify-end order-first md:order-last">
                    <div
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto md:mx-0 text-amauta-orange border border-white/10 shadow-sm animate-bounce-gentle">
                        <Award className="w-6 h-6 animate-pulse"/>
                    </div>

                    <Image
                        src="/img/cta.webp"
                        alt={t('cta:imageAlt')}
                        width={1200}
                        height={675}
                        className="h-auto w-40 sm:w-48 md:w-56"
                    />
                </div>
            </div>
        </section>
    );
}