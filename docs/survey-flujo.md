# Encuesta Amauta — Flujo de Datos

## Arquitectura

```
[Usuario] ↔ [AmautaSurvey.tsx] ↔ [API Routes] ↔ [Upstash Redis]
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
          GET /api/survey/stats               POST /api/survey/vote
          (leer contadores)                    (guardar voto)
```

## Archivos implementados

| Archivo | Propósito |
|---------|-----------|
| `lib/redis.ts` | Cliente Redis singleton (reutilizable) |
| `app/api/survey/stats/route.ts` | GET — devuelve contadores agregados |
| `app/api/survey/vote/route.ts` | POST — guarda voto con deduplicación |
| `components/AmautaSurvey.tsx` | Componente frontend conectado al API |

---

## Caso de uso 1: Usuario nuevo (nunca ha votado)

```
Página carga
  └── useEffect() en AmautaSurvey
        ├── Lee localStorage → 'amauta_interest_survey_completed' = null
        │     └── voted = false
        ├── GET /api/survey/stats
        │     └── Redis HGETALL survey:stats → { total: 247, loveIt: 184, ... }
        │           ├── Éxito → setStats(data.stats)
        │           └── Error → stats se queda en 0 (sin error visible)
        └── setLoading(false)
```

**Lo que ve el usuario**: Skeleton del formulario → formulario completo con stats en vivo.

---

## Caso de uso 2: Usuario llena y envía la encuesta (happy path)

```
Usuario completa formulario → hace clic en "Enviar mi Voto"
  └── handleSubmit()
        ├── Genera voteId con crypto.randomUUID()
        ├── localStorage.set('amauta_interest_survey_completed', 'true')
        ├── setVoted(true) → muestra pantalla de gracias inmediatamente
        ├── Actualiza stats localmente (optimista)
        │
        └── POST /api/survey/vote { voteId, interest, feature, comments, name }
              │
              └── Servidor (vote/route.ts):
                    ├── SETNX survey:dedup:{voteId} → atómico, evita duplicados
                    │     └── Si ya existe → return success (ignorar)
                    ├── EXPIRE 24h (limpieza automática)
                    ├── HINCRBY survey:stats total 1
                    ├── HINCRBY survey:stats loveIt/interested/unsure 1
                    ├── HINCRBY survey:stats prefMascot/prefGames/... 1
                    ├── LPUSH survey:responses (si hay comments o name)
                    └── return { success: true }
              │
              └── Respuesta OK:
                    ├── showNotification('¡Voto registrado correctamente!')
                    └── GET /api/survey/stats (refrescar stats reales)
```

**Lo que ve el usuario**: Pantalla de gracias con barras animadas y porcentajes actualizados.

---

## Caso de uso 3: POST falla (sin conexión / error de red)

```
handleSubmit()
  ├── localStorage.set('amauta_interest_survey_completed', 'true') ← optimista
  ├── setVoted(true) ← muestra gracias inmediatamente
  │
  └── POST /api/survey/vote → ❌ Error (timeout, 500, sin internet)
        │
        └── catch:
              ├── localStorage.set('amauta_survey_pending', JSON.stringify(voto))
              ├── showNotification('Guardado localmente. Se sincronizará cuando haya conexión.')
              │
              └── setTimeout 3s → reintentar POST
                    ├── Éxito → localStorage.removeItem('amauta_survey_pending')
                    │           showNotification('¡Tu voto se sincronizó!')
                    │           GET /api/survey/stats
                    │
                    └── Error → queda en cola para próximo ciclo
```

**Lo que ve el usuario**: Pantalla de gracias + notificación "Guardado localmente".

---

## Caso de uso 4: Usuario regresa (ya votó antes)

```
Página carga
  └── useEffect()
        ├── localStorage.getItem('amauta_interest_survey_completed') = 'true'
        │     └── setVoted(true) → instantáneo, sin flicker
        │
        ├── GET /api/survey/stats
        │     └── Actualiza stats y barras suavemente cuando llegan
        │
        └── localStorage.getItem('amauta_survey_pending') → ¿hay pendiente?
              └── Sí → POST /api/survey/vote (reintentar)
                    ├── Éxito → limpiar pending + notificación
                    └── Error → queda para próxima vez
```

**Lo que ve el usuario**: Pantalla de gracias inmediata, barras se animan cuando llegan los datos frescos.

---

## Caso de uso 5: GET /api/survey/stats falla

```
Cualquier escenario donde falle el GET:
  ├── catch → silencioso, no se muestra error
  └── stats se queda en 0 (o en el último valor conocido)
```

**Lo que ve el usuario**: Barras en 0% (o datos anteriores). Sin error visible. Las stats son contenido secundario/decorativo.

---

## Deduplicación de votos

### ¿Cómo funciona?

```typescript
// Cliente: genera ID único por voto
const voteId = crypto.randomUUID()

// Servidor: verifica con SETNX (atómico)
const dedupKey = `survey:dedup:${voteId}`
const isNew = await redis.setnx(dedupKey, '1')
if (!isNew) return Response.json({ success: true }) // ya procesado
await redis.expire(dedupKey, 60 * 60 * 24) // TTL 24h
```

### ¿Qué escenarios cubre?

| Escenario | ¿Duplicado? | ¿Qué pasa? |
|-----------|-------------|------------|
| POST llega 1 vez | ❌ | Se procesa normalmente |
| Cliente reintenta porque no recibió 200 OK | El 2do request llega | `SETNX` retorna 0 → se ignora |
| Usuario envía 2 veces el mismo formulario (rápido) | 2 voteId distintos | Se procesan ambos (son votos distintos) — correcto |

### ¿Qué NO cubre?

Si el usuario abre 2 pestañas y envía la encuesta en ambas, son 2 `voteId` distintos y 2 votos válidos. Esto es el comportamiento deseado.

---

## Estructura de datos en Redis

### Hash: `survey:stats`

```
survey:stats → {
  total:        248,
  loveIt:       185,
  interested:   48,
  unsure:       15,
  prefMascot:   93,
  prefGames:    88,
  prefDashboard: 45,
  prefOffline:  22
}
```

### List: `survey:responses` (solo si hay comments o name)

```
survey:responses → [
  "{ \"voteId\": \"abc-123\", \"interest\": \"high\", \"feature\": \"mascot\", \"comments\": \"...\", \"name\": \"...\", \"createdAt\": \"...\" }",
  ...
]
```

### Keys de deduplicación: `survey:dedup:{voteId}`

```
survey:dedup:abc-123 → "1" (TTL: 24h)
```

---

## Variables de Entorno

Archivo `.env.local` (no se sube a git):

```env
UPSTASH_REDIS_REST_URL="https://primary-mole-166911.upstash.io"
UPSTASH_REDIS_REST_TOKEN="********"
```
