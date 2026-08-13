import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { SUPPORTED_LOCALES } from "../domain/locale.config";
import { DEFAULT_LOCALE, DEFAULT_NS, LOCALE_NAMESPACES } from "../domain/locale.constants";
import type { LocaleId, LocaleNamespace } from "../domain/locale.types";
import { isRegionalLocale } from "../utils/locale-utils";

// ── Recursos embebidos: es-LA + en ──────────────────────────────────────────
import esCommon from "./resources/es-LA/common.json";
import esNavigation from "./resources/es-LA/navigation.json";
import esHero from "./resources/es-LA/hero.json";
import esProblems from "./resources/es-LA/problems.json";
import esHowItWorks from "./resources/es-LA/howItWorks.json";
import esSolutions from "./resources/es-LA/solutions.json";
import esSurvey from "./resources/es-LA/survey.json";
import esFaq from "./resources/es-LA/faq.json";
import esPricing from "./resources/es-LA/pricing.json";
import esCta from "./resources/es-LA/cta.json";
import esFooter from "./resources/es-LA/footer.json";

import enCommon from "./resources/en/common.json";
import enNavigation from "./resources/en/navigation.json";
import enHero from "./resources/en/hero.json";
import enProblems from "./resources/en/problems.json";
import enHowItWorks from "./resources/en/howItWorks.json";
import enSolutions from "./resources/en/solutions.json";
import enSurvey from "./resources/en/survey.json";
import enFaq from "./resources/en/faq.json";
import enPricing from "./resources/en/pricing.json";
import enCta from "./resources/en/cta.json";
import enFooter from "./resources/en/footer.json";

const resources = {
  "es-LA": {
    common: esCommon,
    navigation: esNavigation,
    hero: esHero,
    problems: esProblems,
    howItWorks: esHowItWorks,
    solutions: esSolutions,
    survey: esSurvey,
    faq: esFaq,
    pricing: esPricing,
    cta: esCta,
    footer: esFooter,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    hero: enHero,
    problems: enProblems,
    howItWorks: enHowItWorks,
    solutions: enSolutions,
    survey: enSurvey,
    faq: enFaq,
    pricing: enPricing,
    cta: enCta,
    footer: enFooter,
  },
} satisfies Record<string, Record<LocaleNamespace, unknown>>;

export const supportedLngs = SUPPORTED_LOCALES.map((l) => l.id);

export function initI18n() {
  if (i18n.isInitialized) return;

  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs,
    ns: [...LOCALE_NAMESPACES],
    defaultNS: DEFAULT_NS,
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

// Inicializa i18next al cargar el módulo para que SSR y el primer render
// del cliente dispongan de una instancia lista (evita NO_I18NEXT_INSTANCE).
initI18n();

/**
 * Descarga el bundle regional correspondiente y lo registra en i18next.
 * Con `fallbackLng: es-LA`, cualquier key faltante del regional cae al neutro.
 */
export async function loadRegionalBundle(locale: LocaleId): Promise<boolean> {
  if (!isRegionalLocale(locale)) return true;

  try {
    const response = await fetch(`/locales/${locale}/translation.json`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return false;

    const bundle = (await response.json()) as Partial<Record<LocaleNamespace, unknown>>;
    for (const ns of LOCALE_NAMESPACES) {
      const keys = bundle[ns];
      if (!keys) continue;
      i18n.addResourceBundle(locale, ns, keys, true, true);
    }
    return true;
  } catch {
    return false;
  }
}

export { i18n };