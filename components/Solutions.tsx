'use client';

import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Brain, Pencil, School, Target, Users, WifiOff } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

const MODULE_IDS = ['diagnostico', 'practica', 'evaluacion', 'reporte', 'escuela'] as const;

const MODULE_DATA: Record<
  (typeof MODULE_IDS)[number],
  {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    pillBg: string;
    pillText: string;
  }
> = {
  diagnostico: {
    icon: Brain,
    iconBg: 'bg-amauta-blue-light',
    iconColor: 'text-amauta-blue',
    borderColor: 'border-t-amauta-blue',
    pillBg: 'bg-amauta-blue-light/60',
    pillText: 'text-amauta-blue-dark',
  },
  practica: {
    icon: Pencil,
    iconBg: 'bg-amauta-orange-light',
    iconColor: 'text-amauta-orange-dark',
    borderColor: 'border-t-amauta-orange',
    pillBg: 'bg-amauta-orange-light/50',
    pillText: 'text-amauta-orange-dark',
  },
  evaluacion: {
    icon: BarChart3,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    borderColor: 'border-t-emerald-400',
    pillBg: 'bg-emerald-50',
    pillText: 'text-emerald-800',
  },
  reporte: {
    icon: Users,
    iconBg: 'bg-amauta-purple-500/10',
    iconColor: 'text-amauta-purple-600',
    borderColor: 'border-t-amauta-purple-500',
    pillBg: 'bg-amauta-purple-500/10',
    pillText: 'text-amauta-purple-600',
  },
  escuela: {
    icon: School,
    iconBg: 'bg-amauta-yellow-100',
    iconColor: 'text-amauta-yellow-600',
    borderColor: 'border-t-amauta-yellow-600',
    pillBg: 'bg-amauta-yellow-100/70',
    pillText: 'text-amauta-yellow-600',
  },
};

interface SolutionsProps {
  onStartClick?: () => void;
}

export default function Solutions({ onStartClick }: SolutionsProps) {
  const { t } = useLanguage();

  return (
    <section
      id="soluciones"
      className="relative overflow-hidden bg-[#FAF9F6] py-20 sm:py-24"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-linear-to-r from-amauta-blue-light/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-linear-to-l from-amauta-orange-light/10 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          badge={{ icon: Target, text: t('solutions:badge') }}
          title={<>{t('solutions:titleLine1')}<br /><span className="text-amauta-orange">{t('solutions:titleLine2')}</span></>}
          description={t('solutions:description')}
        />

        {/* 5 Module Cards */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
          className="mb-24 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {MODULE_IDS.map((id) => {
            const m = MODULE_DATA[id];
            const Icon = m.icon;
            return (
              <motion.li
                key={id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.98 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: 'spring', stiffness: 90, damping: 16 },
                  },
                }}
                className="h-full"
              >
                <div className={`flex h-full flex-col items-center rounded-3xl border border-slate-200 border-t-[5px] ${m.borderColor} bg-white p-7 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]`}>
                  <span className={`flex size-14 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white ${m.iconBg} ${m.iconColor}`}>
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl">
                    {t(`solutions:modules.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-amauta-slate-600">
                    {t(`solutions:modules.${id}.description`)}
                  </p>
                  <div className="mt-auto pt-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${m.pillBg} ${m.pillText}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {t(`solutions:modules.${id}.tag`)}
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}

          {/* Demo Card */}
          <motion.li
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.98 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: 'spring', stiffness: 90, damping: 16 },
              },
            }}
            className="h-full"
          >
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-amauta-blue-dark p-7 text-white shadow-[0_8px_30px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amauta-orange/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amauta-blue/40 blur-2xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-amauta-orange-light">
                  <School className="h-3.5 w-3.5" />
                  <span>{t('solutions:darkCard.badge')}</span>
                </span>
                <p className="mt-4 text-xl font-black leading-snug sm:text-2xl">
                  {t('solutions:darkCard.text')}
                </p>
              </div>
              <button
                onClick={onStartClick}
                className="relative mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-amauta-orange px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-amauta-orange-dark hover-lift hover-glow"
              >
                <span>{t('solutions:darkCard.cta')}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.li>
        </motion.ul>

        {/* Offline Differentiator */}
        <div className="mt-24 overflow-hidden rounded-3xl bg-linear-to-r from-amauta-blue to-amauta-blue-dark p-8 text-white shadow-lg sm:p-12">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-size-[20px_20px] bg-[radial-gradient(#ffffff_1px,transparent_1px)]" />

          <div className="relative z-10 grid items-center gap-6 md:grid-cols-12">
            <div className="flex justify-center md:col-span-2 md:justify-start">
              <div className="flex h-16 w-16 animate-bounce-gentle items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white">
                <WifiOff className="h-8 w-8" />
              </div>
            </div>

            <div className="space-y-4 text-center md:col-span-10 md:text-left">
              <span className="block text-[10.5px] font-black uppercase tracking-widest text-amauta-orange-light">
                {t('solutions:offlineBadge')}
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight leading-tight font-sans sm:text-3xl">
                {t('solutions:offlineTitle')}
              </h3>
              <p className="max-w-3xl text-sm font-semibold leading-relaxed text-white/90 sm:text-base">
                {t('solutions:offlineText')}
              </p>

              <div className="mt-4 border-t border-white/10 pt-2">
                <blockquote className="text-base font-black italic text-amauta-orange-light sm:text-lg">
                  &ldquo;{t('solutions:offlineQuote')}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
