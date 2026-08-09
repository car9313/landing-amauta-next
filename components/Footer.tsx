import React, { useState } from "react";
import { BookOpen, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/locale/hooks/useLanguage";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(
    null,
  );

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-amauta-blue-dark text-white border-t border-amauta-blue-dark relative overflow-hidden z-10 font-sans pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-slate-800 pb-10">
          {/* Brand/Product columns */}
          <div className="md:col-span-5 space-y-4 text-center md:text-left">
            <a
              href="#inicio"
              onClick={(e) => handleLinkClick(e, "#inicio")}
              className="inline-flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amauta-orange rounded-lg"
            >
              <div className="relative p-1.5 rounded-xl bg-white text-slate-900 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-slate-900" />
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amauta-orange animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-xl font-black tracking-tight block">
                  Amauta
                </span>
                <span className="text-[0.6rem] font-mono leading-none tracking-widest block font-extrabold uppercase text-amauta-orange-light">
                  {t('footer:tagline')}
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              {t('footer:tagline')} {t('footer:description')}
            </p>
          </div>

          <div className="md:col-span-2 hover-lift" />

          {/* Contact Details */}
          <div className="md:col-span-5 space-y-3.5 text-xs sm:text-sm text-slate-400 font-semibold">
            <div className="text-slate-300 font-black uppercase text-[10px] tracking-widest mb-1 text-center md:text-right">
              {t('footer:contactTitle')}
            </div>

            <div className="flex items-center gap-2 justify-center md:justify-end">
              <Mail className="w-4 h-4 text-amauta-orange" />
              <a
                href="mailto:hola@amauta.app"
                className="hover:text-white text-base font-black transition-colors text-amauta-orange-light"
              >
                hola@amauta.app
              </a>
            </div>

            <div className="text-[10px] text-slate-500 font-bold text-center md:text-right">
              {t('footer:legal')}
            </div>
          </div>
        </div>

        {/* Minimal Copyright and legal links column */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-semibold text-slate-500">
          <div>
            {t('footer:copyright', { year: currentYear })}
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-xs"
            >
              {t('footer:privacy')}
            </button>
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-xs"
            >
              {t('footer:terms')}
            </button>
            <button
              onClick={() => {
                window.location.href = "/register";
              }}
              className="hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer font-semibold text-xs"
            >
              {t('footer:register')}
            </button>
          </div>
        </div>
      </div>

      {/* Real, beautiful inline modals to handle these regulatory obligations */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-100 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">
                {activeModal === "privacy"
                  ? t('footer:privacyModalTitle')
                  : t('footer:termsModalTitle')}
              </h4>
              <span className="text-[10px] font-mono uppercase text-amauta-orange font-bold">
                {t('footer:securityBadge')}
              </span>
            </div>

            <div className="text-xs text-slate-600 font-semibold space-y-3 leading-relaxed max-h-60 overflow-y-auto">
              {activeModal === "privacy" ? (
                <>
                  <p dangerouslySetInnerHTML={{ __html: t('footer:privacy1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('footer:privacy2') }} />
                </>
              ) : (
                <>
                  <p dangerouslySetInnerHTML={{ __html: t('footer:terms1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('footer:terms2') }} />
                </>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setActiveModal(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2 rounded-xl text-xs uppercase"
              >
                {t('footer:close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
