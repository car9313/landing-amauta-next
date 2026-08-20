'use client';

import {Fragment, useRef} from 'react';
import {motion, useMotionValue, useSpring, useTransform} from 'motion/react';
import {ArrowRight, BarChart3, Brain, type LucideIcon, Pencil, School, Target, Users, WifiOff} from 'lucide-react';
import {SectionHeader} from '@/components/ui/section-header';
import {useLanguage} from '@/lib/locale/hooks/useLanguage';
import {DemoCard} from "@/components/DemoCard";

const MODULE_IDS = ['diagnostico', 'practica', 'evaluacion', 'reporte', 'escuela'] as const;
type ModuleId = (typeof MODULE_IDS)[number];

// Los 3 primeros son un ciclo real de aprendizaje; los últimos 2 son resultados
// visibles de ese ciclo (para padres y para el aula), no pasos 4 y 5.
const LOOP_IDS: ModuleId[] = ['diagnostico', 'practica', 'evaluacion'];
const OUTCOME_IDS: ModuleId[] = ['reporte', 'escuela'];

type ModuleMeta = {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    pillBg: string;
    pillText: string;
};

const MODULE_DATA: Record<ModuleId, ModuleMeta> = {
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

// Color del resplandor (spotlight) por módulo, en rgba para el radial-gradient
const SPOTLIGHT_COLOR: Record<ModuleId, string> = {
    diagnostico: 'rgba(37,99,235,0.14)',
    practica: 'rgba(244,112,31,0.14)',
    evaluacion: 'rgba(16,185,129,0.14)',
    reporte: 'rgba(147,51,234,0.14)',
    escuela: 'rgba(217,164,6,0.14)',
};

// ============================================================
// CARD con efecto tilt 3D + spotlight que sigue el cursor
// ============================================================
function ModuleCard({id}: { id: ModuleId }) {
    const {t} = useLanguage();
    const m = MODULE_DATA[id];
    const Icon = m.icon;
    const ref = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
        stiffness: 220,
        damping: 22,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
        stiffness: 220,
        damping: 22,
    });

    const spotlightBg = useTransform([mouseX, mouseY], (latest) => {
        const [x, y] = latest as number[];
        return `radial-gradient(260px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, ${SPOTLIGHT_COLOR[id]}, transparent 70%)`;
    });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{perspective: 900}}
            className="h-full"
        >
            <motion.div
                style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
                className={`group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-slate-200 border-t-[5px] ${m.borderColor} bg-white p-7 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]`}
            >
                {/* Spotlight — recortado por overflow-hidden de la card */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{background: spotlightBg}}
                />

                <span
                    style={{transform: 'translateZ(30px)'}}
                    className={`flex size-14 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white ${m.iconBg} ${m.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                >
          <Icon className="size-6"/>
        </span>

                <h3
                    style={{transform: 'translateZ(20px)'}}
                    className="mt-4 text-lg font-black tracking-tight text-amauta-blue-dark sm:text-xl"
                >
                    {t(`solutions:modules.${id}.title`)}
                </h3>
                <p
                    style={{transform: 'translateZ(15px)'}}
                    className="mt-2 text-sm font-medium leading-relaxed text-amauta-slate-600"
                >
                    {t(`solutions:modules.${id}.description`)}
                </p>
                <div style={{transform: 'translateZ(20px)'}} className="mt-auto pt-5">
          <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${m.pillBg} ${m.pillText}`}
          >
            <Icon className="h-3.5 w-3.5"/>
              {t(`solutions:modules.${id}.tag`)}
          </span>
                </div>
            </motion.div>
        </div>
    );
}

interface SolutionsProps {
    onStartClick?: () => void;
}

export default function Solutions({onStartClick}: SolutionsProps) {
    const {t} = useLanguage();

    return (
        <section
            id="soluciones"
            className="relative overflow-hidden bg-[#FAF9F6] py-12 sm:py-24"
        >
            {/* Background decorations */}
            <div
                className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-linear-to-r from-amauta-blue-light/20 to-transparent blur-3xl"/>
            <div
                className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-linear-to-l from-amauta-orange-light/10 to-transparent blur-3xl"/>

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
                <SectionHeader
                    badge={{icon: Target, text: t('solutions:badge')}}
                    title={<>{t('solutions:titleLine1')}<br/><span
                        className="text-amauta-orange">{t('solutions:titleLine2')}</span></>}
                    description={t('solutions:description')}
                />

                {/* Grupo 1: el ciclo de aprendizaje (diagnóstico → práctica → evaluación) */}
                <p className="mb-6 text-center text-xs font-black uppercase tracking-widest text-amauta-blue-dark/40">
                    El ciclo de aprendizaje
                </p>
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{once: true, margin: '-120px'}}
                    variants={{
                        hidden: {opacity: 0},
                        show: {opacity: 1, transition: {staggerChildren: 0.12}},
                    }}
                    className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0"
                >
                    {LOOP_IDS.map((id, i) => (
                        <Fragment key={id}>
                            <motion.div
                                key={id}
                                variants={{
                                    hidden: {opacity: 0, y: 30, scale: 0.98},
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {type: 'spring', stiffness: 90, damping: 16}
                                    },
                                }}
                                className="lg:flex-1"
                            >
                                <ModuleCard id={id}/>
                            </motion.div>

                            {i < LOOP_IDS.length - 1 && (
                                <div className="hidden shrink-0 items-center justify-center px-3 lg:flex">
                                    <ArrowRight className="h-6 w-6 text-amauta-blue/25"/>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </motion.div>

                {/* Grupo 2: resultados visibles (para familia y escuela) + card de demo */}
                <p className="mb-6 text-center text-xs font-black uppercase tracking-widest text-amauta-blue-dark/40">
                    Para la familia y el aula
                </p>
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{once: true, margin: '-120px'}}
                    variants={{
                        hidden: {opacity: 0},
                        show: {opacity: 1, transition: {staggerChildren: 0.12}},
                    }}
                    className="mb-12 sm:mb-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                >
                    {OUTCOME_IDS.map((id) => (
                        <motion.div
                            key={id}
                            variants={{
                                hidden: {opacity: 0, y: 30, scale: 0.98},
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {type: 'spring', stiffness: 90, damping: 16}
                                },
                            }}
                            className="h-full"
                        >
                            <ModuleCard id={id}/>
                        </motion.div>
                    ))}

                    {/* Demo Card */}
                    <motion.div
                        variants={{
                            hidden: {opacity: 0, y: 30, scale: 0.98},
                            show: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {type: 'spring', stiffness: 90, damping: 16}
                            },
                        }}
                        className="h-full"
                    >
                        <DemoCard onStartClick={onStartClick} t={t}/>
                    </motion.div>
                </motion.div>

                {/* Offline Differentiator */}
                <div
                    className="mt-12 sm:mt-24 overflow-hidden rounded-3xl bg-linear-to-r from-amauta-blue to-amauta-blue-dark p-8 text-white shadow-lg sm:p-12">
                    <div
                        className="absolute inset-0 opacity-[0.05] pointer-events-none bg-size-[20px_20px] bg-[radial-gradient(#ffffff_1px,transparent_1px)]"/>

                    <div className="relative z-10 grid items-center gap-6 md:grid-cols-12">
                        <div className="flex justify-center md:col-span-2 md:justify-start">
                            <div
                                className="flex h-16 w-16 animate-bounce-gentle items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white">
                                <WifiOff className="h-8 w-8"/>
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
