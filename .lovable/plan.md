## Cambios

**1. Quitar "Servicios complementarios"** (`src/routes/servicios.tsx`)
- Eliminar la sección completa (líneas 219–243) que muestra el grid de extras.
- Si el array `extras` y los íconos asociados quedan sin uso, removerlos también del archivo para limpieza.

**2. Quitar "Plan a futuro"**
- En `src/routes/index.tsx`: eliminar el componente `PlanFuturoCTA` y su llamada en `HomePage` (línea 31 y definición línea 289–~350). Si `flowersImg` queda sin uso, eliminar el import.
- En `src/components/site/SiteFooter.tsx`: eliminar el `<FooterLink to="/planes">Plan a futuro</FooterLink>` (línea 41).

**3. Quitar "Planes y precios"**
- Eliminar el archivo `src/routes/planes.tsx` completo (incluye PageHero, simulador de financiamiento y sección Plan a futuro).
- Quitar el item `{ to: "/planes", label: "Planes" }` del array `nav` en `src/components/site/SiteHeader.tsx`.
- En `src/routes/index.tsx` (Hero u otras secciones), revisar y reemplazar cualquier `<Link to="/planes">` por `/cotizar` o quitarlo.
- En `src/components/site/SiteFooter.tsx`: ya quitado en paso 2 (era el único link a `/planes`).
- El `routeTree.gen.ts` se regenera automáticamente por el plugin de TanStack Router.

**4. Verificación final**
- Buscar referencias residuales a `/planes` en todo `src/` y removerlas para evitar errores de tipo de TanStack Router.
