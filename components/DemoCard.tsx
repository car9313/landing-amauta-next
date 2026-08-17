// ============================================================

import {AmautaButton} from "@/components/ui/AmautaPrimaryButton";
import React, {useRef} from "react";
import {motion, useMotionValue, useSpring, useTransform} from "motion/react";
import {School} from "lucide-react";

export function DemoCard({onStartClick, t}: { onStartClick?: () => void; t: (key: string) => string }) {
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
        return `radial-gradient(320px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(244,112,31,0.25), transparent 70%)`;
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
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-amauta-blue-dark p-7 text-white shadow-[0_8px_30px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(15,23,42,0.25)]"
            >
                <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amauta-orange/20 blur-2xl"/>
                <div
                    className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amauta-blue/40 blur-2xl"/>

                {/* Spotlight — recortado por overflow-hidden de la card */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{background: spotlightBg}}
                />

                <div className="relative" style={{transform: 'translateZ(30px)'}}>
          <span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-amauta-orange-light">
            <School className="h-3.5 w-3.5"/>
            <span>{t('solutions:darkCard.badge')}</span>
          </span>
                    <p className="mt-4 text-xl font-black leading-snug sm:text-2xl">
                        {t('solutions:darkCard.text')}
                    </p>
                </div>

                <div style={{transform: 'translateZ(40px)'}} className="relative">
                    <AmautaButton
                        variant="primary"
                        onClick={onStartClick}
                        icon="→"
                        size="xs"
                    >
                        {t('solutions:darkCard.cta')}
                    </AmautaButton>
                </div>
            </motion.div>
        </div>
    );
}