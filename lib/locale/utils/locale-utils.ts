import { EMBEDDED_LOCALES, LOCALE_MAP, REGIONAL_LOCALES, SUPPORTED_LOCALES } from "../domain/locale.config";
import { DEFAULT_LOCALE } from "../domain/locale.constants";
import type { LocaleId } from "../domain/locale.types";

export function isLocaleSupported(locale: string | null | undefined): locale is LocaleId {
  if (!locale) return false;
  return SUPPORTED_LOCALES.some((l) => l.id === locale);
}

export function localeFromCountryCode(countryCode: string | null | undefined): LocaleId | null {
  if (!countryCode) return null;
  const normalized = countryCode.trim().toUpperCase();
  if (normalized.length !== 2) return null;
  return LOCALE_MAP[normalized] ?? null;
}

export function isEmbeddedLocale(locale: LocaleId): boolean {
  return EMBEDDED_LOCALES.includes(locale);
}

export function isRegionalLocale(locale: LocaleId): boolean {
  return REGIONAL_LOCALES.includes(locale);
}

/**
 * Prefiere un idioma regional/es-LA para el `navigator.language`;
 * si el navegador no coincide con algo soportado, devuelve null
 * (para que el llamador decida qué hacer después con la geo).
 */
export function getLocaleFromNavigator(navigatorLanguage?: string): LocaleId | null {
  const raw = navigatorLanguage ?? (typeof navigator !== "undefined" ? navigator.language : undefined);
  if (!raw) return null;

  const exact = SUPPORTED_LOCALES.find((l) => l.id.toLowerCase() === raw.toLowerCase());
  if (exact) return exact.id;

  const langBase = raw.split("-")[0]?.toLowerCase();
  if (langBase === "es") return DEFAULT_LOCALE;
  if (langBase === "en") return "en";

  return null;
}

export function isLocaleId(value: unknown): value is LocaleId {
  return typeof value === "string" && isLocaleSupported(value);
}