import type { LocaleId, LocaleNamespace } from "./locale.types";

export const DEFAULT_LOCALE: LocaleId = "es-LA";

/** Única cookie de persistencia de idioma (1 año). */
export const COOKIE_KEY = "locale";

/** Header interno que el proxy escribe para el SSR (metadata, <html lang>). */
export const I18N_LOCALE_HEADER = "x-i18n-locale";

/** 1 namespace por sección de la landing. */
export const LOCALE_NAMESPACES: LocaleNamespace[] = [
  "common",
  "navigation",
  "hero",
  "problems",
  "howItWorks",
  "solutions",
  "survey",
  "faq",
  "pricing",
  "cta",
  "footer",
];

export const DEFAULT_NS: LocaleNamespace = "common";

/** Fuentes gratuitas de geolocalización client-side (en orden de preferencia). */
export const GEO_SOURCES: readonly string[] = [
  "https://www.cloudflare.com/cdn-cgi/trace",
  "https://ipwho.is/",
];

/** Milisegundos de espera de las APIs de geolocalización gratuitas. */
export const GEO_TIMEOUT_MS = 5000;
