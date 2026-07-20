'use client';

import { motion } from 'motion/react';
import { Smile, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/section-header';
import { STEPS } from '@/app/utils/constants/howItWorks';


export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-[#FAF9F6] py-20 sm:py-24"
    >
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-linear-to-r from-amauta-blue-light/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-linear-to-l from-amauta-orange-light/10 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          badge={{ icon: Smile, text: "Sin jerga técnica compleja" }}
          title={<>Cómo funciona Amauta</>}
          description="Un ciclo natural donde el estudiante toma el timón de su propio avance y los adultos tienen visibilidad plena."
        />

        <ol className="relative space-y-14 md:space-y-24">
          {/* Línea de tiempo desktop */}
          <div className="pointer-events-none absolute bottom-4 left-4.5 top-4 hidden w-px border-l border-dashed border-amauta-orange md:left-1/2 md:block md:-translate-x-1/2" />

          {STEPS.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = step.stepNumber % 2 === 0;

            return (
              <motion.li
                key={step.stepNumber}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`relative flex flex-col gap-5 md:gap-10 ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                } md:items-start`}
              >
                {/* Imagen */}
                <div className="w-full md:w-[44%]">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="relative w-full overflow-hidden rounded-[28px] bg-white p-3 shadow-md"
                  >
                    <div className="relative h-70 w-full overflow-hidden rounded-[22px] bg-white sm:h-85 lg:h-112.5">
                      <motion.div
                        initial={{ scale: 1.03 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: '-120px' }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
                        className={`h-full w-full ${step.imageMotionClass}`}
                      >
                        <Image
                          src={step.imageSrc}
                          alt={step.imageAlt}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover object-center"
                          priority={index === 0} // La primera imagen puede tener prioridad
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Marcador desktop */}
                <div className="hidden md:flex md:w-16 md:shrink-0 md:justify-center">
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-amauta-blue text-lg font-black text-white shadow-md"
                    aria-hidden="true"
                  >
                    {step.stepNumber}
                    <span className="absolute inset-0 rounded-full ring-8 ring-amauta-blue/10" />
                  </motion.div>
                </div>

                {/* Card */}
                <div className="w-full md:w-[44%]">
                  <motion.article
                    initial={{ opacity: 0, x: isEven ? 35 : -35, y: 8 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-3xl border bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8 ${step.borderColorClass}`}
                  >
                    {/* Badge mobile */}
                    <div className="mb-4 inline-flex md:hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                        {step.stepNumber}
                      </span>
                      Mecanismo {step.stepNumber}
                    </div>

                    <div className="mb-2.5 hidden md:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amauta-orange">
                      <span>Mecanismo {step.stepNumber}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>

                    <h3 className="mb-2 text-xl font-black tracking-tight text-amauta-blue-dark sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mb-4 text-xs font-semibold text-amauta-blue/70 sm:text-sm">
                      {step.subtitle}
                    </p>

                    <p className="text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                      {step.description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                        <IconComponent className="h-3.5 w-3.5 text-amauta-orange" />
                      </span>
                      {step.imageCaption}
                    </div>
                  </motion.article>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}