## Objetivo

Reemplazar la sección estática `TrustBar` (los 4 ítems: +30 años, SEREMI, 24/7, Cobertura) por un **carrusel/marquee horizontal infinito** que desliza los ítems hacia la izquierda de forma continua, dándole más vida y dinamismo.

## Cómo se verá

- Una franja del mismo color de fondo (`bg-surface`) bajo el hero.
- Los ítems (icono + texto) se desplazan suavemente de derecha a izquierda en loop infinito, sin cortes ni saltos.
- Al pasar el mouse, la animación se pausa (mejora accesibilidad/lectura).
- Bordes laterales con un leve degradado (fade) para que los ítems "aparezcan" y "desaparezcan" con suavidad.
- Se duplicarán los ítems para lograr el loop continuo perfecto.
- Se agregarán 2–3 ítems extra para enriquecer el contenido rotativo, por ejemplo:
  - +30 años de experiencia
  - Registrados en SEREMI
  - Atención 24/7
  - Cobertura nacional
  - Más de 10.000 familias acompañadas
  - Transparencia en precios
  - Trámites incluidos

## Cambios técnicos

1. **`src/routes/index.tsx`** — Refactorizar la función `TrustBar`:
   - Eliminar el `grid` estático.
   - Renderizar dos copias consecutivas de la lista de ítems dentro de un contenedor flex con `animate-marquee` y `aria-hidden` en la copia duplicada.
   - Wrapper con `overflow-hidden` y máscara CSS lateral (`mask-image: linear-gradient(...)`) para el efecto fade en los bordes.
   - Clase `group` + `group-hover:[animation-play-state:paused]` para pausa al hover.

2. **`src/styles.css`** — Añadir:
   - Keyframes `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`.
   - Utility `.animate-marquee { animation: marquee 35s linear infinite; }`.
   - (Opcional) `@media (prefers-reduced-motion: reduce)` para detener la animación.

3. No se tocan otros archivos. La `AnnouncementBar` sigue tal cual (rotador fade arriba).

## Resultado

La barra deja de sentirse estática: los sellos de confianza se deslizan continuamente, similar a un ticker de marca, manteniendo el estilo sobrio (icono dorado + texto en mayúsculas suaves) ya presente.
