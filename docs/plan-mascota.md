# Plan de acción: Mascota Amauta

## FASE 1 — Limpiar: Quitar FAB flotante y bubble del Hero

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `app/page.tsx` | Eliminar import y componente `<Mascot>` (FAB flotante) |
| `components/Hero.tsx` | Eliminar `isScrolled`, la mascota siempre visible sin desaparecer. Eliminar props `bubbleMessage`, `mascotMood`, `activeSection`, `onMascotSpinClick`, `onHoverEvent`, `onLeaveEvent` |
| `components/Mascot/MascotContainer.tsx` | Eliminar o archivar |
| `components/Mascot/MascotFigure.tsx` | Simplificar: quitar dependencia de `isScrolled`, tamaño fijo responsive |
| `components/Mascot/MascotBubble.tsx` | Eliminar o archivar |
| `components/Mascot/MascotFab.tsx` | Eliminar o archivar |
| `app/hooks/useMascotPage.tsx` | Eliminar `isScrolled`, `activeSection`, `bubbleMessage`, `mascotMood`. Mantener solo `handleHoverEvent`/`handleLeaveEvent` si otras secciones lo referencian |
| `components/Features.tsx` | Eliminar `onHoverFeature`/`onLeaveFeature` |
| `components/HowItWorks.tsx` | Eliminar `onHoverStep`/`onLeaveStep` |
| `components/InteractivePreview.tsx` | Eliminar `onMascotCallback` |
| `components/CTASection.tsx` | Eliminar `onHoverEvent`/`onLeaveEvent` |
| `app/types.ts` | Eliminar `MascotMood` si ya no se usa |

**Resultado**: Mascota solo en Hero, estática, sin burbuja, sin FAB.

---

## FASE 1.5 — Investigar: Benchmark Duolingo vs Amauta

### Secciones actuales de Amauta

```
1. Hero           (#inicio)
2. Features       (#caracteristicas) — problemas + imágenes
3. HowItWorks     (#como-funciona) — timeline con pasos
4. InteractivePreview (#reto) — quiz interactivo
5. Survey         (#encuesta) — feedback
6. Trust + Offline (#confianza-offline) — early adopters + offline
7. CTA Final      (#empieza-ahora)
8. Footer
```

### Secciones profesionales que NO tenés (benchmark Duolingo/Khan Academy)

| Sección | Descripción | Prioridad |
|---|---|---|
| **Social Proof** | "Más de 500 familias confían", logos de medios, estrellas de rating | Alta |
| **Testimonios reales** | Carrusel de padres/niños con foto, nombre, cita real | Alta |
| **Pillars de solución** | En vez de mostrar el problema, mostrar beneficios: adaptativo, offline, gamificación | Media |
| **FAQ** | Preguntas frecuentes que resuelven objeciones de padres | Media |
| **Pricing** | Free vs Premium (si aplica en el futuro) | Baja |

### Recomendaciones

1. Agregar sección **Social Proof** después del Hero
2. Agregar sección **Testimonios** antes del CTA final
3. Convertir la sección **Features** actual (basada en problemas) en **Pillars de solución**

---

## FASE 2 — Agregar nuevas secciones

- **Social Proof**: "Más de 500 familias ya confían en Amauta" con avatares, logos
- **Testimonios**: Carrusel de cards con foto de padre/madre, nombre, ubicación y cita
- **FAQ**: Acordeón con objeciones comunes (precio, edad, internet, tiempo)

---

## FASE 3 — Integrar mascota como ilustración en cada sección

| Sección | Integración |
|---|---|
| **Hero** | Ya está — mantener figura del cóndor al lado del título |
| **Social Proof** (nueva) | Cóndor con binoculares: "mira quiénes ya confían" |
| **Pillars/Soluciones** | Cóndor pequeño como guía al lado de cada card |
| **HowItWorks** | Cóndor como parte de la línea de tiempo, señalando el paso actual |
| **Testimonios** (nueva) | Cóndor escuchando con pluma escribiendo |
| **CTA Final** | Cóndor apuntando al botón "Empieza gratis" |

---

## Resumen por fases

```
FASE 1:  Quitar FAB + bubble + limpiar dependencias
FASE 1.5: Investigar qué secciones agregar (Duolingo benchmark)
FASE 2:   Agregar nuevas secciones (Social Proof, Testimonios, FAQ)
FASE 3:   Integrar mascota como ilustración en cada sección
```
