// components/HowItWorks.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Smile } from 'lucide-react';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';
import { STEPS } from '@/app/utils/constants/howItWorks';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

function Step({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
      className="relative flex gap-5 items-start"
    >
      {/* Columna izquierda */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.1, type: 'spring', stiffness: 200 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black border-4 border-white shadow-md ${step.numBg} ${step.numColor}`}
        >
          {step.stepNumber}
        </motion.div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.iconBg} ${step.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(31,79,163,0.12)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`flex-1 bg-white rounded-2xl border-l-4 border border-slate-100 p-6 shadow-sm ${step.borderColor}`}
      >
        <p className="text-xs font-semibold text-amauta-orange uppercase tracking-wider mb-1">
          {t(`howItWorks:steps.${step.stepNumber}.label`)}
        </p>
        <h3 className="text-lg font-black text-amauta-blue-dark mb-2">
          {t(`howItWorks:steps.${step.stepNumber}.title`)}
        </h3>
        <p className="text-sm text-amauta-slate-600 leading-relaxed mb-4">
          {t(`howItWorks:steps.${step.stepNumber}.description`)}
        </p>
        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-amauta-blue-dark ${step.pillBg}`}>
          <Icon className="w-3.5 h-3.5" />
          {t(`howItWorks:steps.${step.stepNumber}.pill`)}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { t } = useLanguage();
  const mascotRef = useRef(null);
  const isMascotInView = useInView(mascotRef, { once: true });

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-[#FAF9F6] py-20 sm:py-24"
    >
      {/* Decorativos */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-amauta-blue-light/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-amauta-orange-light/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          badge={{ icon: Smile, text: t('howItWorks:badge') }}
          title={<>{t('howItWorks:titleLine1')}<br /><span className="text-amauta-orange">{t('howItWorks:titleLine2')}</span></>}
          description={t('howItWorks:description')}
        />

        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Columna izquierda: pasos */}
          <div className="relative">
            {/* Línea conectora */}
            <div className="absolute left-7 top-14 bottom-14 w-px border-l-2 border-dashed border-amauta-blue-light pointer-events-none" />
            <div className="flex flex-col gap-8">
              {STEPS.map((step, index) => (
                <Step key={step.stepNumber} step={step} index={index} />
              ))}
            </div>
          </div>

          {/* Columna derecha: mascota sticky */}
          <div className="hidden lg:flex items-center justify-center lg:sticky lg:top-28 self-start">
            <motion.div
              ref={mascotRef}
              initial={{ opacity: 0, x: 40 }}
              animate={isMascotInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              {/* Glow de fondo */}
              <div className="absolute inset-0 bg-amauta-orange/10 blur-3xl rounded-full scale-75 pointer-events-none" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <Image
                  src="/img/amauta-table.webp"
                  alt={t('howItWorks:mascotAlt')}
                  width={420}
                  height={520}
                  className="w-64 xl:w-80 h-auto select-none drop-shadow-2xl"
                  draggable={false}
                />
              </motion.div>

              {/* Burbuja de diálogo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isMascotInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: 'spring', stiffness: 180 }}
                className="relative mt-4 bg-white rounded-2xl shadow-md px-4 py-3 border border-amauta-blue-light max-w-[220px] text-center"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-amauta-blue-light" />
                <p className="text-xs font-bold text-amauta-blue-dark">
                  {t('howItWorks:speechBubble1')}<br />{t('howItWorks:speechBubble2')}
                </p>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}