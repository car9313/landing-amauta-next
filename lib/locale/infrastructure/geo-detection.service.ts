import type { GeoFailureReason, GeoResult } from "../domain/locale.types";
import { GEO_SOURCES, GEO_TIMEOUT_MS } from "../domain/locale.constants";
import { LOCALE_MAP } from "../domain/locale.config";

const IS_DEV = process.env.NODE_ENV === "development";

function devLog(...args: unknown[]): void {
  if (!IS_DEV) return;
  console.log("[i18n][geo]", ...args);
}

class GeoFetchError extends Error {
  reason: GeoFailureReason;
  constructor(reason: GeoFailureReason) {
    super(reason);
    this.name = "GeoFetchError";
    this.reason = reason;
  }
}

/**
 * Consulta una fuente de geolocalización y devuelve el código de país.
 * - Cloudflare `https://www.cloudflare.com/cdn-cgi/trace` → texto `loc=XX`.
 * - `ipwho.is/` → JSON con `country_code`.
 * Timeout de 5 s por fuente y errores categorizados por causa.
 */
async function fetchCountryFromSource(source: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

  try {
    const response = await fetch(source, {
      signal: controller.signal,
      headers: { Accept: "application/json, text/plain" },
    });

    if (response.status === 429) {
      throw new GeoFetchError("rate_limited");
    }
    if (!response.ok) {
      throw new GeoFetchError("network_error");
    }

    if (source.includes("ipwho.is")) {
      const data = (await response.json()) as { country_code?: unknown };
      if (typeof data.country_code !== "string" || data.country_code === "") {
        throw new GeoFetchError("parse_error");
      }
      return data.country_code;
    }

    const text = await response.text();
    const countryCode = /^loc=(.+)$/m.exec(text)?.[1];
    if (!countryCode) {
      throw new GeoFetchError("parse_error");
    }
    return countryCode;
  } catch (error) {
    if (error instanceof GeoFetchError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new GeoFetchError("timeout");
    }
    throw new GeoFetchError("network_error");
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Detecta el locale del país visitante usando las fuentes de geolocalización
 * (excluidas las de hosting, que ya resuelve el proxy vía headers).
 */
export async function detectGeoLocale(externalSignal?: AbortSignal): Promise<GeoResult> {
  if (externalSignal?.aborted) {
    return { success: false, reason: "timeout" };
  }

  let lastReason: GeoFailureReason = "network_error";

  for (const source of GEO_SOURCES) {
    if (externalSignal?.aborted) break;
    try {
      const countryCode = await fetchCountryFromSource(source);
      devLog("fuente:", source, "-> country:", countryCode);

      const localeId = LOCALE_MAP[countryCode];
      if (!localeId) {
        devLog("país sin mapeo:", countryCode);
        lastReason = "unmapped_country";
        continue;
      }

      devLog("LOCALE_MAP[", countryCode, "] ->", localeId);
      return { success: true, localeId };
    } catch (error) {
      const reason = error instanceof GeoFetchError ? error.reason : "network_error";
      lastReason = reason;
      devLog("FALLO fuente:", source, "->", reason);
    }
  }

  devLog("geo-detección falló en todas las fuentes:", lastReason);
  return { success: false, reason: lastReason };
}