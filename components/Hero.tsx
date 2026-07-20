// components/Hero.tsx
'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  onParentCTA: () => void;
}

export function Hero({
  onParentCTA,
}: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-5 sm:px-8 bg-linear-to-br from-amauta-blue via-amauta-blue-dark/95 to-amauta-orange text-white overflow-hidden"
    >
      <div className="noise-overlay" />

      <div className="absolute top-1/4 left-1/12 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-gentle pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-amauta-orange/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce-gentle pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 px-2 py-4 text-center lg:text-left">
        <div className="space-y-6 max-w-2xl flex flex-col items-center lg:items-start w-full lg:w-[55%]">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-amauta-orange-light animate-pulse-ring">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sabiduría que aprende contigo</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
            Tu hijo tiene su propio ritmo.
            <br />
            <span className="text-amauta-orange-light">
              Ya era hora de que su educación también.
            </span>
          </h1>

          <p className="text-lg sm:text-lg lg:text-xl font-bold text-slate-200 tracking-wide leading-relaxed">
            Amauta se adapta a cada niño, funciona sin internet y hace que
            aprender sea lo mejor del día.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center lg:justify-start pt-2">
            <button
              onClick={onParentCTA}
              className="w-full sm:w-auto bg-amauta-orange text-amauta-surface font-black rounded-xl text-base px-8 py-4 shadow-lg hover:bg-amauta-orange-dark hover-lift hover-glow transition-all duration-200 cursor-pointer min-h-11 min-w-55 flex items-center justify-center gap-2 border-none"
            >
              <span>Empieza gratis con tu hijo →</span>
            </button>
          </div>

          <p className="text-xs font-bold text-slate-300 tracking-wider">
            Sin tarjeta de crédito · Acceso anticipado gratuito
          </p>


        </div>

        <div className="w-full lg:w-[45%] h-full flex justify-center items-center mb-6 lg:mb-0">
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              }}
              className="bg-white/95 backdrop-blur-md text-amauta-blue-dark text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-lg mb-4 whitespace-nowrap relative"
            >
              <span>¡Hola! Soy Amauta, ¿listo para aprender? 🦉</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 rotate-45" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-amauta-orange/30 blur-3xl rounded-full scale-75 -z-10" />
              <Image
                src="/img/mascot-hero.webp"
                alt="Mascota Amauta - Andean Condor"
                width={1627}
                height={2400}
                className="w-52 sm:w-64 md:w-80 lg:w-96 xl:w-104 h-auto select-none drop-shadow-2xl"
                priority
                draggable={false}
              />
            </motion.div>
          </div>
        </div>


      </div>
    </section>
  );
}