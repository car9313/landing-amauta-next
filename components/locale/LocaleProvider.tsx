"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";

import { LocaleContext } from "@/lib/locale/hooks/locale-context";
import { initI18n, loadRegionalBundle, i18n } from "@/lib/locale/infrastructure/i18n";
import {
  clearLocaleCookie,
  getLocaleCookie,
  setLocaleCookie,
} from "@/lib/locale/infrastructure/locale-persistence";
import { detectGeoLocale } from "@/lib/locale/infrastructure/geo-detection.service";
import { SUPPORTED_LOCALES } from "@/lib/locale/domain/locale.config";
import { DEFAULT_LOCALE } from "@/lib/locale/domain/locale.constants";
import { getLocaleFromNavigator, isLocaleSupported } from "@/lib/locale/utils/locale-utils";
import type { LocaleId } from "@/lib/locale/domain/locale.types";
import { LocaleSplash } from "./LocaleSplash";

const IS_DEV = process.env.NODE_ENV === "development";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function devLog(...args: unknown[]): void {
  if (!IS_DEV) return;
  console.log("[i18n]", ...args);
}

/**
 * Resolución del locale:
 * 1. ?locale= (override desarrollo/testing — sin persistencia ni geo)
 * 2. Provisional de primer paint: <html lang> del SSR → cookie → navigator.language
 * 3. Geo client-side SIEMPRE se ejecuta (cloudflare /cdn-cgi/trace → fallback
 *    ipwho.is; resuelta por el navegador, sin depender del hosting):
 *    - geo difiere del provisional → se traduce y re-persiste la cookie
 *    - geo coincide → no-op (sin re-traducir, sin re-persistir)
 *
 * La geo tiene prioridad sobre cualquier valor persistido/SSR.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState<LocaleId>(DEFAULT_LOCALE);
  const [isReady, setIsReady] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const initializedRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initI18n();

    const applyTarget = async (target: LocaleId, persist: boolean) => {
      if (target !== DEFAULT_LOCALE) {
        const loaded = await loadRegionalBundle(target);
        if (!loaded) {
          devLog("bundle no disponible -> default", DEFAULT_LOCALE);
          target = DEFAULT_LOCALE;
        }
      }
      if (persist) {
        const cookieLocale = getLocaleCookie();
        if (target !== cookieLocale) {
          setLocaleCookie(target);
          devLog("cookie", target, "persistida");
        }
      }
      await i18n.changeLanguage(target);
      document.documentElement.lang = target;
      setLocale(target);
      setIsReady(true);
      setDetecting(false);
      devLog("language final =", target);
    };

    // 1. ?locale= override (dev/testing)
    const override = new URLSearchParams(window.location.search).get("locale");
    if (isLocaleSupported(override)) {
      devLog("override ?locale =", override);
      void applyTarget(override, false);
      return;
    }

    // 2. Provisional de primer paint: SSR (proxy/geo hosting) → cookie → navigator
    let provisional: LocaleId = DEFAULT_LOCALE;
    let provisionalSource = "default";
    const hasCookie = getLocaleCookie() !== null;

    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== DEFAULT_LOCALE && isLocaleSupported(htmlLang)) {
      provisional = htmlLang;
      provisionalSource = "ssr";
      devLog("provisional (ssr lang) =", htmlLang);
    } else {
      const cookieLocale = getLocaleCookie();
      if (isLocaleSupported(cookieLocale)) {
        provisional = cookieLocale;
        provisionalSource = "cookie";
        devLog("provisional (cookie) =", cookieLocale);
      } else {
        const navigatorLocale = getLocaleFromNavigator();
        if (navigatorLocale) {
          provisional = navigatorLocale;
          provisionalSource = "navegador";
          devLog("provisional (navigator) =", navigatorLocale);
        }
      }
    }

    // 3. Geo client-side: siempre se ejecuta, en paralelo al primer paint
    const geoPromise = detectGeoLocale();

    const init = async () => {
      await applyTarget(provisional, !hasCookie);

      const geoResult = await geoPromise;
      if (geoResult.success && geoResult.localeId) {
        devLog("geo éxito ->", geoResult.localeId, geoResult.countryCode ?? "");
        if (geoResult.localeId !== provisional) {
          devLog("geo difiere -> traducción");
          setDetecting(true);
          await applyTarget(geoResult.localeId, true);
          router.refresh(); // re-render SSR: <html lang> + metadata localizada
        } else if (
          geoResult.localeId !== DEFAULT_LOCALE &&
          getLocaleCookie() !== geoResult.localeId
        ) {
          setLocaleCookie(geoResult.localeId);
          devLog("cookie sincronizada ->", geoResult.localeId);
        }
      } else {
        devLog("geo fallo ->", geoResult.reason, "(se mantiene provisional)");
        if (geoResult.countryCode) {
          devLog(
            geoResult.countryCode,
            "sin traducción ni idioma conocido → se usará",
            provisional,
            `(${provisionalSource})`,
          );
        }
      }
    };

    void init();

    if (IS_DEV) {
      (window as unknown as Record<string, unknown>).__i18nDebug = { i18n };
    }
  }, []);

  const setPreference = useCallback(
    async (next: LocaleId) => {
      if (next !== DEFAULT_LOCALE) {
        const loaded = await loadRegionalBundle(next);
        if (!loaded) return;
      }
      setLocaleCookie(next);
      await i18n.changeLanguage(next);
      document.documentElement.lang = next;
      setLocale(next);
      router.refresh(); // re-render SSR: <html lang> + metadata localizada
    },
    [router],
  );

  const resetLocale = useCallback(async () => {
    clearLocaleCookie();
    await i18n.changeLanguage(DEFAULT_LOCALE);
    document.documentElement.lang = DEFAULT_LOCALE;
    setLocale(DEFAULT_LOCALE);
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      locale,
      availableLocales: SUPPORTED_LOCALES,
      isReady,
      setPreference,
      resetLocale,
    }),
    [locale, isReady, setPreference, resetLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {detecting && <LocaleSplash key="splash" />}
      </AnimatePresence>
    </LocaleContext.Provider>
  );
}