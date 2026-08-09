export const LOCALE_IDS = [
  "es-LA",
  "en",
  "es-MX",
  "es-CO",
  "es-PE",
  "es-CL",
  "es-AR",
] as const;

export type LocaleId = (typeof LOCALE_IDS)[number];

export interface LocaleInfo {
  id: LocaleId;
  /** Nombre del idioma en su propia lengua (p. ej. "Español") */
  label: string;
  /** Emoji de bandera para el selector */
  flag: string;
  /** Nombre por defecto para la etiqueta de idioma (BCP 47) */
  bcp47: string;
}

export type GeoFailureReason =
  | "timeout"
  | "rate_limited"
  | "network_error"
  | "parse_error"
  | "unmapped_country";

export interface GeoResult {
  success: boolean;
  localeId?: LocaleId;
  reason?: GeoFailureReason;
}

export type LocaleNamespace =
  | "common"
  | "navigation"
  | "hero"
  | "problems"
  | "howItWorks"
  | "solutions"
  | "survey"
  | "faq"
  | "pricing"
  | "cta"
  | "footer";