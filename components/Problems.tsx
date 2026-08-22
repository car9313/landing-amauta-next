// components/Problems.tsx
'use client';

import { useRef } from 'react';
import { motion, Variants } from 'motion/react';
import { AlertCircle, ArrowRight, Layers } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { problems } from '@/app/utils/constants/features';
import { useLanguage } from '@/lib/locale/hooks/useLanguage';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  const sectionRef = useRef<HTMLElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(max-width: 1023px)', () => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (!stackContainerRef.current || cards.length === 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stackContainerRef.current,
            start: 'top 15%',
            end: `+=${cards.length * 240}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) {
            gsap.set(card, { transformOrigin: 'top center' });
            return;
          }

          tl.to(
            cards[i - 1],
            {
              scale: 0.92 - (cards.length - 1 - i) * 0.03,
              y: -18 * i,
              opacity: 0.55,
              filter: 'blur(1.5px)',
              duration: 1,
              ease: 'power2.inOut',
            },
            `step-${i}`,
          );

          tl.fromTo(
            card,
            { yPercent: 120, opacity: 0, scale: 0.95, rotationX: 8 },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              rotationX: 0,
              duration: 1.2,
              ease: 'power2.out',
            },
            `step-${i}`,
          );
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="problemas"
      className="relative overflow-hidden bg-linear-to-b from-slate-100 via-white to-white py-12 pb-6 sm:py-24"
    >
      {/* Decorativos */}
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-linear-to-br from-amauta-blue-light/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-linear-to-tr from-rose-100/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-300/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          badge={{ icon: AlertCircle, text: t('problems:badge') }}
          title={<><span>{t('problems:titleLine1')}</span><br /><span className="text-amauta-orange">{t('problems:titleLine2')}</span></>}
          description={t('problems:description')}
        />

        {/* Vista móvil / tablet (<1024px): cards apiladas con GSAP */}
        <div className="block pt-4 lg:hidden">
          <div className="mb-6 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Layers className="h-3.5 w-3.5 text-amauta-orange" />
            <span>{t('problems:mobile.swipeHint')}</span>
          </div>

          <div
            ref={stackContainerRef}
            className="relative mx-auto flex min-h-[460px] w-full max-w-md items-center justify-center sm:min-h-[500px]"
          >
            {problems.map((prob, idx) => (
              <div
                key={prob.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="absolute inset-x-0 top-0 w-full"
                style={{ zIndex: 10 + idx, opacity: idx === 0 ? undefined : 0 }}
              >
                <Card
                  className={`relative w-full rounded-3xl border border-slate-200/90 border-t-[5px] ${prob.accentBorder} bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-7`}
                >
                  <div className="relative flex flex-col items-center text-center">

                    {/* Imagen */}
                    <div className="mb-3 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
                      <Image
                        src={prob.imgSrc}
                        alt={t(`problems:items.${prob.id}.title`)}
                        width={288}
                        height={288}
                        sizes="(max-width: 640px) 144px, 176px"
                        className="h-full w-full select-none object-contain drop-shadow-[0_12px_20px_rgba(15,23,42,0.1)]"
                      />
                    </div>

                    {/* Label */}
                    <span className={`mb-1.5 text-xs font-black uppercase tracking-wider ${prob.labelColor}`}>
                      {t(`problems:items.${prob.id}.label`)}
                    </span>

                    {/* Título */}
                    <h3 className="mb-2 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl">
                      {t(`problems:items.${prob.id}.title`)}
                    </h3>

                    {/* Pain */}
                    <p className="mb-3.5 text-xs font-medium leading-relaxed text-amauta-slate-600 sm:text-sm">
                      {t(`problems:items.${prob.id}.pain`)}
                    </p>

                    {/* Consecuencia */}
                    <div className="flex w-full items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left">
                      <ArrowRight className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${prob.bulletColor}`} />
                      <p className="text-xs font-semibold leading-relaxed text-amauta-slate-500">
                        {t(`problems:items.${prob.id}.consequence`)}
                      </p>
                    </div>

                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Vista desktop (>=1024px): grilla 3 columnas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          className="hidden gap-8 pt-12 lg:grid lg:grid-cols-3"
        >
          {problems.map((prob) => (
            <motion.div
              key={prob.id}
              variants={itemVariants}
              className="group h-full"
            >
              <Card className={`relative h-full overflow-visible rounded-3xl border border-slate-200 border-t-[5px] ${prob.accentBorder} bg-white p-7 pt-20 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]`}>
                <div className="relative flex flex-col items-center text-center">

                  {/* Imagen */}
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
                        whileHover={{ scale: 1.08, rotate: -2 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                        className="h-full w-full"
                      >
                        <Image
                          src={prob.imgSrc}
                          alt={t(`problems:items.${prob.id}.title`)}
                          width={288}
                          height={288}
                          className="h-full w-full select-none object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.12)]"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Label */}
                  <span className={`mb-2 text-xs font-semibold uppercase tracking-wider ${prob.labelColor}`}>
                    {t(`problems:items.${prob.id}.label`)}
                  </span>

                  {/* Título */}
                  <h3 className="mb-3 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl">
                    {t(`problems:items.${prob.id}.title`)}
                  </h3>

                  {/* Pain */}
                  <p className="mb-4 text-sm font-medium leading-relaxed text-amauta-slate-600 sm:text-base">
                    {t(`problems:items.${prob.id}.pain`)}
                  </p>

                  {/* Consecuencia */}
                  <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-left">
                    <ArrowRight className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${prob.bulletColor}`} />
                    <p className="text-xs font-medium leading-relaxed text-amauta-slate-500">
                      {t(`problems:items.${prob.id}.consequence`)}
                    </p>
                  </div>

                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
