// Snapshots REALES capturados de la API pública de Calimaco (wallet.winland.mx/api/contents)
// el 13/08/2026. En integración se sustituyen por llamadas vivas del SDK (getLobby/getBanners…).
import top20 from '../public/assets/data/lobby-CASINO1.json';
import recomendados from '../public/assets/data/lobby-CASINO3.json';
import crash from '../public/assets/data/lobby-CASINO4.json';
import nuevos from '../public/assets/data/lobby-CASINO9.json';
import liveTop from '../public/assets/data/lobby-Casinoenvivo1.json';
import liveBlackjack from '../public/assets/data/lobby-Casinoenvivo2.json';
import liveBaccarat from '../public/assets/data/lobby-Casinoenvivo5.json';
import liveRuleta from '../public/assets/data/lobby-Casinoenvivo7.json';

import manifest from '../public/assets/thumbs/manifest.json';

const CMS = 'https://www.winland.com.mx';

export function thumb(machine) {
  // Prototipo: thumbnails espejados localmente para demo estable; fallback al CMS real.
  const local = manifest[String(machine.machine)];
  if (local) return `/assets/thumbs/${local}`;
  return machine.logo ? encodeURI(`${CMS}${machine.logo}`) : '';
}

const clean = (d) => (d.lobby || []).filter((m) => m.logo);

export const lobbies = {
  top20: { name: top20.lobby_name, games: clean(top20) },
  recomendados: { name: recomendados.lobby_name, games: clean(recomendados) },
  crash: { name: crash.lobby_name, games: clean(crash) },
  nuevos: { name: nuevos.lobby_name, games: clean(nuevos) },
  liveTop: { name: liveTop.lobby_name, games: clean(liveTop) },
  liveBlackjack: { name: liveBlackjack.lobby_name, games: clean(liveBlackjack) },
  liveBaccarat: { name: liveBaccarat.lobby_name, games: clean(liveBaccarat) },
  liveRuleta: { name: liveRuleta.lobby_name, games: clean(liveRuleta) },
};

// ——— Deportes: match cards réplica del widget de Altenar (mercado "Total"), con
// escudos REALES de Liga MX (ESPN CDN) y fixtures reales. En integración lo pinta el
// WSDK de Altenar tal cual (mismo diseño de card, no editable). ———
const T = (f) => `/assets/img/teams/${f}.png`;
export const ligaLogo = T('ligamx');
export const matchEvents = [
  { id: 1, league: 'Liga MX', date: '15/08 · 17:00', live: true,
    home: { name: 'América', logo: T('america') }, away: { name: 'Cruz Azul', logo: T('cruzazul') },
    market: 'Total', line: '2.5', over: '-163', under: '+125', ml: { home: 1.72, draw: 3.60, away: 4.80 } },
  { id: 2, league: 'Liga MX', date: '15/08 · 19:10', live: true,
    home: { name: 'Monterrey', logo: T('monterrey') }, away: { name: 'Tigres UANL', logo: T('tigres') },
    market: 'Total', line: '3.5', over: '+130', under: '-172', ml: { home: 2.05, draw: 3.30, away: 3.45 } },
  { id: 3, league: 'Liga MX', date: '15/08 · 21:10', live: false,
    home: { name: 'Atlas', logo: T('atlas') }, away: { name: 'Chivas', logo: T('chivas') },
    market: 'Total', line: '2.5', over: '+110', under: '-143', ml: { home: 2.90, draw: 3.10, away: 2.55 } },
  { id: 4, league: 'Liga MX', date: '16/08 · 12:00', live: false,
    home: { name: 'Pumas UNAM', logo: T('pumas') }, away: { name: 'Querétaro', logo: T('queretaro') },
    market: 'Total', line: '2.5', over: '-143', under: '+110', ml: { home: 1.84, draw: 3.45, away: 4.20 } },
  { id: 5, league: 'Liga MX', date: '16/08 · 17:00', live: false,
    home: { name: 'Toluca', logo: T('toluca') }, away: { name: 'León', logo: T('leon') },
    market: 'Total', line: '3.5', over: '+120', under: '-155', ml: { home: 1.95, draw: 3.50, away: 3.70 } },
  { id: 6, league: 'Liga MX', date: '16/08 · 19:00', live: false,
    home: { name: 'Santos Laguna', logo: T('santos') }, away: { name: 'Puebla', logo: T('puebla') },
    market: 'Total', line: '2.5', over: '-118', under: '-102', ml: { home: 2.30, draw: 3.20, away: 2.95 } },
  { id: 7, league: 'Liga MX', date: '17/08 · 12:00', live: false,
    home: { name: 'Necaxa', logo: T('necaxa') }, away: { name: 'Pachuca', logo: T('pachuca') },
    market: 'Total', line: '2.5', over: '+105', under: '-135', ml: { home: 2.60, draw: 3.15, away: 2.70 } },
];

// ——— Promos vigentes REALES: imágenes del CMS de producción (13/08/2026) ———
export const promos = [
  { id: 'cupon2026', tag: 'DEPORTES', img: '/assets/img/promos/cupon2026.jpg', alt: 'CUPON 2026 — Bono de bienvenida 200% hasta $5,000 FD' },
  { id: 'jonron', tag: 'DEPORTES', img: '/assets/img/promos/jonron.jpg', alt: 'JONRON — hasta $4,000 FD en tu depósito' },
  { id: 'weekend', tag: 'DEPORTES', img: '/assets/img/promos/weekend.jpg', alt: 'WEEKEND' },
  { id: 'bono200slots', tag: 'CASINO', img: '/assets/img/promos/bono200slots.jpg', alt: '200 DAY — bono de slots' },
  { id: 'bonow', tag: 'CASINO', img: '/assets/img/promos/bonow.jpg', alt: 'BONO W' },
];
