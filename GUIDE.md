# Guía — Internacionalización con geolocalización (replicable)

**Propósito:** aplicar la misma i18n por geolocalización implementada en este proyecto (Amauta) a cualquier otra landing con Next.js 16 + App Router (client-heavy).

**Referencia de implementación:** `lib/locale/` + `components/locale/` + `proxy.ts` + `app/layout.tsx` en este repositorio.

**Para portar los cambios puntuales recientes a un proyecto existente:** ver [`docs/replicar-cambios-i18n.md`](docs/replicar-cambios-i18n.md).

---

## 1. Arquitectura (3 capas)

```
proxy.ts (edge)              → detecta país por headers del hosting y pone la cookie
lib/locale/domain/           → idiomas soportados + mapa país→locale + idiomas de países + constantes
lib/locale/infrastructure/   → init de i18next, geo client-side, cookies
lib/locale/hooks/            → useLanguage (t) y useLocale (formatNumber/Date)
components/locale/           → LocaleProvider (Context), LanguageSwitcher, LocaleSplash
app/layout.tsx (server)      → <html lang> + metadata localizada en el primer render
public/locales/{id}/         → bundles regionales descargados en runtime
```

### Cadena de resolución de locale (cliente)

```
LocaleProvider (cliente, boot "una vez"):
1. ?locale=            → override de prueba: se aplica sin geo ni persistencia
2. Provisional (primer paint, NO definitivo):
   <html lang> SSR → cookie "locale" → navigator.language → es-LA
3. Geo client-side SIEMPRE se ejecuta (en paralelo al primer paint) y tiene
   prioridad sobre el provisional:
   - geo ≠ provisional → splash + traducción + re-persistencia de cookie
   - geo = provisional → no-op (sin re-traducir, sin re-persistir)
```

> La geo la resuelve el **navegador** contra fuentes públicas (Cloudflare
> `cdn-cgi/trace` → `ipwho.is`). No depende del hosting: funciona igual en
> Vercel, Netlify, un VPS o cualquier otro despliegue.

### Servidor (proxy.ts, se evalúa en CADA request)

```
?locale= → header país del hosting (cf-ipcountry, x-vercel-ip-country,
           cloudfront-viewer-country, cdn-viewer-country) → LOCALE_MAP
           → fallbackLocaleForCountry (idioma del país) → cookie
```

El proxy es una **optimización de primer paint**, no una dependencia: si el
hosting manda headers de país, el SSR ya renderiza en el idioma correcto; si no,
el cliente lo corrige con su propia geo en la misma carga.

### Prioridad final del idioma

```
1. Traducción regional del país    (CO → es-CO)   — "su traducción", nunca se degrada
2. Default por idioma del país     (CU, VE, ES → es-LA | NG, PH → en)
3. Idioma del navegador            (navigator.language → es-LA | en)
4. Default                         (es-LA)
```

El fallback por idioma (`es-LA`/`en`) **solo** aplica a países sin traducción
regional. Nunca reemplaza la traducción propia de un país cuando existe.

### Logs de decisión (solo en desarrollo, `devLog`)

La cadena completa es observable en consola:

```
[i18n] provisional (cookie) = en
[i18n] geo éxito -> es-CO CO
[i18n] geo difiere -> traducción
[i18n] language final = es-CO
[i18n][geo] país sin traducción regional: CU -> habla hispana -> es-LA
[i18n][geo] país sin traducción ni idioma conocido: XK
[i18n] XK sin traducción ni idioma conocido → se usará es-LA (navegador)
```

---

## 2. Paso 0 — Dependencias

```bash
npm i i18next react-i18next
```

Sin zustand ni otras librerías: el estado vive en React Context.

---

## 3. Paso 1 — Estructura de carpetas a crear

```
lib/locale/
├── domain/
│   ├── locale.types.ts
│   ├── locale.config.ts
│   ├── locale.constants.ts
│   ├── locale-languages.ts     ← fallback por idioma de países sin traducción
│   └── locale.errors.ts
├── infrastructure/
│   ├── i18n.ts
│   ├── geo-detection.service.ts
│   └── locale-persistence.ts
├── hooks/
│   ├── useLanguage.ts
│   └── useLocale.ts
├── utils/
│   └── locale-utils.ts
└── server/
    └── server-metadata.ts
components/locale/
├── LocaleProvider.tsx
├── LocaleSplash.tsx
├── LanguageSwitcher.tsx
└── SkipLink.tsx
```

---

## 4. Paso 2 — Qué copiar tal cual vs. qué adaptar

### Copiar sin cambios (genérico)

| Archivo | Notas |
|---|---|
| `geo-detection.service.ts` | Fuentes `cloudflare /cdn-cgi/trace` → fallback `ipwho.is/`; timeout 5 s; maneja 429/timeout/parse/unmapped; devuelve `countryCode` para logs |
| `locale-languages.ts` | `SPANISH_COUNTRIES` + `ENGLISH_COUNTRIES` + `fallbackLocaleForCountry` (es-LA/en/null) |
| `locale-persistence.ts` | Solo cookie `locale` (maxAge 1 año, path=/) |
| `locale-utils.ts` | `isLocaleSupported` + `getLocaleFromNavigator` |
| `locale.types.ts` | `LocaleId`, `LocaleInfo`, `GeoResult` (con `countryCode`), `LocaleNamespace` |
| `locale.errors.ts` | Códigos de error para logging |
| `useLanguage.ts` | `{ t, i18n, locale, availableLocales, isReady, setPreference, resetLocale }` |
| `useLocale.ts` | `formatNumber` / `formatDate` con `Intl` |
| `LanguageSwitcher.tsx` | Dropdown de idiomas (solo visible en desarrollo) |
| `LocaleProvider.tsx` | Lógica completa de init (bundle regional, provisional, geo siempre, splash) |

### Adaptar a la landing (lo específico)

| Archivo | Qué cambiar |
|---|---|
| `domain/locale.config.ts` | `SUPPORTED_LOCALES` (idiomas y países de tu público) y `LOCALE_MAP` (país→locale, p. ej. `BR: "pt-BR"`) |
| `domain/locale.constants.ts` | `DEFAULT_LOCALE`, `COOKIE_KEY`, `LOCALE_NAMESPACES` (deben coincidir con las secciones de la landing) |
| `domain/locale-languages.ts` | Ajustar `SPANISH_COUNTRIES`/`ENGLISH_COUNTRIES` a tu público (añadir `BR`, `PT` si soportas portugués…) |
| `domain/locale.types.ts` | Unir los nombres/types de los ids de tus idiomas |
| `infrastructure/i18n.ts` | Imports de los JSON embebidos (default + `en`) y registro de namespaces |
| `server/server-metadata.ts` | Title/description por locale (SEO) |
| `proxy.ts` (raíz) | Matcher (excluir `/locales`) y headers de país de tu hosting |
| `components/locale/LocaleSplash.tsx` | Branding (logo/nombre de la marca) |

---

## 5. Paso 3 — Traducciones (el trabajo pesado)

### 5.1. Recursos embebidos (`lib/locale/infrastructure/resources/{lang}/`)

1 JSON por namespace, con importación directa en `i18n.ts`:

```
resources/
├── es-LA/
│   ├── common.json      navigation.json   hero.json
│   ├── services.json    products.json     caseStudies.json
│   ├── about.json       insights.json     contact.json
│   └── footer.json      modals.json
└── en/  (misma estructura)
```

Reglas:
- 1 namespace por sección de la landing (hero, services, products, contact…).
- `defaultNS: "common"`, `returnObjects: true`, `interpolation.escapeValue: false`.
- `fallbackLng: DEFAULT_LOCALE`.

### 5.2. Bundles regionales (`public/locales/{id}/translation.json`)

1 archivo por locale regional (p. ej. `es-MX`, `es-AR`, `es-CL`, `es-CO`, `es-PE`), descargado por el cliente en runtime y cacheados por HTTP del navegador.

Truco que respeta el proyecto: **copiar el neutro (`es-LA`) y cambiar SOLO lo regional**.

### 5.3. Reemplazar strings hardcodeados

- Toda cadena visible → `t("ns:key")`.
- Arrays (bullets, métricas, case studies) → `t("ns:key", { returnObjects: true })`.
- Interpolación → `t("modals:thankYou", { name })`.
- Traducir `aria-label` y `alt`.

---

## 6. Paso 4 — Integración

### 6.1. `app/layout.tsx` (Server Component)

```tsx
const locale = await resolveServerLocale(); // header del proxy → cookie → default
return <html lang={locale}>… <LocaleProvider>{children}</LocaleProvider></html>
```

- `generateMetadata()` → title/description por locale.
- `await cookies()` / `await headers()` (asíncronas en Next 16).

### 6.2. `proxy.ts` (raíz)

```ts
export function proxy(request: NextRequest) { … }
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|locales).*)"] }
```

Lógica (se evalúa en CADA request):
1. `?locale=` → gana siempre (override de prueba).
2. Geo del hosting: headers de país (`cf-ipcountry`, `x-vercel-ip-country` …) → `LOCALE_MAP` → si no hay traducción regional, `fallbackLocaleForCountry` (idioma del país).
3. Cookie `locale` (solo si 1 y 2 no resolvieron).
4. Header interno `I18N_LOCALE_HEADER` para el SSR.
5. `NextResponse.next({ request: { headers } })` + `response.cookies.set(...)` solo si el locale resuelto difiere de la cookie (guarda: default sin cookie previa no se persiste).

> `server/server-metadata.ts` (`resolveServerLocale`) lee **el header del proxy
> ANTES que la cookie**: así el SSR respeta la decisión fresca de la geo en cada
> request y no pinta idiomas viejos de la cookie al cambiar de país.

### 6.3. `LocaleProvider.tsx` (cliente)

- Contexto expone `{ locale, isReady, setPreference, resetLocale }`.
- Init (una vez): aplica un **provisional** para pintar al instante (`?locale=` → `<html lang>` SSR → cookie → navigator → default), y **siempre** ejecuta `detectGeoLocale()` en paralelo:
  - geo ≠ provisional → `LocaleSplash` + carga del bundle regional + `changeLanguage` + cookie + `router.refresh()`.
  - geo = provisional → no-op (sin re-traducir); solo sincroniza la cookie si difiere y no es el default.
  - geo falla → se mantiene el provisional (log de decisión).
- `setPreference` = cookie + `changeLanguage` + `router.refresh()`.
- `resetLocale` = limpia cookie + vuelve al default + refresh.
- Splash: `{detecting && <LocaleSplash/>}` — cubre tanto el primer paint como el cambio de idioma por geo.

### 6.4. Hooks en tu código

```tsx
const { t, locale, setPreference } = useLanguage();
const { formatNumber, formatDate } = useLocale();
```

---

## 7. Paso 5 — Checklist de verificación

- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] `/?locale=es-MX` → muestra el regional en español (override, sin persistencia).
- [ ] 1er ingreso sin cookie → geo: cookie regional + `<html lang>` regional.
- [ ] Visita con cookie vieja (p. ej. `en` de EE.UU.) desde otro país (p. ej. CO) → la geo gana: traduce a `es-CO` y reescribe la cookie.
- [ ] Recarga en el mismo país → no-op (sin splash, sin Set-Cookie).
- [ ] País sin traducción regional hispanohablante (CU) → `es-LA` (español neutro).
- [ ] País sin traducción regional anglófono (NG) → `en`.
- [ ] País sin traducción ni idioma conocido → navegador → default; log de decisión en consola (dev).
- [ ] `<html lang>` y `<title>` correctos en SSR y tras cambio en vivo.
- [ ] `LanguageSwitcher` cambia idioma + persiste + refresca SSR.
- [ ] Simulación SSR: `curl -H "cf-ipcountry: PE" -b "locale=es-MX" http://localhost:3002/` → `set-cookie: locale=es-PE` y `<html lang="es-PE">`.

---

## 8. Tipos clave

- **1 sola cookie `locale`** → guarda el último idioma aplicado; la geo puede reescribirla si el país cambió.
- **Geo client-side SIEMPRE** (cloudflare trace → ipwho.is) → es la fuente de verdad, independiente del hosting.
- **Geo del hosting por headers en cada request** → solo optimiza el primer paint del SSR.
- **Fallback por idioma del país** (`locale-languages.ts`) → `es-LA`/`en` para países sin traducción regional, sin APIs externas y sin coste (ambos van embebidos).
- **Bundles en `public/`** en lugar de embebidos para `es-MX`/`es-AR`…: cache HTTP de navegador, sin bloquear el primer render.
- **Sin prefijo `/en` en URL y sin redirects:** ruteo cookie-only (más simple de mantener).
- **`LanguageSwitcher` visible solo en desarrollo** (se oculta en producción para no exponer la elección manual).

---

## 10. Mejora futura — Re-detección de geo en vivo (Opción B)

**Contexto:** hoy la geo se ejecuta una sola vez por carga completa (boot del `LocaleProvider`). Si el visitante mantiene la página abierta y cambia de país, el idioma solo se actualiza al recargar o reabrir. Decisión de arquitectura vigente: **aceptado así por ahora (Opción A)** — la landing cubre el caso real (viajes se resuelven en la siguiente carga) sin coste ni sorpresas a mitad de interacción. Esta sección queda documentada por si mañana la evidencia lo pide (viajes frecuentes con pestaña abierta, o si la app pasa a tener sesión/tablero donde el idioma viejo sí molesta).

**Diseño propuesto (B-lite), si se retoma:**

- Escuchar `visibilitychange` (pestaña oculta → visible) y `online` en un segundo efecto del `LocaleProvider`.
- Medir el tiempo con **timestamps reales** (`Date.now()` al ocultarse, comparar al volver). **No usar `setInterval`**: los timers se congelan cuando la pestaña está en segundo plano.
- Umbral de re-chequeo: solo si la pestaña estuvo oculta **≥ 15–30 min** (evita fetchs innecesarios en cada foco de pestaña).
- Guarda contra doble disparo: si `online` y `visibilitychange` ocurren juntos (red nueva al viajar), ejecutar **un solo** chequeo.
- Flujo reusado, idéntico al boot: `detectGeoLocale()` → si geo ≠ locale actual → splash + `applyTarget(geo, true)` + `router.refresh()`; si coincide o falla → no-op con log de decisión.
- Misma política: geo gana siempre (incluso sobre elección manual del usuario).

---

## 9. Preguntas a definir por landing

1. ¿Qué locales/países soporta tu público? → `SUPPORTED_LOCALES` + `LOCALE_MAP`.
2. ¿Cuál es el default? → `DEFAULT_LOCALE`.
3. ¿Qué headers de país pone tu hosting? → matcher en `proxy.ts` (`COUNTRY_HEADERS`).
4. ¿Qué secciones tiene la landing? → lista de `LOCALE_NAMESPACES`.
5. ¿Qué países hispano/anglófonos cubrir en el fallback? → `SPANISH_COUNTRIES`/`ENGLISH_COUNTRIES` en `locale-languages.ts`.