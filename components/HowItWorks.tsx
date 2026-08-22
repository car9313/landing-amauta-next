'use client';

import {type CSSProperties, useEffect, useRef, useState} from 'react';
import {motion, useScroll, useTransform} from 'motion/react';
import {Smile} from 'lucide-react';
import Image from 'next/image';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Swiper as SwiperClass} from 'swiper';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {SectionHeader} from '@/components/ui/section-header';
import {STEPS} from '@/app/utils/constants/howItWorks';
import {useLanguage} from '@/lib/locale/hooks/useLanguage';

// ─── Constantes globales ───────────────────────────────────────────────────────
const CARD_HEIGHT = 360;
const CARD_GAP = 24;
const SCROLL_FACTOR = 1.5;
const TOTAL_SCROLL = (CARD_HEIGHT + CARD_GAP) * (STEPS.length - 1);
const SCROLL_DISTANCE = Math.round(TOTAL_SCROLL * SCROLL_FACTOR);
const SECTION_HEIGHT = `calc(100vh + ${SCROLL_DISTANCE}px)`;
const VISIBLE_HEIGHT = CARD_HEIGHT + 48;

// ─── Card ──────────────────────────────────────────────────────────────────────
function StepCard({step}: { step: (typeof STEPS)[number] }) {
    const {t} = useLanguage();
    const Icon = step.icon;

    return (
        <div
            className={`relative bg-white rounded-2xl border-l-4 p-6 lg:p-8 shadow-md flex flex-col ${step.borderColor}`}
            style={{height: 'var(--card-height, 360px)'}}
        >
            <div className="flex items-start gap-4 mt-2 lg:mt-3 h-full">
                {/* Ícono */}
                <div
                    className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 ${step.iconBg} ${step.iconColor}`}
                >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6"/>
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                        {/* Label */}
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${step.iconColor}`}>
                            {t(`howItWorks:steps.${step.stepNumber}.label`)}
                        </p>
                        {/* Título */}
                        <h4 className="text-base lg:text-lg font-black text-amauta-blue-dark leading-snug mb-3">
                            {t(`howItWorks:steps.${step.stepNumber}.title`)}
                        </h4>
                        {/* Descripción */}
                        <p className="text-sm lg:text-base text-slate-500 leading-relaxed">
                            {t(`howItWorks:steps.${step.stepNumber}.description`)}
                        </p>
                    </div>

                    {/* Pill */}
                    <div
                        className={`mt-4 self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 lg:px-4 lg:py-2 text-xs font-semibold ${step.pillBg}`}
                    >
                        <Icon className="w-3.5 h-3.5"/>
                        {t(`howItWorks:steps.${step.stepNumber}.pill`)}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function HowItWorks() {
    const {t} = useLanguage();
    const containerRef = useRef<HTMLElement>(null);

    const {scrollYProgress} = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -TOTAL_SCROLL]);

    // ── Móvil: carrusel scroll-driven (sticky bajo el header) ──
    const swiperRef = useRef<SwiperClass>(null);

    const mobileSlide = useTransform(scrollYProgress, (v) => {
        const threshold = 1 / STEPS.length;
        if (v < threshold) return 0;
        if (v < threshold * 2) return 1;
        return STEPS.length - 1;
    });

    const [activeSlide, setActiveSlide] = useState<number>(() => mobileSlide.get());

    useEffect(() => {
        const unsubscribe = mobileSlide.on('change', (value) => setActiveSlide(value));
        return unsubscribe;
    }, [mobileSlide]);

    useEffect(() => {
        swiperRef.current?.slideTo(activeSlide, 700);
    }, [activeSlide]);

    return (
        <section
            ref={containerRef}
            id="como-funciona"
            className="relative bg-[#FAF9F6] lg:h-[var(--section-scroll-height)]"
            style={{'--section-scroll-height': SECTION_HEIGHT} as CSSProperties}
        >
            {/* Decorativos */}
            <div
                className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-amauta-blue-light/20 blur-3xl"/>
            <div
                className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-amauta-orange-light/10 blur-3xl"/>

            {/* ── Sticky wrapper ── */}
            <div
                className="lg:sticky lg:top-[76px] flex flex-col justify-center py-12 lg:py-0 lg:min-h-screen">
                <div
                    className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 [--card-height:320px] lg:[--card-height:360px]">

                    <SectionHeader
                        className="mb-8 lg:mb-16"
                        badge={{icon: Smile, text: t('howItWorks:badge')}}
                        title={
                            <>
                                {t('howItWorks:titleLine1')}
                                <br/>
                                <span className="text-amauta-orange">
                  {t('howItWorks:titleLine2')}
                </span>
                            </>
                        }
                        description={t('howItWorks:description')}
                    />

                    {/* ── MÓVIL — Swiper horizontal ── */}
                    <div className="block lg:hidden mt-4 lg:mt-8">
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={16}
                            slidesPerView={1}
                            grabCursor
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            pagination={{clickable: true}}
                            className="[&.swiper]:touch-pan-y [&_.swiper-pagination]:static [&_.swiper-pagination]:mt-4 [&_.swiper-pagination-bullet-active]:bg-amauta-orange"
                        >
                            {STEPS.map((step) => (
                                <SwiperSlide key={step.stepNumber} className="h-auto">
                                    <div className="px-1 pb-1">
                                        <StepCard step={step}/>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* ── DESKTOP — Cards + mascota ── */}
                    <div className="hidden lg:grid grid-cols-2 gap-16 mt-10 items-center">

                        {/* Columna izquierda: ventana con scroll de cards */}
                        <div
                            className="relative overflow-hidden rounded-2xl"
                            style={{height: `${VISIBLE_HEIGHT}px`}}
                        >
                            {/* Fade superior */}
                            <div
                                className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10 pointer-events-none"/>

                            {/* Cards animadas */}
                            <motion.div
                                style={{y, gap: `${CARD_GAP}px`}}
                                className="flex flex-col absolute inset-x-0 top-4 will-change-transform px-1"
                            >
                                {STEPS.map((step) => (
                                    <StepCard key={step.stepNumber} step={step}/>
                                ))}
                            </motion.div>

                            {/* Fade inferior */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10 pointer-events-none"/>
                        </div>

                        {/* Columna derecha: mascota fija */}
                        <div className="flex items-center justify-center">
                            <motion.div
                                initial={{opacity: 0, x: 40}}
                                whileInView={{opacity: 1, x: 0}}
                                viewport={{once: true}}
                                transition={{duration: 0.6, ease: 'easeOut'}}
                                className="relative flex flex-col items-center"
                            >
                                <div
                                    className="absolute inset-0 bg-amauta-orange/10 blur-3xl rounded-full scale-75 pointer-events-none"/>

                                <motion.div
                                    animate={{y: [0, -6, 0]}}
                                    transition={{duration: 3, repeat: Infinity, ease: 'easeInOut'}}
                                    className="relative z-10"
                                >
                                    <Image
                                        src="/img/amauta-table.webp"
                                        alt={t('howItWorks:mascotAlt')}
                                        width={360}
                                        height={460}
                                        className="w-56 xl:w-72 h-auto select-none drop-shadow-2xl"
                                        draggable={false}
                                    />
                                </motion.div>

                                {/* Burbuja */}
                                <motion.div
                                    initial={{opacity: 0, scale: 0.8}}
                                    whileInView={{opacity: 1, scale: 1}}
                                    viewport={{once: true}}
                                    transition={{delay: 0.4, type: 'spring', stiffness: 180}}
                                    className="relative mt-4 bg-white rounded-2xl shadow-md px-4 py-3 border border-amauta-blue-light max-w-[200px] text-center"
                                >
                                    <div
                                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-amauta-blue-light"/>
                                    <p className="text-xs font-bold text-amauta-blue-dark">
                                        {t('howItWorks:speechBubble1')}
                                        <br/>
                                        {t('howItWorks:speechBubble2')}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
