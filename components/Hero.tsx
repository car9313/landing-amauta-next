'use client';

import {useEffect, useRef, useState} from 'react';
import {motion, useInView, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {CreditCard, Footprints, Heart, Puzzle, Sparkles, Target, type LucideIcon,} from 'lucide-react';
import Image from 'next/image';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {Swiper as SwiperClass} from 'swiper';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {useLanguage} from '@/lib/locale/hooks/useLanguage';
import {AmautaButton} from "@/components/ui/AmautaPrimaryButton";

interface HeroProps {
    onParentCTA: () => void;
}

const PILLAR_ICONS = [Target, Footprints, Puzzle, Heart];
const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as const;

// ─── Contenido de un pilar (carrusel móvil y grilla sm+) ───────────────────────
function PillarItem({Icon, text}: {Icon: LucideIcon; text: string}) {
    return (
        <>
            <span
                className="
                    flex size-12 shrink-0 items-center justify-center
                    rounded-full bg-amauta-orange/10 text-amauta-orange
                    transition-colors duration-200
                    group-hover:bg-amauta-orange/20
                    group-hover:text-amauta-orange-dark
                "
            >
                <Icon className="size-6"/>
            </span>
            <span
                className="
                    text-base font-semibold leading-snug
                    text-amauta-blue-dark/80
                    transition-colors duration-200
                    group-hover:text-amauta-blue-dark
                    sm:text-lg
                "
            >
                {text}
            </span>
        </>
    );
}

export function Hero({onParentCTA}: HeroProps) {
    const {t} = useLanguage();
    const shouldReduceMotion = useReducedMotion();

    const rawPillars = t('hero:pillars', {returnObjects: true});
    const pillars = Array.isArray(rawPillars) ? rawPillars : [];

    // ── Carrusel móvil: scroll-driven + autoplay (híbrido) ──
    const carouselRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperClass>(null);
    const carouselInView = useInView(carouselRef, {amount: 0.2});

    const {scrollYProgress} = useScroll({
        target: carouselRef,
        offset: ['start 1.2', 'end -0.2'],
    });

    const scrollSlide = useTransform(scrollYProgress, (v) => {
        const threshold = 1 / pillars.length;
        for (let i = 0; i < pillars.length - 1; i++) {
            if (v < threshold * (i + 1)) return i;
        }
        return pillars.length - 1;
    });

    const [activeSlide, setActiveSlide] = useState<number>(0);
    const lastScrollChangeRef = useRef<number>(0);

    useEffect(() => {
        lastScrollChangeRef.current = Date.now();
    }, []);

    useEffect(() => {
        const unsubscribe = scrollSlide.on('change', (value) => {
            setActiveSlide(value);
            lastScrollChangeRef.current = Date.now();
        });
        return unsubscribe;
    }, [scrollSlide]);

    useEffect(() => {
        swiperRef.current?.slideTo(activeSlide, 700);
    }, [activeSlide]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.matchMedia('(max-width: 639px)').matches) return;
        if (!carouselInView) return;
        const id = setInterval(() => {
            if (Date.now() - lastScrollChangeRef.current < 4000) return;
            setActiveSlide((prev) => (prev + 1) % pillars.length);
        }, 4000);
        return () => clearInterval(id);
    }, [pillars.length, carouselInView]);

    const reveal = {
        hidden: {opacity: 0, y: shouldReduceMotion ? 0 : 24},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: shouldReduceMotion ? 0 : 0.7, ease: EASE_OUT_BACK},
        },
    };

    return (
        <section
            id="inicio"
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-linear-to-b from-[#F2F7FF] via-white to-[#F2F7FF]
                px-5 pt-24 sm:px-8 lg:pt-28
            "
        >
            {/* Glows */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none absolute -left-60 top-20 h-125 w-125
                    rounded-full bg-amauta-blue-light/20 blur-3xl
                "
            />
            <motion.div
                aria-hidden="true"
                animate={
                    shouldReduceMotion
                        ? undefined
                        : {scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6]}
                }
                transition={
                    shouldReduceMotion
                        ? undefined
                        : {duration: 8, repeat: Infinity, ease: 'easeInOut'}
                }
                className="
                    pointer-events-none absolute right-[0%] top-[8%] h-125 w-125
                    rounded-full bg-[radial-gradient(circle,rgba(244,112,31,0.18)_0%,rgba(244,112,31,0)_70%)]
                "
            />

            {/* Grid principal */}
            <div
                className="
                    relative z-10 mx-auto grid w-full max-w-7xl items-start gap-6
                    pb-12 pt-10 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-16 xl:gap-10
                "
            >
                {/* Texto */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {staggerChildren: shouldReduceMotion ? 0 : 0.1},
                        },
                    }}
                    className="
                        order-2 flex w-full max-w-140 flex-col items-center text-center
                        lg:order-0 lg:items-start lg:text-left lg:-mr-8
                    "
                >
                    {/* Badge */}
                    <motion.div
                        variants={reveal}
                        className="
                            inline-flex items-center gap-2 rounded-full border border-amauta-orange/30
                            bg-amauta-orange-light/40 px-5 py-2.5 text-xs font-semibold tracking-wide
                            text-amauta-orange-dark shadow-[0_4px_20px_rgba(244,112,31,0.15)] backdrop-blur-sm
                        "
                    >
                        <motion.span
                            animate={
                                shouldReduceMotion
                                    ? undefined
                                    : {rotate: [0, -10, 10, 0], scale: [1, 1.1, 1]}
                            }
                            transition={
                                shouldReduceMotion
                                    ? undefined
                                    : {duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut'}
                            }
                        >
                            <Sparkles className="size-3.5"/>
                        </motion.span>
                        <span>{t('hero:badge')}</span>
                    </motion.div>

                    {/* Título */}
                    <motion.h1
                        variants={reveal}
                        className="
                            mt-8 max-w-140 font-sans text-4xl font-black leading-[1.05]
                            tracking-tight text-amauta-blue-dark sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]
                        "
                    >
                        {t('hero:titleLine1')}{' '}
                        <span className="text-amauta-orange">{t('hero:titleHighlight')}</span>
                        <br/>
                        {t('hero:titleLine2')}
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        variants={reveal}
                        className="
                            mt-8 max-w-135 text-lg font-medium leading-relaxed
                            text-amauta-blue-dark/80 sm:text-xl lg:text-2xl
                        "
                    >
                        {t('hero:subtitle')}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={reveal}
                        className="
                            mt-10 flex w-full flex-col items-center gap-4
                            sm:w-auto sm:flex-row lg:justify-start
                        "
                    >
                        <AmautaButton
                            variant="primary"
                            onClick={onParentCTA}
                            icon="→"  // o <ArrowRight className="size-5" />
                            className="min-w-55"
                        >
                            {t('hero:cta')}
                        </AmautaButton>


                        <AmautaButton
                            variant="secondary"
                            onClick={() =>
                                document.getElementById('como-funciona')?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                            }
                            icon="→"
                            className="min-w-50"
                        >
                            {t('hero:ctaSecondary')}
                        </AmautaButton>
                    </motion.div>

                    {/* Trust signal */}
                    {/* Trust signal - destacada */}
                    <motion.div
                        variants={reveal}
                        className="
        mt-6
        flex flex-wrap items-center justify-center gap-4
        lg:justify-start
    "
                    >
    <span className="
        flex items-center gap-2
        bg-amauta-orange/10
        border border-amauta-orange/20
        rounded-full
        px-4 py-2
        text-sm font-semibold
        text-amauta-orange-dark
        shadow-sm
    ">
        <span className="text-base"><CreditCard/></span> {/* o un icono de Lucide */}
        {t('hero:note')}
    </span>
                    </motion.div>


                </motion.div>

                {/* =====================================================
                    IMAGEN CON MÁSCARA SIMPLE (CORREGIDA)
                ===================================================== */}
                <motion.div
                    initial={{opacity: 0, x: shouldReduceMotion ? 0 : 30}}
                    animate={{opacity: 1, x: 0}}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.8,
                        delay: shouldReduceMotion ? 0 : 0.15,
                        ease: EASE_OUT_BACK,
                    }}
                    className="order-1 relative flex w-full items-center justify-center lg:order-0 lg:-ml-8"
                >
                    {/* Glow interno */}
                    <motion.div
                        aria-hidden="true"
                        animate={
                            shouldReduceMotion
                                ? undefined
                                : {scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5]}
                        }
                        transition={
                            shouldReduceMotion
                                ? undefined
                                : {duration: 6, repeat: Infinity, ease: 'easeInOut'}
                        }
                        className="
                            pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%]
                            -translate-x-1/2 -translate-y-1/2 rounded-full
                            bg-[radial-gradient(circle,rgba(244,112,31,0.20)_0%,rgba(244,112,31,0)_70%)]
                        "
                    />

                    {/* Contenedor de la imagen con máscara simple */}
                    <motion.div
                        animate={
                            shouldReduceMotion
                                ? undefined
                                : {y: [0, -8, 0]}
                        }
                        transition={
                            shouldReduceMotion
                                ? undefined
                                : {duration: 6, repeat: Infinity, ease: 'easeInOut'}
                        }
                        className="relative z-10 aspect-square w-full max-w-155"
                        style={{
                            maskImage: `
                                linear-gradient(
                                    to bottom,
                                    transparent 0%,
                                    black 25%,
                                    black 75%,
                                    transparent 100%
                                )
                            `,
                            WebkitMaskImage: `
                                linear-gradient(
                                    to bottom,
                                    transparent 0%,
                                    black 25%,
                                    black 75%,
                                    transparent 100%
                                )
                            `,
                        }}
                    >
                        <Image
                            src="/img/hero.webp"
                            alt={t('hero:heroImageAlt')}
                            fill
                            priority
                            draggable={false}
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 600px"
                            className="object-contain drop-shadow-[0_20px_30px_rgba(10,29,58,0.08)]"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Pilares */}
            <motion.div
                initial={{opacity: 0, y: shouldReduceMotion ? 0 : 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.2}}
                transition={{duration: shouldReduceMotion ? 0 : 0.7, ease: EASE_OUT_BACK}}
                className="
                    relative z-10
                    border-t border-amauta-blue-dark/8
                    bg-white/80
                    shadow-[0_-8px_30px_rgba(10,29,58,0.04)]
                    backdrop-blur-sm
                    rounded-3xl
                "
            >
                {/* Móvil (<sm): carrusel con 1 pilar por slide */}
                <div ref={carouselRef} className="sm:hidden">
                    <div className="relative mx-auto h-40 w-full max-w-7xl px-4 py-2">
                        <Swiper
                            modules={[Pagination]}
                            slidesPerView={1}
                            spaceBetween={16}
                            grabCursor
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={(swiper) => {
                                setActiveSlide(swiper.activeIndex);
                                lastScrollChangeRef.current = Date.now();
                            }}
                            pagination={{clickable: true}}
                            className="h-full [&.swiper]:touch-pan-y [&_.swiper-pagination-bullet-active]:bg-amauta-orange"
                        >
                            {pillars.map((pillar, index) => {
                                const Icon = PILLAR_ICONS[index];
                                return (
                                    <SwiperSlide key={pillar} className="flex items-center justify-center">
                                        <div
                                            className="
                                                group flex w-full items-center gap-4
                                                rounded-2xl bg-white/60 px-4 py-5
                                                border border-transparent
                                            "
                                        >
                                            <PillarItem Icon={Icon} text={pillar}/>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>

                {/* Tablet (sm) y desktop (lg): grilla */}
                <ul
                    className="
                        mx-auto hidden w-full max-w-7xl
                        gap-4
                        sm:grid sm:grid-cols-2 sm:gap-5 sm:px-5 sm:py-8
                        lg:grid-cols-4
                    "
                >
                    {pillars.map((pillar, index) => {
                        const Icon = PILLAR_ICONS[index];
                        return (
                            <motion.li
                                key={pillar}
                                initial={{opacity: 0, y: shouldReduceMotion ? 0 : 12}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true, amount: 0.3}}
                                transition={{
                                    duration: shouldReduceMotion ? 0 : 0.5,
                                    delay: shouldReduceMotion ? 0 : index * 0.08,
                                    ease: EASE_OUT_BACK,
                                }}
                                whileHover={
                                    shouldReduceMotion
                                        ? undefined
                                        : {y: -4, scale: 1.02}
                                }
                                className="
                                    group
                                    flex items-center gap-4
                                    rounded-2xl
                                    px-4 py-5
                                    bg-white/60
                                    border border-transparent
                                    transition-all duration-200
                                    hover:bg-amauta-orange/5
                                    hover:border-amauta-orange/20
                                    hover:shadow-md
                                    sm:px-5 sm:py-4
                                "
                            >
                                <PillarItem Icon={Icon} text={pillar}/>
                            </motion.li>
                        );
                    })}
                </ul>
            </motion.div>
        </section>
    );
}