"use client";

import { useLanguage } from "@/lib/locale/hooks/useLanguage";

/** Enlace de accesibilidad "Saltar al contenido" (visible al enfocar). */
export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#inicio"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-amauta-blue px-4 py-2 text-sm font-black text-white shadow-lg transition-transform focus:translate-y-0"
    >
      {t("footer:skipToContent")}
    </a>
  );
}