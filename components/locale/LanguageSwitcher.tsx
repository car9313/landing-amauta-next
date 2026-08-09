"use client";

import { useLanguage } from "@/lib/locale/hooks/useLanguage";

/**
 * Selector manual de idioma.
 * Solo visible en desarrollo (`NODE_ENV !== "production"`), como la guía
 * indica, para no exponer la elección manual al público.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, availableLocales, setPreference } = useLanguage();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <select
      aria-label="Seleccionar idioma"
      value={locale}
      onChange={(e) => setPreference(e.target.value as typeof locale)}
      className={`rounded-lg border border-current/30 bg-transparent px-2 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-amauta-orange ${className ?? ""}`}
    >
      {availableLocales.map((lang) => (
        <option key={lang.id} value={lang.id} className="text-slate-900">
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
}