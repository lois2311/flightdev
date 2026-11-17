# ADR-002: Plan de vuelo ligado al scroll con CSS nativo, sin GSAP ni Lenis

Estado: aceptado · 2026-11-17 · Reabre la decisión de `FLIGHTDEV_MOTION_SYSTEM.md` que retiró "la línea de proceso dirigida por el scroll".

## Contexto

La auditoría (A1, A8) encontró que el concepto de vuelo desaparecía tras el hero y que nada indicaba en qué parte del recorrido estaba el lector. Las referencias premiadas (Longines Flyback) resuelven esto con un viaje continuo, normalmente con GSAP ScrollTrigger y scroll suavizado.

## Decisión

- Cada sección es un tramo (`home/Leg.tsx`) con código, nombre y siguiente *waypoint*, y una línea discontinua en el margen.
- La línea se dibuja con `animation-timeline: view()` sobre `clip-path`, dentro de `@supports (animation-timeline: view())` y `prefers-reduced-motion: no-preference`. Sin soporte o con movimiento reducido, la línea está completa desde el inicio.
- El header muestra los *waypoints* como rombos sobre la línea de progreso existente y el tramo activo (medido una vez por ruta y al redimensionar, leído en el rAF que ya existía).
- Sin GSAP, sin Lenis, sin fijar escenas (*pinning*).

## Por qué se reabre

La línea retirada decoraba un proceso. Esta une *waypoints* con contenido real: cada tramo nombra su sección y la siguiente, y el header lo refleja. Es CSS sin JS, no bloquea ni secuestra el scroll, y no retrasa la lectura.

## Consecuencias

- 0 KB de JS nuevos para el efecto. Safari y Firefox sin `animation-timeline` ven la línea completa (degradación aceptable).
- El tramo activo del header se oculta bajo `lg` por falta de espacio; los rombos siguen visibles.
