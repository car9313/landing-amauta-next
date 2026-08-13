'use client';

import { motion, AnimatePresence } from "motion/react";
import { AmautaButton } from "./ui/amauta-button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/locale/hooks/useLanguage";

const NAV_ITEMS = [
  { key: "inicio", id: "#inicio" },
  { key: "problemas", id: "#problemas" },
  { key: "comoFunciona", id: "#como-funciona" },
  { key: "soluciones", id: "#soluciones" },
  { key: "encuesta", id: "#encuesta" },
  { key: "faq", id: "#faq" },
] as const;

interface MobileMenuProps {
  open: boolean;
  activeSection?: string;
  isScrolled: boolean;
  onClose: () => void;
  onStartClick: () => void;
  onNavigate: (id: string) => void;
}

export function MobileMenu({
  open,
  activeSection,
  onClose,
  onStartClick,
  onNavigate,
}: MobileMenuProps) {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed top-[68px] sm:top-[76px] left-0 w-full bg-white z-50 shadow-[var(--shadow-xl)] border-b border-border lg:hidden overflow-hidden"
          >
            <div className="px-5 py-6 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.id.substring(1);

                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                  >
                    <a
                      href={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-all min-h-[44px]",
                        active
                          ? "bg-amauta-blue text-white shadow-sm"
                          : "text-foreground hover:bg-amauta-blue-light hover:text-amauta-blue",
                      )}
                    >
                      {t(`navigation:items.${item.key}`)}
                    </a>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="pt-2"
              >
                <AmautaButton
                  onClick={() => {
                    onClose();
                    onStartClick();
                  }}
                  amautaVariant="accent"
                  className="w-full font-black py-3 px-6 min-h-[44px] text-sm uppercase tracking-wide"
                >
                  {t('common:startNow')}
                </AmautaButton>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}