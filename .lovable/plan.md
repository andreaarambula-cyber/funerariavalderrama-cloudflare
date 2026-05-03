## Problema

En la página `/obituarios/$slug`, la foto del retrato del hero ocupa demasiado espacio vertical en mobile/tablet (la viewport actual es 768px). En el breakpoint `md:` la columna es de 220px pero usa `md:w-full`, lo que hace que en pantallas medianas la foto quede grande respecto a la información al lado.

## Cambios en `src/routes/obituarios.$slug.tsx`

Hero header (líneas ~99-108):

1. **Reducir el ancho de la columna de la foto** en el grid:
   - De `md:grid-cols-[220px,1fr]` a `md:grid-cols-[160px,1fr]` (desktop más compacto).

2. **Reducir el tamaño máximo del contenedor de la imagen**:
   - De `w-40 sm:w-48 md:w-full` a `w-32 sm:w-36 md:w-40` (foto pequeña y consistente en todos los breakpoints).
   - Mantener `aspect-[4/5]`, bordes y sombras.

3. **Alinear mejor con la información**:
   - Cambiar `md:items-end` a `md:items-center` para que la foto pequeña quede centrada verticalmente respecto al bloque de texto.

4. **Ajustar el tamaño del título** si es necesario para mantener la jerarquía visual (el `h1` queda como `text-4xl md:text-6xl` — se mantiene, ahora la información dominará el header como se desea).

## Resultado esperado

La foto del retrato pasa a ser un elemento compacto (~128–160px de ancho) en todos los tamaños, dejando que el nombre, fechas, ubicación y resumen sean los protagonistas del header del memorial.
