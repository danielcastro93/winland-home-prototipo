# Winland: Home Híbrido (prototipo)

Prototipo funcional del **home multi-vertical** para la raíz de winland.com.mx: reúne casino, deportes, casino en vivo, slots y promociones en una sola página, mobile-first.

## Correr

```bash
npm install
npm run dev        # http://localhost:3210
npm run build      # export estático en out/
```

Stack: **Next.js 16** (pages router, `output: 'export'`) + MUI + Splide. La página se pre-renderiza como sitio estático.

## Estructura del home

1. **Hero / carrusel principal**: banner full-width con la oferta ancla y CTAs. Recomendación: 1er slide imagen, 2º slide video.
2. **Top 10 de juegos**: los juegos más jugados, con prueba social.
3. **Eventos deportivos**: cards con foto, cuotas reales y cupón de apuestas.
4. **Casino en vivo**: mesas con crupieres reales.
5. **Tragamonedas**: vitrina de slots con carrusel auto-deslizante.
6. **Ruleta de juegos**: descubrimiento gamificado ("gira y te recomendamos un juego").
7. **Promociones**: bonos y promos vigentes.

Elementos transversales: **popup promocional** (imagen + CTA medible), **chat de soporte** flotante, **juguetes interactivos** con física real (re-skinneables por temporada) y **cupón** de apuestas.

## Propuesta de navegación

`/propuesta` muestra el mismo home con el menú simplificado (Deportes, Casino, Casino en vivo, Promociones y Torneos) con desplegables, el menú lateral de celular con la misma estructura y un selector para comparar los logos de pago del footer en pastilla blanca o a color (`?logos=chip|color`). La estructura del menú vive en `lib/menu.js`.

## Notas de integración

- Los enlaces del prototipo están neutralizados a `#`; al integrarse apuntarán a las secciones reales (`/deportes`, `/casino`, …).
- El header, footer y bottom-nav usan el marcado y los estilos del sitio; en la integración se conectan los componentes definitivos.
- Widgets externos (sportsbook, chat) se conectan en integración.
- Tipografía **Barlow** vía Google Fonts (licencia OFL, libre): no requiere licencia adicional para el go-live.

## Tipografía

- **Barlow** (Google Fonts, pesos 500/600/700/800) en todo el sitio: titulares, cuerpo, header, footer, CTAs y navegación inferior.

## Capa propia

Estilos en `styles/home.css` (namespace `wl-`): fondo atmosférico sutil, animaciones de entrada, hover de las cards y microinteracciones, todo con `transform`/`opacity` y gateado por `prefers-reduced-motion`.
