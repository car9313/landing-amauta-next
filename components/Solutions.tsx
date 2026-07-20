'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Flame, WifiOff, Zap, Target, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

const SOLUTIONS = [
  {
    icon: Zap,
    image: '/img/solution-adaptive.webp',
    title: 'Se adapta a su ritmo',
    description:
      'No todos aprenden igual. Amauta ajusta los ejercicios a lo que tu hijo sabe y necesita practicar, paso a paso.',
  },
  {
    icon: WifiOff,
    image: '/img/solution-offline.webp',
    title: 'Funciona sin internet',
    description:
      'La mayoría de apps se quedan en blanco sin wifi. Amauta funciona donde sea — en casa, en el coche, de viaje.',
  },
  {
    icon: BarChart3,
    image: '/img/solution-progress.webp',
    title: 'Ves su progreso real',
    description:
      'Nada de notas genéricas. Sabes exactamente qué domina y qué necesita reforzar, en tiempo real.',
  },
];

interface SolutionsProps {
  onStartClick?: () => void;
}

export default function Solutions({ onStartClick }: SolutionsProps) {
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
          badge={{ icon: Target, text: "La solución" }}
          title={<>Amauta no es otra app educativa.<br /><span className="text-amauta-orange">Es la que necesitabas.</span></>}
          description="No creamos otro contenido genérico. Creamos la herramienta que faltaba para que tu hijo aprenda a su ritmo, sin depender del wifi."
        />

        {/* 3 Solution Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
          className="mb-24 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
        >
          {SOLUTIONS.map((solution) => (
            <motion.div
              key={solution.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 90, damping: 16 },
                },
              }}
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
                        transition={{
                          type: 'spring',
                          stiffness: 180,
                          damping: 14,
                        }}
                        className="h-full w-full"
                      >
                        <Image
                          src={solution.image}
                          alt={solution.title}
                          width={288}
                          height={288}
                          className="h-full w-full select-none object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.16)]"
                        />
                      </motion.div>
                    </motion.div>

                  </div>

                  <h3 className="mb-3 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl">
                    {solution.title}
                  </h3>

                  <p className="text-sm font-medium leading-relaxed text-slate-600">
                    {solution.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Early Adopters Section */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amauta-orange-light/25 bg-amauta-orange-light/25 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-amauta-orange-dark">
              <Flame className="h-3.5 w-3.5 animate-pulse" />
              <span>Acceso anticipado</span>
            </span>

            <h2 className="text-3xl font-black leading-tight text-amauta-blue-dark sm:text-4xl">
              Sé de los primeros en usar Amauta
            </h2>

            <p className="text-base font-semibold leading-relaxed text-slate-700 sm:text-lg">
              Las familias que entran ahora no solo usan la app — ayudan a
              construirla. Tu feedback decide qué se desarrolla primero, y
              mientras dure esta fase, todo es completamente gratuito. Sin
              compromisos, sin costos ocultos.
            </p>

            <div className="mx-auto max-w-lg space-y-2 pt-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xl select-none">🎯</span>
                <div>
                  <span className="block text-sm font-black text-amauta-blue-dark">
                    Acceso total desde el día 1
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Todas las funciones sin restricciones
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xl select-none">💬</span>
                <div>
                  <span className="block text-sm font-black text-amauta-blue-dark">
                    Tu opinión crea la app
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Decides qué se construye primero
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xl select-none">🎁</span>
                <div>
                  <span className="block text-sm font-black text-amauta-blue-dark">
                    100% gratis mientras dure el early access
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Sin tarjeta, sin compromisos
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onStartClick}
                className="bg-amauta-orange text-amauta-surface font-black rounded-xl text-base px-8 py-4 shadow-lg hover:bg-amauta-orange-dark hover-lift hover-glow transition-all duration-200 cursor-pointer min-h-11 min-w-55 flex items-center justify-center gap-2 border-none mx-auto"
              >
                <span>Empieza gratis ahora →</span>
              </button>
            </div>
          </motion.div>
        </div>

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
                Siempre disponible. Pase lo que pase con el wifi.
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight leading-tight font-sans sm:text-3xl">
                La mayoría de apps educativas necesitan conexión para funcionar.
                Amauta no.
              </h3>
              <p className="max-w-3xl text-sm font-semibold leading-relaxed text-white/90 sm:text-base">
                Una vez instalada en el dispositivo de tu hijo, funciona igual con
                wifi que sin él — en casa, en el coche, en el pueblo de los
                abuelos. Cuando vuelve la conexión, todo se sincroniza solo. Sin
                perder nada, sin que tu hijo tenga que hacer nada.
              </p>

              <div className="mt-4 border-t border-white/10 pt-2">
                <blockquote className="text-base font-black italic text-amauta-orange-light sm:text-lg">
                  &ldquo;Porque el aprendizaje no debería depender del wifi.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
