'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Brain, GraduationCap, HeartHandshake, Sparkles, WifiOff} from 'lucide-react';
import {SectionHeader} from '@/components/ui/section-header';
import {AmautaButton} from "@/components/ui/AmautaPrimaryButton";
import {useLanguage} from '@/lib/locale/hooks/useLanguage';

const FEATURES = [
    {
        icon: WifiOff,
        badge: 'Siempre disponible',
        title: 'Funciona sin internet.',
        subtitle: 'Sin señal, sin problema.',
        description:
            'Una vez instalada, Amauta funciona igual en casa, en el coche o en el pueblo de los abuelos. Cuando vuelve la conexión, todo se sincroniza solo.',
        quote: 'Porque el aprendizaje no debería depender del wifi.',
        accent: 'from-amauta-blue to-amauta-blue-dark',
    },
    {
        icon: Brain,
        badge: 'Adaptación inteligente',
        title: 'Se adapta a su ritmo.',
        subtitle: 'Siempre en el nivel exacto.',
        description:
            'Amauta detecta qué domina tu hijo, qué le cuesta y ajusta cada ejercicio. No demasiado fácil, no demasiado difícil — siempre el reto justo.',
        quote: 'Cada niño aprende diferente. Amauta lo sabe.',
        accent: 'from-[#17306D] to-[#0f1f4a]',
    },
    {
        icon: GraduationCap,
        badge: 'Para el padre',
        title: 'Tú no necesitas ser experto.',
        subtitle: 'Amauta guía, tú acompañas.',
        description:
            'No hace falta que sepas pedagogía ni matemáticas. Amauta explica a tu hijo y te dice a ti qué está aprendiendo, cómo va y qué viene después.',
        quote: 'El apoyo que tu hijo necesita, sin que tengas que darlo tú solo.',
        accent: 'from-[#1a3a6e] to-[#17306D]',
    },
    {
        icon: HeartHandshake,
        badge: 'Menos estrés en casa',
        title: 'Los deberes dejan de ser una pelea.',
        subtitle: 'Más calma, más avance.',
        description:
            'Cuando Amauta explica, el niño entiende. Cuando el niño entiende, no hay frustración. Y cuando no hay frustración, aprender se convierte en lo mejor del día.',
        quote: 'Convertimos frustración en confianza.',
        accent: 'from-[#0f2a5a] to-amauta-blue-dark',
    },
];

interface OfflineRotatorProps {
    onStartClick?: () => void;
}

export function OfflineRotator({onStartClick}: OfflineRotatorProps) {
    const {t} = useLanguage();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % FEATURES.length);
        }, 3500);
    };

    useEffect(() => {
        if (!paused) startInterval();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [paused]);

    const goTo = (index: number) => {
        setCurrent(index);
        setPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setPaused(false), 6000);
    };

    const feature = FEATURES[current];
    const Icon = feature.icon;

    return (
        <section
            id="soluciones"
            className="relative overflow-hidden bg-[#FAF9F6] py-12 sm:py-20"
        >
            {/* Decorativos */}
            <div
                className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-amauta-blue-light/20 blur-3xl"/>
            <div
                className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-amauta-orange-light/10 blur-3xl"/>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">

                {/* Header de sección */}
                <SectionHeader
                    badge={{icon: Sparkles, text: 'Por qué Amauta'}}
                    title={
                        <>
                            Más que una app.{' '}
                            <span className="text-amauta-orange">
                Un acompañante de verdad.
              </span>
                        </>
                    }
                    description="Diseñada para adaptarse, explicar y estar siempre disponible — porque el aprendizaje de tu hijo no debería depender de nada externo."
                />

                {/* Bloque rotator */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: '-80px'}}
                    transition={{duration: 0.5}}
                    className={`relative overflow-hidden rounded-3xl bg-linear-to-r ${feature.accent} p-8 text-white shadow-lg sm:p-12 transition-all duration-700`}
                >
                    {/* Fondo decorativo */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"/>
                    <div
                        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"/>
                    <div
                        className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-amauta-orange/10 blur-3xl pointer-events-none"/>

                    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

                        {/* Ícono + dots */}
                        <div className="flex flex-row items-center gap-6 lg:flex-col lg:items-start lg:gap-8 lg:w-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{opacity: 0, scale: 0.8, rotate: -10}}
                                    animate={{opacity: 1, scale: 1, rotate: 0}}
                                    exit={{opacity: 0, scale: 0.8, rotate: 10}}
                                    transition={{duration: 0.35, type: 'spring', stiffness: 200}}
                                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10"
                                >
                                    <Icon className="h-8 w-8 text-white"/>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots */}
                            <div className="flex flex-row gap-2 lg:flex-col">
                                {FEATURES.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            i === current
                                                ? 'w-8 bg-amauta-orange lg:h-8 lg:w-2'
                                                : 'w-2 bg-white/30 hover:bg-white/50'
                                        }`}
                                        aria-label={`Ver beneficio ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Contenido animado */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.4, ease: 'easeOut'}}
                                    className="space-y-4"
                                >
                  <span
                      className="inline-block text-[10.5px] font-black uppercase tracking-widest text-amauta-orange-light">
                    {feature.badge}
                  </span>

                                    <div>
                                        <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-1 text-base font-semibold text-white/60">
                                            {feature.subtitle}
                                        </p>
                                    </div>

                                    <p className="max-w-xl text-sm font-medium leading-relaxed text-white/80 sm:text-base">
                                        {feature.description}
                                    </p>

                                    <blockquote
                                        className="border-t border-white/10 pt-3 text-sm font-black italic text-amauta-orange-light sm:text-base">
                                        &ldquo;{feature.quote}&rdquo;
                                    </blockquote>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* CTA */}
                        <div className="flex shrink-0 items-center lg:self-center">
                            <AmautaButton
                                variant="primary"
                                size="sm"
                                onClick={onStartClick}
                                icon="→"
                            >
                                Probar demo
                            </AmautaButton>
                        </div>

                    </div>

                    {/* Barra de progreso */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                        <motion.div
                            key={current}
                            className="h-full bg-amauta-orange"
                            initial={{width: '0%'}}
                            animate={{width: '100%'}}
                            transition={{duration: 3.5, ease: 'linear'}}
                        />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}