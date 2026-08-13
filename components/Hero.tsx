// components/Hero.tsx
'use client';

import { motion } from 'motion/react';
import { Footprints, Heart, Puzzle, Sparkles, Target } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

interface HeroProps {
  onParentCTA: () => void;
}

const PILLAR_ICONS = [Target, Footprints, Puzzle, Heart];
const PILLAR_EMOJIS = ['🎯', '👣', '🧩', '💛'];

export function Hero({
  onParentCTA,
}: HeroProps) {
  const { t } = useLanguage();
  const rawPillars = t('hero:pillars', { returnObjects: true });
  const pillars = Array.isArray(rawPillars) ? rawPillars : [];

  return (
    <section
      id="inicio"
      className="relative min-h-screen  pt-28 pb-20 px-5 sm:px-8 bg-[#F2F7FF] overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-150 h-150 bg-amauta-blue-light/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="mx-auto grid items-center w-full max-w-6xl gap-12 px-5 pt-14 pb-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-4 max-w-2xl flex flex-col items-center justify-center lg:items-start"
        >
          <div
            className="inline-flex items-center gap-1.5 bg-amauta-orange-light/40 border border-amauta-orange-light px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-amauta-orange-dark"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('hero:badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight font-sans text-amauta-blue-dark">
            {t('hero:titleLine1')}{' '}
            <span className="text-amauta-orange">
              {t('hero:titleHighlight')}
            </span>
            <br />
            {t('hero:titleLine2')}
          </h1>

          <p className="text-lg sm:text-lg lg:text-xl font-medium text-amauta-blue-dark/70 leading-relaxed">
            {t('hero:subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center lg:justify-start pt-2">
            <button
              onClick={onParentCTA}
              className="w-full sm:w-auto bg-amauta-orange text-amauta-surface font-black rounded-xl text-base px-8 py-4 shadow-lg hover:bg-amauta-orange-dark hover-lift hover-glow transition-all duration-200 cursor-pointer min-h-11 min-w-55 flex items-center justify-center gap-2 border-none"
            >
              <span>{t('hero:cta')}</span>
            </button>
            <button
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-transparent text-amauta-blue-dark font-semibold rounded-xl text-base px-8 py-4 border-2 border-amauta-blue/30 hover:border-amauta-blue hover:bg-amauta-blue-light/30 transition-all duration-200 cursor-pointer min-h-11 flex items-center justify-center gap-2"
            >
              <span>{t('hero:ctaSecondary')}</span>
            </button>
          </div>

          <p className="text-xs font-medium text-amauta-blue-dark/40 tracking-wider">
            {t('hero:note')}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3 justify-center lg:justify-start pt-1">
            {pillars.map((pillar, index) => (
              <div key={pillar} className="flex items-center gap-1.5 text-xs text-amauta-blue-dark/60 font-medium">
                <span>{PILLAR_EMOJIS[index]}</span>
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full flex items-center justify-center lg:justify-end self-center"
        >
          <div className="absolute inset-0 bg-amauta-orange-light/20 rounded-full blur-3xl scale-90 pointer-events-none" />

          <div className="group relative w-full max-w-140 aspect-3/2 transition-transform duration-500 ease-out hover:scale-[1.03]">
            <Image
              src="/img/hero.webp"
              alt={t('hero:heroImageAlt')}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-contain drop-shadow-[0_18px_28px_rgba(10,29,58,0.18)]"
              style={{
                maskImage: `
                  linear-gradient(to bottom, black 82%, transparent 98%),
                  linear-gradient(to right, transparent 0%, black 16%)
                `,
                WebkitMaskImage: `
                  linear-gradient(to bottom, black 82%, transparent 98%),
                  linear-gradient(to right, transparent 0%, black 16%)
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
              priority
              draggable={false}
            />

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F2F7FF] to-transparent pointer-events-none" />

            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#F2F7FF] to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      <div className="border-t border-primary/10 bg-cream/70">
        <ul className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index];
            return (
              <li key={pillar} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-accent">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm leading-snug font-semibold text-primary">{pillar}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}