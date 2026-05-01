## Pack Memorial Vivo — Plan

Convertir la página de obituario (`/obituarios/$slug`) en una **experiencia digital viva** sin necesidad de backend todavía. Todo funciona con estado local + datos mock; cuando activemos Lovable Cloud, solo conectamos.

---

### 1. Velas con dedicatoria + muro animado

Reemplazar el contador de velas actual por algo más rico:

- Al hacer clic en **"Encender una vela"**, se abre un modal pidiendo:
  - Nombre (requerido)
  - Mensaje corto opcional (máx. 80 caracteres)
- Las velas se muestran como un **muro de llamas titilantes** (cuadrícula responsive, 6-8 columnas en desktop, 3-4 en mobile).
- Cada llama es un SVG con animación CSS suave (flicker via keyframes `opacity` + `transform`).
- Al pasar el cursor (o tap en mobile) se abre un tooltip con nombre + dedicatoria + "hace X tiempo".
- Pre-cargamos 8-12 velas mock por obituario para que se vea poblado desde el inicio.

### 2. Línea de tiempo de vida ("Su historia")

Sección nueva con **timeline vertical** elegante:

- Línea central dorada con puntos en cada hito.
- Cada hito tiene: año, título, descripción corta, opcional foto/icono.
- Animación `fade-in` + `slide` al hacer scroll (IntersectionObserver).
- Datos mock por obituario: 5-7 hitos típicos (nacimiento, matrimonio, hijos, profesión, jubilación, etc.).
- En mobile: timeline a la izquierda, contenido a la derecha en una sola columna.

### 3. Galería colaborativa de recuerdos

Mosaico tipo masonry con fotos + un botón **"Aportar un recuerdo"**:

- Grid masonry responsive (CSS columns).
- 6-9 fotos mock por obituario (usaremos las imágenes existentes + generamos algunas nuevas tipo álbum familiar sepia).
- Botón abre modal: "Sube una foto y cuéntanos el momento" (UI completa, sin upload real todavía — toast: *"Tu recuerdo será revisado por la familia"*).
- Hover en cada foto: leyenda con autor + caption.

### 4. Anécdotas tipo polaroid

Sección **"Mejores recuerdos"**:

- Tarjetas tipo polaroid (fondo blanco, sombra suave, ligera rotación aleatoria de -3° a +3°).
- Cada tarjeta: cita en fuente serif grande, autor abajo en cursiva.
- 4-6 anécdotas mock + formulario al final: *"¿Cuál es tu mejor recuerdo con [nombre]?"*
- Al enviar, se agrega al inicio con animación `scale-in`.

### 5. Agenda del velatorio + mapa + calendario

Reemplazar la card simple actual de "Velatorio" por una sección completa **"Despedida"**:

- Cards con horarios de eventos (velatorio, misa, cortejo, sepultación) — mock 2-3 eventos por obituario que tengan velatorio.
- Cada evento: ícono, fecha/hora, dirección, botones:
  - **Cómo llegar** → abre Google Maps con la dirección
  - **Agregar a mi calendario** → genera y descarga archivo `.ics` (función pura, sin libs)
- Embed estático de mapa (iframe de Google Maps con dirección — sin API key).
- Botón **"Confirmar asistencia"** → modal RSVP (nombre + cantidad de personas, toast de confirmación).

### 6. QR descargable del memorial

Card en el sidebar **"Comparte este memorial"**:

- Genera un **QR** con la URL del memorial usando la librería `qrcode` (pequeña, edge-compatible).
- Botones: **Descargar QR** (PNG) + **Copiar enlace**.
- Caso de uso explicado: *"Imprime este QR en el recordatorio del funeral o en una placa conmemorativa."*

---

### Estructura técnica

**Datos mock** — extender `src/data/obituaries.ts`:

```ts
type Obituary = {
  // ... existente
  timeline: { year: string; title: string; description: string }[];
  gallery: { src: string; caption: string; author: string }[];
  anecdotes: { author: string; text: string }[];
  candles: { name: string; message?: string; timeAgo: string }[]; // ahora array
  events: { type: string; date: string; address: string; lat?: number; lng?: number }[];
};
```

**Componentes nuevos** en `src/components/memorial/`:
- `CandleWall.tsx` — muro animado + modal "encender vela"
- `LifeTimeline.tsx` — timeline con scroll-reveal
- `MemoryGallery.tsx` — masonry + modal aportar
- `AnecdoteWall.tsx` — polaroids + form
- `FarewellAgenda.tsx` — eventos + .ics + RSVP
- `MemorialQR.tsx` — QR + descarga

**Helpers** en `src/lib/`:
- `ics.ts` — genera string `.ics` (función pura, ~30 líneas)

**Dependencias nuevas:**
- `qrcode` (~50KB, edge-compatible) para el QR

**Página `/obituarios/$slug`** — reorganizada en secciones:
1. Hero (existente, sin cambios mayores)
2. Vida — Timeline
3. Galería de recuerdos
4. Mejores anécdotas
5. Despedida (agenda + mapa)
6. Muro de velas
7. Mensajes de condolencia (existente)
8. Sidebar sticky con: QR + compartir + (velatorio se mueve a sección Despedida)
9. Otros memoriales (existente)

**Animaciones:** usar `animate-fade-in`, `animate-scale-in` ya disponibles, + un keyframe `flicker` nuevo en `styles.css` para las velas.

**Accesibilidad:** modales con focus trap (usar `Dialog` de shadcn), todos los botones con `aria-label`, animaciones respetan `prefers-reduced-motion`.

---

### Lo que NO entra en este pack (futuro)

- Música ambiente (necesita decisión de UX para el autoplay)
- Mapa interactivo de "de dónde vienen los recuerdos" (mejor con backend)
- Transmisión en vivo (necesita backend + proveedor)
- Carta IA (necesita Lovable AI Gateway)
- Cápsula del tiempo (necesita backend + cron)
- Notificaciones por email (necesita backend)

Estos los agregamos cuando actives Lovable Cloud.

---

**Resultado:** una página de obituario que se siente como una experiencia memorial completa, lista para wow-factor en demo, sin esperar al backend.