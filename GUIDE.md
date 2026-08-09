# Guía — Internacionalización con geolocalización (replicable)

**Propósito:** aplicar la misma i18n por geolocalización implementada en este proyecto (Axentra) a cualquier otra landing con Next.js 16 + App Router (client-heavy).

**Referencia de implementación:** `lib/locale/` + `app/components/locale/` + `proxy.ts` + `app/layout.tsx` en este repositorio.

---

## 1. Arquitectura (3 capas)

```
proxy.ts (edge)              → detecta país por headers del hosting y pone la cookie
lib/locale/domain/           → idiomas soportados + mapa país→locale + constantes
lib/locale/infrastructure/   → init de i18next, geo client-side, cookies
lib/locale/hooks/            → useLanguage (t) y useLocale (formatNumber/Date)
app/components/locale/       → LocaleProvider (Context), LanguageSwitcher, LocaleSplash
app/layout.tsx (server)      → <html lang> + metadata localizada en el primer render
public/locales/{id}/         → bundles regionales descargados en runtime
```

### Cadena de resolución de locale (cliente)

```
LocaleProvider (cliente, boot "una vez"):
1. ?locale=            → override de prueba: se aplica (el proxy lo persiste)
2. <html lang> SSR     → si NO es default: el proxy ya calculó el país del hosting
3. Cookie "locale"     → persistencia 1 año (2º ingreso+)
4. Geo client-side (cloudflare /cdn-cgi/trace → fallback ipwho.is) + navigator
   → solo cuando no hay SSR regional ni cookie
```

### Servidor (proxy.ts, se evalúa en CADA request)

```
?locale= → header país del hosting (cf-ipcountry, x-vercel-ip-country,
           cloudfront-viewer-country, cdn-viewer-country) → LOCALE_MAP → cookie
```

### Regla de traducción: la geo solo traduce si difiere de la cookie

La cookie `locale` se reescribe **únicamente cuando el país detectado difiere de la
cookie existente** (con guarda: el default sin cookie previa no se persiste). Toda
visita evalúa la geolocalización; el cambio de idioma ocurre solo cuando el país
cambió respecto a lo almacenado.

| Caso | Resultado |
|---|---|
| 1er ingreso desde PE, sin cookie | `set-cookie locale=es-PE` + `<html lang="es-PE">` |
| Cookie `es-MX`, GeoIP PE (difiere) | reescribe cookie a `es-PE` → traduce |
| Cookie `es-MX`, GeoIP MX (coincide) | **no reescribe nada** (sin Set-Cookie) |
| `?locale=en` | `en` siempre, independiente de la cookie |

**Verificación con curl** (simula el header del hosting):

```bash
curl -sI -H "cf-ipcountry: PE" http://localhost:3000/              # 1er ingreso → set-cookie es-PE
curl -sI -H "cf-ipcountry: PE" -b "locale=es-MX" http://localhost:3000/  # difiere → reescribe es-PE
curl -sI -H "cf-ipcountry: MX" -b "locale=es-MX" http://localhost:3000/  # coincide → sin Set-Cookie
curl -sI "http://localhost:3000/?locale=en" -b "locale=es-MX"            # override → en
```

**Mitigación de límite** (api de geo externa gratuita ~1.000 req/día): la geo
client-side externa solo se invoca cuando el hosting no entrega header de país y no
hay cookie. En Vercel/Cloudflare la geo se resuelve por headers en cada request
(sin llamada externa y sin límite).

---

## 2. Paso 0 — Dependencias

```bash
npm i i18next react-i18next
```

Sin zustand ni otras librerías: el estado vive en React Context.

---

## 3. Pasos 1 — Estructura de carpetas a crear

```
lib/locale/
├── domain/
│   ├── locale.types.ts
│   ├── locale.config.ts
│   ├── locale.constants.ts
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
app/components/locale/
├── LocaleProvider.tsx
├── LocaleSplash.tsx
├── LanguageSwitcher.tsx
└── SkipLink.tsx
```

---

## 4. Pasos 2 — Qué copiar tal cual vs. qué adaptar

### Copiar sin cambios (genérico)

| Archivo | Notas |
|---|---|
| `geo-detection.service.ts` | Fuentes `cloudflare /cdn-cgi/trace` → fallback `ipwho.is/`; timeout 5 s; maneja 429/timeout/parse/unmapped |
| `locale-persistence.ts` | Solo cookie `locale` (maxAge 1 año, path=/) |
| `locale-utils.ts` | `isLocaleSupported` + `getLocaleFromNavigator` |
| `locale.types.ts` | `LocaleId`, `LocaleInfo`, `GeoResult`, `LocaleNamespace` |
| `locale.errors.ts` | Códigos de error para logging |
| `useLanguage.ts` | `{ t, i18n, locale, availableLocales, isReady, setPreference, resetLocale }` |
| `useLocale.ts` | `formatNumber` / `formatDate` con `Intl` |
| `LanguageSwitcher.tsx` | Dropdown de idiomas (solo visible en desarrollo) |
| `LocaleProvider.tsx` | Lógica completa de init (bundle regional, geo, cookie, splash) |

### Adaptar a la landing (lo específico)

| Archivo | Qué cambiar |
|---|---|
| `domain/locale.config.ts` | `SUPPORTED_LOCALES` (idiomas y países de tu público) y `LOCALE_MAP` (país→locale, p. ej. `BR: "pt-BR"`) |
| `domain/locale.constants.ts` | `DEFAULT_LOCALE`, `COOKIE_KEY`, `LOCALE_NAMESPACES` (deben coincidir con las secciones de la landing) |
| `domain/locale.types.ts` | Unir los nombres/types de los ids de tus idiomas |
| `infrastructure/i18n.ts` | Imports de los JSON embebidos (default + `en`) y registro de namespaces |
| `server/server-metadata.ts` | Title/description por locale (SEO) |
| `proxy.ts` (raíz) | Matcher (excluir `/locales`) y headers de país de tu hosting |
| `app/components/locale/LocaleSplash.tsx` | Branding (logo/nombre de la marca) |

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

Truco del árbol que respeta el proyecto: **copiar el neutro (`es-LA`) y cambiar SOLO lo regional** (los archivos regionales actuales `= copia idéntica` de es-LA).

### 5.3. Reemplazar strings hardcodeados

- Toda cadena visible → `t("ns:key")`.
- Arrays (bullets, métricas, case studies) → `t("ns:key", { returnObjects: true })`.
- Interpolación → `t("modals:thankYou", { name })`.
- Traducir `aria-label` y `alt`.

---

## 6. Paso 4 — Integración

### 6.1. `app/layout.tsx` (Server Component)

```tsx
const locale = await resolveServerLocale(); // cookie + fallback default
return <html lang={locale}>… <LocaleProvider>{children}</LocaleProvider></html>
```

- `generateMetadata()` → title/description por locale.
- `await cookies()` (asíncronas en Next 16).

### 6.2. `proxy.ts` (raíz)

```ts
export function proxy(request: NextRequest) { … }
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|locales).*)"] }
```

Lógica (se evalúa en CADA request):
1. `?locale=` → gana siempre (override de prueba) y se persiste.
2. Geo del hosting: headers de país (`cf-ipcountry`, `x-vercel-ip-country` …) → `LOCALE_MAP`.
3. Cookie `locale` (solo si 1 y 2 no resolvieron).
4. Header interno `I18N_LOCALE_HEADER` para el SSR (server-metadata, `<html lang>`).
5. `NextResponse.next({ request: { headers } })` + `response.cookies.set(...)` **solo si el locale resuelto difiere de la cookie** (guarda: default sin cookie previa no se persiste).

### 6.3. `LocaleProvider.tsx` (cliente)

- Contexto expone `{ resolvedLocale, isReady, setPreference }`.
- Init (una vez): `?locale=` → `<html lang>` SSR → cookie → geo → navigator → default.
- Carga del bundle regional con `fetch(`/locales/${locale}/translation.json`)` + `i18next.addResourceBundle`.
- `setPreference` = cookie + `changeLanguage` + `router.refresh()`.
- Muestra `LocaleSplash` mientras detecta geo (si no está listo).

### 6.4. Hooks en tu código

```tsx
const { t, locale, setPreference } = useLanguage();
const { formatNumber, formatDate } = useLocale();
```

---

## 7. Paso 5 — Checklist de verificación

- [ ] `npm run lint` y `npm run build` sin errores.
- [ ] `/?locale=es-MX` → muestra el regional en español (override, persiste vía proxy).
- [ ] 1er ingreso sin cookie → geo: cookie regional + `<html lang>` regional.
- [ ] 2ª visita, geo difiere de la cookie → traduce y reescribe cookie.
- [ ] 2ª visita, geo coincide con cookie → no reescribe nada (sin Set-Cookie).
- [ ] Recarga → conserva idioma (cookie).
- [ ] `<html lang>` y `<title>` correctos en SSR y tras cambio en vivo.
- [ ] `LanguageSwitcher` cambia idioma + persiste + refresca SSR.
- [ ] Fallback a default con navegador en otro idioma / geolocalización no mapeada.
- [ ] Simulación: `curl -H "cf-ipcountry: PE" -b "locale=es-MX" http://localhost:3000/` → `set-cookie: locale=es-PE`.

---

## 8. Tipos clave

- **1 sola cookie `locale`** → guarda el último país traducido; se reescribe solo si la geo difiere.
- **Geo del hosting por headers en cada request** (cf-ipcountry, x-vercel-ip-country…) → sin llamada externa ni límites.
- **Geo externa client-side (cloudflare trace → ipwho.is)** → solo cuando el hosting no entrega header y no hay cookie (mitiga el cupo ~1.000 req/día de ipwho.is).
- **Bundles en `public/`** en lugar de embebidos para `es-MX`/`es-AR`…: cache HTTP de navegador, sin bloquear el primer render.
- **Sin prefijo `/en` en URL y sin redirects:** ruteo cookie-only (más simple de mantener).
- **`LanguageSwitcher` visible solo en desarrollo** (se oculta la producción para no exponer la elección manual).

---

## 9. Preguntas a definir por landing

1. ¿Qué locales/países soporta tu público? → `SUPPORTED_LOCALES` + `LOCALE_MAP`.
2. ¿Cuál es el default? → `DEFAULT_LOCALE`.
3. ¿Qué headers de país pone tu hosting? → matcher en `proxy.ts`.
4. ¿Qué secciones tiene la landing? → lista de `LOCALE_NAMESPACES`.