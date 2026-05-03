## Rediseño del Muro de Velas — más íntimo y cinematográfico

El muro actual funciona pero se ve plano: una grilla rígida de velas pequeñas sobre un fondo oscuro liso. La idea es transformarlo en una **escena nocturna contemplativa**, tipo altar/santuario, que invite a quedarse mirando.

### Cambios visuales

**1. Escenario "noche cálida" en vez de grilla**
- Fondo con gradiente radial profundo (negro azulado arriba → ámbar muy tenue abajo) simulando luz de velas iluminando una sala oscura.
- Textura sutil de partículas/polvo dorado flotando (CSS puro, ~12 puntos con animación lenta de subida y opacidad).
- Resplandor global (vignette dorada) que reacciona a la cantidad de velas: mientras más velas, más cálido se ve el ambiente.

**2. Velas más grandes, sobre "repisas" escalonadas**
- En lugar de grilla uniforme, las velas se acomodan en **3-4 filas escalonadas** (tipo gradas de iglesia / altar), cada fila ligeramente más arriba y con velas un poco más pequeñas hacia el fondo (efecto profundidad).
- Velas más altas y detalladas (mejor SVG: cera con highlight lateral, mecha negra, base con sombra).
- Cada vela proyecta un **halo de luz radial** (box-shadow dorado difuso) sobre su zona, creando charcos de luz que se solapan.
- Reflejo sutil debajo de cada vela (gradiente vertical invertido) como si estuvieran sobre madera pulida.

**3. Llama más viva**
- Reemplazar las elipses planas por una llama con 2 capas: núcleo blanco-azulado + manto dorado, con animación más orgánica (combinar `flicker` actual con un leve `sway` rotacional ±2°).
- La intensidad del flicker se desincroniza más entre velas (ya hay delay, pero también variar duración).
- Respeto a `prefers-reduced-motion`: llamas estáticas con glow.

**4. Interacción mejorada**
- Hover: la vela enfocada **crece levemente** (scale 1.08), su halo se intensifica y las demás se atenúan suavemente (opacity 0.55) — efecto "spotlight".
- Tooltip rediseñado: card flotante con borde dorado fino, fondo casi negro translúcido, tipografía serif para el nombre y cursiva para la dedicatoria. Aparece con `fade-in + translate-y`.
- Tap en mobile: abre un **bottom-sheet** pequeño con la dedicatoria completa (mejor que tooltip que se corta en pantallas chicas).

**5. Vela recién encendida = protagonista**
- Al encender una vela nueva, se inserta al frente con animación: aparece con `scale-in` desde 0, la llama hace un "destello" inicial (flash dorado de 600ms) y el contador del título sube con una pequeña animación.
- Toast de confirmación: "Tu vela arde por {nombre}".

**6. Header de la sección rediseñado**
- En vez de "{N} velas encendidas" como h2 plano, mostrar:
  - Eyebrow "Muro de velas"
  - Título serif: "Enciende una luz por {nombre}"
  - Línea divisoria dorada
  - Contador grande estilo medallón: número en serif + label "velas encendidas" debajo
- Botón "Encender una vela" rediseñado con icono de llama animada y un sutil glow dorado pulsante para invitar al click.

**7. Modal más íntimo**
- Fondo del modal con la misma escena nocturna (no gris plano).
- Vela animada grande arriba del formulario en vez del icono Flame de Lucide.
- Microcopy más cálido: "Tu llama acompañará a la familia de {nombre}" en lugar del genérico actual.

### Detalles técnicos

- **Archivo**: refactor completo de `src/components/memorial/CandleWall.tsx`. Sin nuevas dependencias.
- **Tokens**: agregar a `src/styles.css`:
  - `--candle-glow: oklch(0.85 0.18 75 / 0.45)` (color del halo)
  - `--candle-night: gradiente radial para el escenario)
  - Keyframes nuevos: `candle-sway`, `candle-flash`, `dust-float`
- **SVG de la vela**: componente `CandleSVG` reescrito con prop `size` ('sm'|'md'|'lg') para las gradas escalonadas.
- **Layout escalonado**: usar 3 contenedores flex con `justify-center` y márgenes negativos verticales para superponer las filas, en vez de grid. Las velas se reparten round-robin entre filas.
- **Accesibilidad**: mantener todos los `aria-label`, focus visible con anillo dorado, `prefers-reduced-motion` desactiva sway/dust/flicker (glow estático).
- **Performance**: máximo ~40 velas visibles; si hay más, mostrar "+N velas más" con botón "Ver todas" que abre un dialog con la grilla completa simple.

### Lo que NO cambia

- La lógica de encender velas (state local, mock) sigue igual.
- La estructura de datos `Candle` no cambia.
- El modal de formulario mantiene los mismos campos.

### Resultado

Una sección que se siente como entrar a una capilla en penumbra: cálida, viva, contemplativa. La gente va a querer mover el cursor entre las velas solo para verlas brillar.
