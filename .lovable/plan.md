## Objetivo

Mejorar la jerarquía y atractivo de las tarjetas en la sección "Recursos para el camino" (`BlogTeaser` en `src/routes/index.tsx`), sin agregar imágenes, newsletter ni nuevas funcionalidades.

## Cambios en `src/routes/index.tsx` — componente `BlogTeaser`

### 1. Enriquecer los datos de cada post
Agregar `author` y `date` al objeto de cada artículo:
- "Duelo" → autora ej. *María González · 12 Mar 2025*
- "Trámites" → *Equipo Valderrama · 28 Feb 2025*
- "Tradiciones" → *Andrés Rivas · 5 Feb 2025*

### 2. Hover más expresivo
- Mantener el `-translate-y-0.5` y `shadow-elevated` actual.
- Agregar transición de borde a `border-accent/40` en hover.
- El título cambia sutilmente de color a `text-accent-foreground` en hover (transición suave).

### 3. CTA "Leer artículo" como botón visible
Reemplazar el `<span>` de texto plano por un botón ghost real:
- Fondo `bg-secondary/60`, hover `bg-accent text-accent-foreground`.
- Padding `px-4 py-2`, `rounded-full`, texto `text-sm font-medium`.
- Mantiene el icono `ArrowRight` con micro-animación (`group-hover:translate-x-0.5`).

### 4. Mejor jerarquía interna de la tarjeta
Reordenar el contenido para que respire mejor:
```text
[Categoría · tiempo lectura]   ← chip pequeño arriba
[Título grande]                ← protagonista
[Autor · fecha]                ← meta info sutil, text-xs muted
─────────                      ← separador sutil (border-t)
[Botón "Leer artículo →"]      ← CTA al fondo
```

- Convertir la tarjeta en `flex flex-col` para que el botón quede pegado abajo (`mt-auto`) y todas las tarjetas tengan misma altura.
- La categoría pasa a ser un chip con fondo `bg-accent/10 text-accent-foreground` redondeado en lugar de texto suelto.
- Separador horizontal (`border-t border-border`) entre el bloque de texto y el CTA.

### 5. Pequeños detalles de pulido
- `gap-7` entre tarjetas en desktop para dar más aire.
- `p-7` se mantiene; añadir `pt-6` después del separador.
- Cursor pointer en toda la tarjeta para indicar clickabilidad.

## Resultado esperado

Las tarjetas pasan de bloques planos de texto a piezas con jerarquía clara: chip de categoría → título → meta → CTA visible. Misma altura entre tarjetas, hover más vivo, y el botón "Leer artículo" se vuelve la acción evidente sin necesidad de imágenes ni nuevos componentes.
