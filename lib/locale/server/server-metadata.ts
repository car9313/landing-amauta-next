import { cookies, headers } from "next/headers";

import { I18N_LOCALE_HEADER, COOKIE_KEY, DEFAULT_LOCALE } from "../domain/locale.constants";
import { isLocaleSupported } from "../utils/locale-utils";
import type { LocaleId } from "../domain/locale.types";

export async function resolveServerLocale(): Promise<LocaleId> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_KEY)?.value;
  if (isLocaleSupported(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  const headerLocale = headerStore.get(I18N_LOCALE_HEADER);
  if (isLocaleSupported(headerLocale)) return headerLocale;

  return DEFAULT_LOCALE;
}

interface LocaleMetadata {
  title: string;
  description: string;
}

export const LOCALE_METADATA: Record<LocaleId, LocaleMetadata> = {
  "es-LA": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  "es-MX": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  "es-CO": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  "es-PE": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  "es-CL": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  "es-AR": {
    title: "Amauta — El aprendizaje que se adapta a tu hijo, siempre",
    description:
      "Amauta se adapta a cada niño, funciona sin internet y hace que aprender sea lo mejor del día. Acceso anticipado gratuito.",
  },
  en: {
    title: "Amauta — Learning that adapts to your child, always",
    description:
      "Amauta adapts to each child, works without internet, and makes learning the best part of the day. Free early access.",
  },
};

export async function localeMetadata(): Promise<LocaleMetadata> {
  const locale = await resolveServerLocale();
  return LOCALE_METADATA[locale];
}