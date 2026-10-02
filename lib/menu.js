// Menú principal de la PROPUESTA: la misma estructura y el mismo orden en el header de
// escritorio y en el menú lateral de celular. Las opciones de Deportes son vistas dentro
// de /deportes (hash de Altenar).
// `icon` se usa solo en el menú lateral de celular (íconos de public/assets/img/menu/aside).
export const MENU = [
  {
    id: 'deportes', label: 'Deportes', href: '/deportes', icon: 'deportes',
    items: [
      { label: 'En vivo', href: '/deportes#/live', icon: 'envivo' },
      { label: 'Tu liga', href: '/deportes#/sport/66/category/560/championship/10009', icon: 'icon-tu-liga-mexicana' },
      { label: 'E-Sports', href: '/deportes#/esports', icon: 'esports' },
      { label: 'Virtuales', href: '/deportes#/virtual', icon: 'virtuales' },
      { label: 'Resultados', href: '/deportes#/results', icon: 'results' },
    ],
  },
  {
    id: 'casino', label: 'Casino', href: '/casino', icon: 'casino',
    items: [
      // Zitro y Top 20: mismos accesos que el menú de celular de producción.
      // Slots, Crash Games y Recomendados: categorías que ya existen en el lobby de casino.
      { label: 'Zitro', href: '/casino-todos?lobbyId=CASINO9', icon: 'nuevos' },
      { label: 'Top 20', href: '/casino-todos?lobbyId=CASINO1', icon: 'top10' },
      { label: 'Juegos de Slots', href: '/casino-todos?lobbyId=CASINO8', icon: 'slots' },
      { label: 'Crash Games', href: '/casino-todos?lobbyId=CASINO13', icon: 'crash' },
      { label: 'Recomendados', href: '/casino-todos?lobbyId=CASINO5', icon: 'recomendados' },
    ],
  },
  { id: 'envivo', label: 'Casino en vivo', href: '/casino-en-vivo', icon: 'casinoenvivo' },
  { id: 'promos', label: 'Promociones', href: '/promociones', icon: 'promociones' },
  { id: 'torneos', label: 'Torneos', href: '/torneos', icon: 'torneos' },
];
