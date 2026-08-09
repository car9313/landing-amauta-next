import type { LocaleId, LocaleInfo } from "./locale.types";

/**
 * Idiomas soportados por la landing.
 * `es-LA` y `en` viajan embebidos en el bundle; el resto se descargan
 * en runtime desde `public/locales/{id}/translation.json`.
 */
export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { id: "es-LA", label: "Español", flag: "🌎", bcp47: "es-419" },
  { id: "es-MX", label: "Español (México)", flag: "🇲🇽", bcp47: "es-MX" },
  { id: "es-CO", label: "Español (Colombia)", flag: "🇨🇴", bcp47: "es-CO" },
  { id: "es-PE", label: "Español (Perú)", flag: "🇵🇪", bcp47: "es-PE" },
  { id: "es-CL", label: "Español (Chile)", flag: "🇨🇱", bcp47: "es-CL" },
  { id: "es-AR", label: "Español (Argentina)", flag: "🇦🇷", bcp47: "es-AR" },
  { id: "en", label: "English", flag: "🇺🇸", bcp47: "en" },
];

/** Locales con recursos embebidos (sin descarga en runtime). */
export const EMBEDDED_LOCALES: LocaleId[] = ["es-LA", "en"];

/** Locales regionales servidos como bundle en `public/locales/`. */
export const REGIONAL_LOCALES: LocaleId[] = [
  "es-MX",
  "es-CO",
  "es-PE",
  "es-CL",
  "es-AR",
];

/**
 * Mapa país → locale (ISO 3166-1 alpha-2).
 * Los países no listados caen en `DEFAULT_LOCALE` (es-LA).
 */
export const LOCALE_MAP: Record<string, LocaleId> = {
  MX: "es-MX",
  CO: "es-CO",
  PE: "es-PE",
  CL: "es-CL",
  AR: "es-AR",
  US: "en",
  CA: "en",
  GB: "en",
  IE: "en",
  AU: "en",
  NZ: "en",
  IN: "en",
  ZA: "en",
};

/** Headers de país que pueden proveer los distintos hosts de despliegue. */
export const COUNTRY_HEADERS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "cloudfront-viewer-country",
  "cdn-viewer-country",
] as const;
