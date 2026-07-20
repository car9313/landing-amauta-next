'use client';

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { AmautaButton } from "./ui/amauta-button";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  onStartClick: () => void;
  activeSection?: string;
}

const NAV_ITEMS = [
  { label: "Inicio", id: "#inicio" },
  { label: "El problema", id: "#problemas" },
  { label: "Cómo funciona", id: "#como-funciona" },
  { label: "La solución", id: "#soluciones" },
  { label: "Encuesta", id: "#encuesta" },
  { label: "FAQ", id: "#faq" },
] as const;

export default function Header({ onStartClick, activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

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
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isActiveItem = (id: string) => activeSection === id.substring(1);

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white text-amauta-blue border-b border-border/70 shadow-md py-3"
            : "bg-transparent text-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#inicio");
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amauta-orange rounded-lg min-h-[44px] px-2"
          >
            <Image
              src="/logo.png"
              alt="Amauta"
              width={160}
              height={64}
              priority
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 hover:shadow-lg"
            />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActiveItem(item.id);

              return (
                <a
                  key={item.label}
                  href={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`relative font-bold text-sm tracking-wide transition-colors duration-200 cursor-pointer flex items-center justify-center min-h-[44px] px-2 ${
                    active
                      ? isScrolled
                        ? "text-amauta-blue"
                        : "text-white"
                      : isScrolled
                        ? "text-amauta-blue/75 hover:text-amauta-orange"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-px rounded-full ${
                        isScrolled ? "bg-amauta-blue" : "bg-white"
                      }`}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <AmautaButton
              onClick={onStartClick}
              amautaVariant="accent"
              className={cn(
                "px-6 font-extrabold text-sm min-h-11",
                isScrolled ? "" : "shadow-[0_4px_14px_rgba(255,255,255,0.3)] hover:shadow-lg",
              )}
            >
              Comenzar Gratis
            </AmautaButton>
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className={`lg:hidden rounded-xl p-2.5 flex flex-col justify-center items-center gap-1.5 min-w-[44px] min-h-[44px] transition-all focus:outline-none focus:ring-2 focus:ring-amauta-orange relative ${
              isScrolled
                ? "hover:bg-amauta-blue-light/50 text-amauta-blue"
                : "hover:bg-white/10 text-white"
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`w-6 h-0.75 rounded-full ${
                isScrolled ? "bg-amauta-blue" : "bg-white"
              }`}
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`w-6 h-0.75 rounded-full ${
                isScrolled ? "bg-amauta-blue" : "bg-white"
              }`}
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`w-6 h-0.75 rounded-full ${
                isScrolled ? "bg-amauta-blue" : "bg-white"
              }`}
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