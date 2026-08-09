"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useLocaleContext } from "./locale-context";
import { DEFAULT_LOCALE } from "../domain/locale.constants";
import type { LocaleId, LocaleInfo } from "../domain/locale.types";

export type TFunction = (
  key: string,
  options?: Record<string, unknown>,
) => string;

export interface UseLanguageResult {
  /** Función de traducción tipada con namespace opcional `"ns:key"`. */
  t: TFunction;
  /** Instancia global de i18next. */
  i18n: ReturnType<typeof useTranslation>["i18n"];
  /** Locale activo (igual que el contexto). */
  locale: LocaleId;
  /** Locales disponibles para el switcher. */
  availableLocales: LocaleInfo[];
  /** true cuando el provider ya resolvió el idioma. */
  isReady: boolean;
  setPreference: (locale: LocaleId) => Promise<void>;
  resetLocale: () => Promise<void>;
}

export function useLanguage(): UseLanguageResult {
  const ctx = useLocaleContext();
  const { t, i18n } = useTranslation();

  return {
    t: t as TFunction,
    i18n,
    locale: ctx.locale,
    availableLocales: ctx.availableLocales,
    isReady: ctx.isReady,
    setPreference: ctx.setPreference,
    resetLocale: ctx.resetLocale,
  };
}

/** Formatea números/fechas según el locale activo. */
export function useLocale() {
  const { locale } = useLocaleContext();
  const [memo] = useState(() => new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>());

  const numberFormat = useCallback(
    (options?: Intl.NumberFormatOptions) => {
      const key = `num:${JSON.stringify(options ?? {})}:${locale}`;
      let fmt = memo.get(key) as Intl.NumberFormat | undefined;
      if (!fmt) {
        fmt = new Intl.NumberFormat(locale === DEFAULT_LOCALE ? "es-419" : locale, options);
        memo.set(key, fmt);
      }
      return fmt;
    },
    [locale, memo],
  );

  const dateFormat = useCallback(
    (options?: Intl.DateTimeFormatOptions) => {
      const key = `date:${JSON.stringify(options ?? {})}:${locale}`;
      let fmt = memo.get(key) as Intl.DateTimeFormat | undefined;
      if (!fmt) {
        fmt = new Intl.DateTimeFormat(locale === DEFAULT_LOCALE ? "es-419" : locale, options);
        memo.set(key, fmt);
      }
      return fmt;
    },
    [locale, memo],
  );

  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      numberFormat(options).format(value),
    formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) =>
      dateFormat(options).format(date),
  };
}

export type { LocaleId };