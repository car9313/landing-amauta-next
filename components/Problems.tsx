// components/Problems.tsx
'use client';

import { motion, Variants } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

const PROBLEM_IDS = ['deberes', 'ritmo', 'wifi'] as const;


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 16,
    } as const, 
  },
};

export default function Problems() {
  const { t } = useLanguage();

  return (
    <section
      id="problemas"
      className="relative overflow-hidden bg-linear-to-b from-slate-100 via-white to-white py-20 sm:py-24"
    >
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-linear-to-br from-amauta-blue-light/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-linear-to-tr from-rose-100/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
<SectionHeader
          badge={{ icon: AlertCircle, text: t('problems:badge') }}
          title={<><span>{t('problems:titleLine1')}</span><br /><span className="text-amauta-orange">{t('problems:titleLine2')}</span></>}
          description={t('problems:description')}
        />

        {/* Grid de problemas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {PROBLEM_IDS.map((probId) => (
            <motion.div
              key={probId}
              variants={itemVariants}
              className="group h-full"
            >
              <Card className="relative h-full overflow-visible rounded-3xl border border-slate-200 border-t-[5px] border-t-amauta-orange bg-white p-7 pt-20 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]">
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative -mt-28 mb-6 flex h-72 w-72 items-center justify-center sm:-mt-32 sm:h-80 sm:w-80">
                    <motion.div
                      className="relative z-10 flex h-full w-full items-center justify-center"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                        className="h-full w-full"
                      >
                        <Image
                          src={`/img/img${PROBLEM_IDS.indexOf(probId) + 1}.webp`}
                          alt={t('problems:mascotAlt')}
                          width={288}
                          height={288}
                          className="h-full w-full select-none object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.16)]"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <h3 className="mb-3 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl">
                    {t(`problems:items.${probId}.title`)}
                  </h3>

                  <p className="mb-3 text-sm font-extrabold leading-relaxed text-slate-900 sm:text-base">
                    {t(`problems:items.${probId}.pain`)}
                  </p>

                  <p className="text-xs font-medium leading-relaxed text-slate-500 sm:text-sm">
                    {t(`problems:items.${probId}.consequence`)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
