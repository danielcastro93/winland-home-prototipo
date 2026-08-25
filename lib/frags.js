// Fragmentos de HTML cosechados de producción (winland.com.mx) — se renderizan
// tal cual para garantizar fidelidad 1:1 con el sitio real.
// En este prototipo TODOS los enlaces se neutralizan a "#" (decisión del cliente:
// el home enlazará a las secciones reales del sitio al integrarse; aquí, links muertos).
import desktop from '../data/prod-fragments-desktop.json';
import mobile from '../data/prod-fragments-mobile.json';

function deadLinks(html) {
  return (html || '').replace(/href="[^"]*"/g, 'href="#"');
}

export function headerHTML() {
  // Home nuevo: ninguna vertical activa en el menú.
  return deadLinks(desktop.header).replaceAll(
    'clmc-main-menu-item clmc-flex clmc-row clmc-main-menu-item-active',
    'clmc-main-menu-item clmc-flex clmc-row '
  );
}

export function footerHTML() {
  return deadLinks(desktop.footer);
}

export function bottomNavHTML() {
  // Sin vertical activa (estamos en Inicio); íconos en su variante normal.
  let h = deadLinks(mobile.bottomNav || '');
  h = h.replace('clmc-mobile-navigation clmc-hidden', 'clmc-mobile-navigation');
  h = h.replace(/\s*active-menu-option/g, '').replace(/_active\.svg/g, '.svg');
  return h;
}
