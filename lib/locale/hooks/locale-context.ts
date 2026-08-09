"use client";

import { createContext, useContext } from "react";
import type { LocaleId, LocaleInfo } from "../domain/locale.types";

export interface LocaleContextValue {
  /** Locale resuelto y activo (p. ej. "es-MX"). */
  locale: LocaleId;
  /** Disponibles para el LanguageSwitcher. */
  availableLocales: LocaleInfo[];
  /** true cuando el provider terminó la detección/init (splash oculto). */
  isReady: boolean;
  /** Elección explícita del usuario: cookie + changeLanguage + refresh SSR. */
  setPreference: (locale: LocaleId) => Promise<void>;
  /** Vuelve a la detección automática (uuid la cookie). */
  resetLocale: () => Promise<void>;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return ctx;
}