'use client';

import { Award } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

interface CTASectionProps {
  onParentCTA: () => void;
}

export default function CTASection({ onParentCTA }: CTASectionProps) {
  const { t } = useLanguage();

  return (
    <section
      id="empieza-ahora"
      className="relative py-10 sm:py-5 bg-linear-to-tr from-amauta-blue via-amauta-blue-dark to-amauta-orange text-white text-center overflow-hidden"
    >
      <div className="noise-overlay" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-white/5 blur-3xl rounded-full animate-float-gentle pointer-events-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amauta-orange/15 blur-3xl rounded-full animate-pulse-ring pointer-events-none" />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10 space-y-6">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amauta-orange border border-white/10 shadow-sm animate-bounce-gentle">
          <Award className="w-6 h-6 animate-pulse" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-sans">
          {t('cta:title')}
        </h2>

        <p className="text-base sm:text-lg text-amauta-slate-100 font-extrabold max-w-2xl mx-auto">
          {t('cta:description')}
        </p>

        <div className="pt-4 space-y-4">
          <button
            onClick={onParentCTA}
            className="bg-amauta-orange text-amauta-surface rounded-xl font-black text-base py-4 px-10 shadow-lg hover:bg-amauta-orange-dark hover-lift hover-glow transition-all min-h-[44px] cursor-pointer inline-flex items-center gap-2 border-none"
          >
            <span>{t('cta:cta')}</span>
          </button>
          <p className="text-xs font-semibold text-amauta-slate-300">
            {t('cta:note')}
          </p>
        </div>
      </div>

      <Image
        src="/img/cta.webp"
        alt={t('cta:imageAlt')}
        width={1200}
        height={675}
        className="mx-auto mt-12 h-auto w-36 sm:w-40 md:w-48"
      />
    </section>
  );
}
