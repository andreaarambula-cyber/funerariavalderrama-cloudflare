
## Objetivo

Reemplazar el cotizador con precios por un formulario de **solicitud de propuesta personalizada**, donde el cliente cuenta sus necesidades y recibe una propuesta hecha a medida por un asesor a través de WhatsApp o email.

## Nueva página `/cotizar` — "Solicita tu propuesta personalizada"

### Estructura visual

1. **PageHero** actualizado
   - Eyebrow: "Propuesta personalizada"
   - Título: "Cuéntanos qué necesitas"
   - Subtítulo: "Cada despedida es única. Diseñamos una propuesta a medida según las necesidades de tu familia. Respondemos en menos de 30 minutos, las 24 horas."

2. **Sección principal** con dos columnas (en desktop) / apiladas en mobile:

   **Columna izquierda — Formulario en un solo paso, sin precios:**

   - **Tipo de servicio que necesitas** (chips seleccionables, multi-select):
     - Sepultura tradicional
     - Cremación
     - Velatorio
     - Traslado
     - Plan a futuro
     - Aún no estoy seguro

   - **¿Cuándo lo necesitas?** (radio cards):
     - Es urgente / es ahora
     - En los próximos días
     - Estoy planificando con tiempo

   - **Comuna del Gran Concepción** (input texto con sugerencias).

   - **Cuéntanos más sobre lo que buscas** (textarea, opcional):
     placeholder: "Ej. Velatorio en casa, ceremonia íntima, preferencias religiosas, presupuesto aproximado, etc."

   - **Datos de contacto:**
     - Nombre completo (requerido)
     - Teléfono / WhatsApp (requerido)
     - Email (opcional)
     - **Canal preferido para recibir la propuesta:** WhatsApp / Llamada / Email (radio)

   - Checkbox de consentimiento: "Acepto ser contactado por Funeraria Valderrama"

   - Botón principal: **"Solicitar propuesta"**
   - Botón secundario WhatsApp: **"Prefiero hablar ahora"** → abre WhatsApp directo

   **Columna derecha — Aside informativo (reemplaza el panel de precios):**
   - Card oscura con:
     - "Cómo trabajamos tu propuesta"
     - 3 pasos numerados:
       1. **Recibimos tu solicitud** — la revisa un asesor real, no un bot.
       2. **Diseñamos tu propuesta** — adaptada a tus necesidades, presupuesto y deseos.
       3. **Te contactamos** — en menos de 30 minutos por el canal que elijas.
     - Separador
     - Ítems de confianza: Atención 24/7 · Sin compromiso · Transparencia total · +30 años de experiencia
     - Botón de teléfono directo: "Llámanos ahora +56 9 5390 0931"

3. **Pantalla de confirmación** (después de enviar):
   - Ícono de check
   - "Recibimos tu solicitud, {nombre}"
   - "Un asesor está preparando tu propuesta personalizada y te contactará por {canal elegido} en menos de 30 minutos."
   - Botones: "Conversar por WhatsApp" + "Volver al inicio"

### Comportamiento del envío

Al enviar, el formulario arma un mensaje de WhatsApp con todos los datos de la solicitud y abre `https://wa.me/56953900931?text=...` en una nueva pestaña, además de mostrar la pantalla de confirmación. Esto asegura que la solicitud llega al asesor de inmediato, sin necesidad de configurar email transaccional ni backend.

> Más adelante, si quieres, puedo conectar Lovable Cloud para guardar las solicitudes en una base de datos y enviar un correo automático de confirmación al cliente. Avísame si lo quieres y lo agrego como segundo paso.

## Detalles técnicos

- Se reemplaza por completo el contenido de `src/routes/cotizar.tsx`.
- Se eliminan los arrays `TIPOS / URNAS / ADICIONALES` con precios y la lógica `useMemo` del total.
- Se mantienen y reutilizan: `PageHero`, `cn`, iconos de `lucide-react` (`MessageCircle`, `Phone`, `Check`, `ArrowRight`, `Clock`, `ShieldCheck`).
- Validación mínima en cliente: nombre y teléfono requeridos, consentimiento marcado, al menos un tipo de servicio seleccionado. Mensajes inline.
- Se actualizan los `meta` (title y description) para reflejar "propuesta personalizada" en lugar de "cotización con precios".
- Se revisa la home y el footer para que los textos que digan "Cotizar" / "Cotización online" sigan funcionando (el nombre del CTA puede quedar igual o cambiarlo a "Solicitar propuesta" — lo confirmamos al implementar).
