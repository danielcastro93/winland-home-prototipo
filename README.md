# Winland Home Híbrido — Prototipo funcional

Prototipo del home multi-vertical para la raíz de winland.com.mx, construido con el **mismo stack de producción** y la **réplica exacta del design system**. Implementa la propuesta de `../docs/07-propuesta-home-hibrido.md`.

## Correr

```bash
npm install
npm run dev        # http://localhost:3210
npm run build      # export estático en out/ (igual que producción: nextExport)
```

## Qué es réplica exacta (sin modificar)

- **Header, footer y bottom nav móvil: el HTML REAL de producción** (`data/prod-fragments-*.json`, cosechados del sitio), renderizado tal cual con el CSS compilado real (`public/prod/emotion.css` + `winland-prod.css`, mismo orden de carga que producción). Indistinguibles del sitio.
- `public/prod/fonts/DenimINK.ttf` — la fuente real (⚠️ TRIAL en producción: licenciar + WOFF2 para el go-live).
- Cards de juego con clases reales `.clmc-machine` (hover de barrido naranja, corazón de favoritos, rank 88px con text-stroke), filas Splide, badge contador.
- **Todos los enlaces del prototipo están neutralizados a `#`** (decisión del cliente): al integrarse, apuntarán a las secciones reales (`/deportes`, `/casino`, …).
- `public/assets/img/promos/` — las 5 imágenes REALES de las promos vigentes (CUPON2026, JONRON, WEEKEND, 200DAY slots, BONO W) del CMS de producción. Favicon real.

## Estructura del home (v3)

1. **H1 SEO** ("Casa de apuestas deportivas y casino en línea en México") como tagline de producto.
2. **Hero cinematográfico** — slider full-width con los 5 banners REALES de promos (fade + Ken Burns sutil + barrido naranja de marca — la misma firma del hover de cards de producción) con CTA por slide.
3. **Chips por vertical con la ICONOGRAFÍA REAL** (`/assets/img/menu/mobile/*.svg` de producción).
4. **Cinta de momios** (marquee continuo con flip verde/rojo al cambiar una cuota).
5. **Cuotas que emocionan** — **widget REAL de Altenar embebido**: `altenarWSDK.init({ integration: 'winland.mx', culture: 'es-ES' })` + `addWidget({ widget: 'WTopLeagues' })` — el mismo componente "Ligas principales" que consume el sitio, con datos e iconografía en vivo (fallback de réplica si el WSDK no pinta).
6. **La sala brilla** — Top 20 / Juegos Nuevos / Crash Games (datos reales de Calimaco, íconos reales de categoría `menu-lobby/casino/CASINO*.png`).
7. **La mesa te espera** — casino en vivo (arte real de Evolution, tratamiento glass).
8. **Promociones activas** — cards reales de /promociones (imagen + Leer más / Ingresar, tabs MUI).
9. Footer real de producción (incluye el bloque SEO "Más información sobre Winland") + bottom nav + sticky CTA móvil.

Capa nueva en `styles/home.css` (namespace `wl-`): fondo atmosférico sutil de marca, reveals, marquee, glow reactivo en cards, glass. Todo `transform`/`opacity` y gateado por `prefers-reduced-motion`. (Retirado por feedback: transición "estadio⇄casino", partículas, El premio / Casa segura / Winland móvil.)

## Datos

- `public/assets/data/lobby-*.json` — respuestas REALES de la API pública de Calimaco (`wallet.winland.mx/api/contents/getLobby`, `company=WLM`) capturadas el 13/08/2026. `public/assets/thumbs/` espeja los thumbnails del CMS (fallback automático al CMS real).
- Simulado para la demo (marcado en código): movimientos de cuotas (en integración: WSDK Altenar ya embebido), montos/alias de ganadores (API `getLastWinners` existe en el SDK; confirmar parámetros con Calimaco), torneo pit-lane (`getTournamentsLobby`/`getMissions` existen sin uso).

## SEO (la diferencia clave vs producción)

`npm run build` genera `out/index.html` **pre-renderizado**: title único, meta description, canonical, Open Graph, JSON-LD (Organization + WebSite/SearchAction), H1 de dominio y ~12,000 caracteres indexables — contra el shell vacío de 4 KB que hoy sirve la raíz real. Checklist completo de go-live en `../docs/08`.

## Integración

Ver `../docs/08-plan-de-integracion-y-redirecciones.md`. En corto: es una página Next más dentro del proyecto del cliente; los data-providers de snapshot se sustituyen por las llamadas del SDK ya existentes; el redirect de deep-links `#/…` → `/deportes` está implementado (en `pages/index.jsx`, hoy en modo log).
