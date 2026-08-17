'use client';

import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "motion/react";
import {cn} from "@/lib/utils";
import {MobileMenu} from "./MobileMenu";
import {useLanguage} from "@/lib/locale/hooks/useLanguage";
import {LanguageSwitcher} from "./locale/LanguageSwitcher";
import {AmautaButton} from "@/components/ui/AmautaPrimaryButton";

interface HeaderProps {
    onStartClick: () => void;
    activeSection?: string;
}

const NAV_ITEMS = [
    {key: "inicio", id: "#inicio"},
    {key: "problemas", id: "#problemas"},
    {key: "comoFunciona", id: "#como-funciona"},
    {key: "soluciones", id: "#soluciones"},
    {key: "encuesta", id: "#encuesta"},
    {key: "faq", id: "#faq"},
] as const;

export default function Header({onStartClick, activeSection}: HeaderProps) {
    const {t} = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) {
            document.body.style.overflow = "";
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen]);

    const handleNavClick = useCallback((id: string) => {
        setMobileMenuOpen(false);
        const element = document.querySelector(id);
        element?.scrollIntoView({behavior: "smooth", block: "start"});
    }, []);

    const isActiveItem = (id: string) => activeSection === id.substring(1);

    return (
        <>
            <nav
                id="navbar"
                className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white text-amauta-blue border-b border-border/70 shadow-md py-3"
                        : "bg-transparent text-amauta-blue py-5"
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
                    <a
                        href="#inicio"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick("#inicio");
                        }}
                        className="flex items-center gap-2.5 group cursor-pointer focus:outline-none min-h-11 px-2"
                    >
                        <Image
                            src="/logo.png"
                            alt="Amauta"
                            width={160}
                            height={64}
                            priority
                            className="h-16 w-auto object-contain"
                        />
                    </a>

                    <div className="hidden lg:flex items-center gap-4">
                        {NAV_ITEMS.map((item) => {
                            const active = isActiveItem(item.id);

                            return (
                                <a
                                    key={item.key}
                                    href={item.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.id);
                                    }}
                                    className={cn(
                                        "relative font-bold text-sm tracking-wide transition-colors duration-200 cursor-pointer flex items-center justify-center min-h-11 px-2",
                                        active
                                            ? "text-amauta-blue"
                                            : "text-amauta-blue hover:text-amauta-orange",
                                    )}
                                >
                                    {t(`navigation:items.${item.key}`)}

                                    {active && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-px rounded-full bg-amauta-blue"
                                        />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <AmautaButton
                            variant="primary"
                            onClick={onStartClick}
                            icon="→"  // o <ArrowRight className="size-5" />
                            size="sm"
                        >
                            {t('common:startNow')}
                        </AmautaButton>

                        {/* <AmautaButton
              onClick={onStartClick}
              amautaVariant="accent"
              className={cn(
                "px-6 font-extrabold text-sm min-h-11",
                isScrolled ? "" : "shadow-[0_4px_14px_rgba(255,255,255,0.3)] hover:shadow-lg",
              )}
            >
              {t('common:startNow')}
            </AmautaButton>
          */}</div>

                    <LanguageSwitcher className="hidden lg:inline-flex text-amauta-blue"/>

                    <button
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        className="lg:hidden rounded-xl p-2.5 flex flex-col justify-center items-center gap-1.5 min-w-11 min-h-11 transition-all focus:outline-none focus:ring-2 focus:ring-amauta-orange relative hover:bg-amauta-blue-light/50 text-amauta-blue"
                        aria-label={t('common:toggleMenu')}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <motion.span
                            animate={mobileMenuOpen ? {rotate: 45, y: 7} : {rotate: 0, y: 0}}
                            transition={{type: "spring", stiffness: 280, damping: 18}}
                            className="w-6 h-0.75 rounded-full bg-amauta-blue"
                        />
                        <motion.span
                            animate={mobileMenuOpen ? {opacity: 0, x: -12} : {opacity: 1, x: 0}}
                            transition={{duration: 0.15}}
                            className="w-6 h-0.75 rounded-full bg-amauta-blue"
                        />
                        <motion.span
                            animate={mobileMenuOpen ? {rotate: -45, y: -7} : {rotate: 0, y: 0}}
                            transition={{type: "spring", stiffness: 280, damping: 18}}
                            className="w-6 h-0.75 rounded-full bg-amauta-blue"
                        />
                    </button>
                </div>
            </nav>

            <MobileMenu
                open={mobileMenuOpen}
                activeSection={activeSection}
                isScrolled={isScrolled}
                onClose={() => setMobileMenuOpen(false)}
                onStartClick={onStartClick}
                onNavigate={handleNavClick}
            />
        </>
    );
}