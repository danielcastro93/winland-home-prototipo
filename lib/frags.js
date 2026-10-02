// Marcado del "chrome" del sitio (header, footer y navegación inferior) construido
// con el design system Calimaco (clases clmc-*), para que el home se integre sin
// fricción con el resto del sitio ya en desarrollo. En este prototipo TODOS los
// enlaces se neutralizan a "#" (el home enlazará a las secciones reales al integrarse).
import desktop from '../data/prod-fragments-desktop.json';
import { MENU } from './menu';

function deadLinks(html) {
  return (html || '').replace(/href="[^"]*"/g, 'href="#"');
}

const CHEVRON = '<svg class="wl-dd__chev" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1.6 1.8 6 6.2l4.4-4.4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ITEM_CHEVRON = '<svg class="wl-dd__go" width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true"><path d="M1.25 1.5 5.75 6l-4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LINK_CLS = 'clmc-main-menu-link clmc-text-nowrap clmc-text-decoration-none clmc-color-secondary clmc-ml-small clmc-mr-small';
const UNDERLINE = '<div><hr class="MuiDivider-root MuiDivider-fullWidth clmc-divider css-9k49o2"></div>';

// Menú principal de la propuesta: 5 opciones; Deportes y Casino con desplegable.
// Los enlaces del desplegable van en el HTML (no se cargan al abrir) para que sigan
// siendo rastreables, y se abre con cursor, con teclado (focus) y con un toque.
function menuPropuestaHTML() {
  const items = MENU.map((m) => {
    if (!m.items) {
      return `<div class="clmc-main-menu-item clmc-flex clmc-row "><a title="Ir a ${m.label}" class="${LINK_CLS}" href="${m.href}">${m.label}</a>${UNDERLINE}</div>`;
    }
    const sub = m.items.map((s) => `<a class="wl-dd__item" role="menuitem" href="${s.href}"><span>${s.label}</span>${ITEM_CHEVRON}</a>`).join('');
    const all = `<a class="wl-dd__all" href="${m.href}">Ver todo ${m.label}${ITEM_CHEVRON}</a>`;
    return `<div class="clmc-main-menu-item clmc-flex clmc-row wl-dd"><a title="Ir a ${m.label}" class="${LINK_CLS} wl-dd__trigger" aria-haspopup="true" aria-expanded="false" href="${m.href}"><span>${m.label}</span>${CHEVRON}</a>${UNDERLINE}<div class="wl-dd__panel" role="menu" aria-label="${m.label}"><div class="wl-dd__list">${sub}</div>${all}</div></div>`;
  }).join('');
  return `<div class="clmc-main-menu clmc-flex clmc-row clmc-align-center clmc-justify-center">${items}</div>`;
}

export function headerHTML(propuesta = false) {
  // Home: ninguna vertical activa en el menú.
  let h = desktop.header.replaceAll(
    'clmc-main-menu-item clmc-flex clmc-row clmc-main-menu-item-active',
    'clmc-main-menu-item clmc-flex clmc-row '
  );
  if (propuesta) {
    const a = h.indexOf('<div class="clmc-main-menu ');
    const b = h.indexOf('<div class="clmc-flex clmc-align-center clmc-justify-end">');
    if (a > -1 && b > a) h = h.slice(0, a) + menuPropuestaHTML() + h.slice(b);
  }
  return deadLinks(h);
}

// Textos alternativos correctos de los logos del footer (en producción cuatro están
// cruzados con la imagen que muestran).
const LOGO_ALT = { 13: 'Caja Popular Tamazula', 14: 'SMB Rural', 15: 'Caja Oblatos', 16: 'Alianza Caja Popular Cerano' };

export function footerHTML(propuesta = false, logos = 'chip') {
  let f = desktop.footer;
  if (propuesta) {
    // Logos a color (mismo nombre de archivo y mismo lienzo que los blancos de producción)
    f = f.replace(/<img([^>]*?)alt="[^"]*"([^>]*?)title="[^"]*"([^>]*?)src="https:\/\/www\.winland\.com\.mx\/static\/images\/footer\/metodo_de_pago(\d+)_footer\.png"/g,
      (all, p1, p2, p3, n) => {
        const alt = LOGO_ALT[n];
        const base = all.replace(/src="[^"]*"/, `src="/assets/img/footer/${logos}/metodo_de_pago${n}_footer.png"`);
        return alt ? base.replace(/alt="[^"]*"/, `alt="${alt}"`).replace(/title="[^"]*"/, `title="${alt}"`) : base;
      });
  }
  return deadLinks(f);
}

// Navegación inferior (solo móvil). Cinco accesos: Menú, Deportes, En vivo,
// Mis apuestas y Casino. En el Inicio ninguna vertical está activa, así que los cinco
// íconos van en su variante neutra (gris #8A8A8A). Íconos locales en
// public/assets/img/menu/mobile — sin dependencias externas en tiempo de ejecución.
const BOTTOM_NAV = [
  { label: 'Menu', icon: 'menu', menu: true },
  { label: 'Deportes', icon: 'deportes' },
  { label: 'En vivo', icon: 'envivo' },
  { label: 'Mis apuestas', icon: 'misApuestas' },
  { label: 'Casino', icon: 'casino' },
];

export function bottomNavHTML() {
  const cell = (it) => {
    const inner =
      `<div class="clmc-mobile-navigation-element clmc-flex clmc-column clmc-align-center clmc-justify-center clmc-cursor-pointer"${it.menu ? ' aria-haspopup="true"' : ''}>` +
      `<img class="clmc-cursor-pointer" alt="${it.label}" src="/assets/img/menu/mobile/${it.icon}.svg">` +
      `<p class="${it.menu ? 'menu-button-text clmc-text-bold clmc-text-center clmc-text-uppercase clmc-text-ellipsis' : 'clmc-mt-small clmc-text-uppercase'}">${it.label}</p>` +
      `</div>`;
    return it.menu
      ? `<div class="clmc-mobile-menu-option">${inner}</div>`
      : `<a href="#" class="clmc-mobile-menu-option clmc-text-decoration-none">${inner}</a>`;
  };
  return (
    `<div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation3 clmc-mobile-navigation">` +
    `<div class="MuiBottomNavigation-root clmc-mobile-navigation-content clmc-flex clmc-align-center clmc-justify-around clmc-text-nowrap">` +
    BOTTOM_NAV.map(cell).join('') +
    `</div></div>`
  );
}
