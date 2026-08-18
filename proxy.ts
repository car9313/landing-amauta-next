import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { COUNTRY_HEADERS, LOCALE_MAP, SUPPORTED_LOCALES } from "@/lib/locale/domain/locale.config";
import { fallbackLocaleForCountry } from "@/lib/locale/domain/locale-languages";
import { COOKIE_KEY, DEFAULT_LOCALE, I18N_LOCALE_HEADER } from "@/lib/locale/domain/locale.constants";
import type { LocaleId } from "@/lib/locale/domain/locale.types";

const SUPPORTED_IDS = new Set<string>(SUPPORTED_LOCALES.map((locale) => locale.id));

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

function isSupportedLocale(value: string | null | undefined): value is LocaleId {
  return value !== undefined && value !== null && SUPPORTED_IDS.has(value);
}

/** Geolocalización vía headers del hosting (cf-ipcountry, x-vercel-ip-country…). */
function detectCountryLocale(request: NextRequest): LocaleId | null {
  for (const header of COUNTRY_HEADERS) {
    const country = request.headers.get(header);
    if (!country) continue;
    const normalized = country.trim().toUpperCase();
    // Traducción regional del país; si no existe, default por idioma (es-LA/en)
    const localeId = LOCALE_MAP[normalized] ?? fallbackLocaleForCountry(normalized);
    if (localeId) return localeId;
  }
  return null;
}

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(COOKIE_KEY)?.value;
  const current = isSupportedLocale(existing) ? existing : null;

  let resolved: LocaleId | null = null;

  // 1. ?locale= (override explícito — siempre gana)
  const queryLocale = request.nextUrl.searchParams.get("locale");
  if (isSupportedLocale(queryLocale)) {
    resolved = queryLocale;
  }

  // 2. Geo del hosting (cada request)
  if (!resolved) {
    resolved = detectCountryLocale(request);
  }

  // 3. Cookie persistida
  if (!resolved && current) {
    resolved = current;
  }

  const requestHeaders = new Headers(request.headers);
  if (resolved) {
    requestHeaders.set(I18N_LOCALE_HEADER, resolved);
  } else {
    requestHeaders.delete(I18N_LOCALE_HEADER);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Persistir solo cuando la geo difiere de la cookie (traducción real en la
  // siguiente renderización). El default sin cookie previa no se persiste.
  if (resolved && resolved !== current) {
    const isChangeFromStoredPreference = resolved !== DEFAULT_LOCALE || current !== null;
    if (isChangeFromStoredPreference) {
      response.cookies.set(COOKIE_KEY, resolved, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|locales).*)"],
};