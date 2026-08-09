"use client";

import { useCallback, useMemo } from "react";

import { useLocaleContext } from "./locale-context";
import { DEFAULT_LOCALE } from "../domain/locale.constants";

const INTL_BASE = "es-419";

/** Formatea números y fechas según el locale activo (Intl). */
export function useLocale() {
  const { locale } = useLocaleContext();

  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale === DEFAULT_LOCALE ? INTL_BASE : locale),
    [locale],
  );

  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === DEFAULT_LOCALE ? INTL_BASE : locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  return {
    formatNumber: useCallback(
      (value: number, options?: Intl.NumberFormatOptions) =>
        options ? new Intl.NumberFormat(locale === DEFAULT_LOCALE ? INTL_BASE : locale, options).format(value) : numberFormat.format(value),
      [numberFormat, locale],
    ),
    formatDate: useCallback(
      (date: Date | number, options?: Intl.DateTimeFormatOptions) =>
        options
          ? new Intl.DateTimeFormat(locale === DEFAULT_LOCALE ? INTL_BASE : locale, options).format(date)
          : dateFormat.format(date),
      [dateFormat, locale],
    ),
  };
}