// CASINO — Top 10 de juegos (lobby real CASINO1 del CMS). Card real de producción
// + número de posición gigante + hover de barrido (igual que prod). Muestra ~5 y el
// resto en carrusel. Va sobre un fondo de marca (no todo negro) con monedas flotando.
import { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import MachineCard from './MachineCard';
import { lobbies } from '../lib/data';
import { useInView } from '../lib/hooks';

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function Top10() {
  const [ref, inView] = useInView(0.08);
  const [dots, setDots] = useState(1);
  const [active, setActive] = useState(0);
  const games = lobbies.top20.games.slice(0, 10);

  // Bullets propios = una PÁGINA por bullet. Cada swipe muestra el siguiente bloque de
  // cards (2 en móvil → 5 bullets; 3 en tablet → 4 bullets; menos swipes en pantallas
  // grandes). Se usan bullets propios y no los de Splide para tener el mismo estilo que
  // el resto del home. El último bloque puede ser parcial (10 no es múltiplo de 3), por
  // eso se detecta el final para encender siempre el último bullet.
  // `idx` explícito: en el evento `move` (inicio del desplazamiento) llega el índice
  // destino, así el bullet cambia AL INSTANTE y no al terminar la animación.
  const syncAt = (splide, idx) => {
    const perPage = splide.options.perPage || 1;
    const pages = Math.max(1, Math.ceil(splide.length / perPage));
    const ctrl = splide.Components.Controller;
    const end = typeof ctrl?.getEnd === 'function'
      ? ctrl.getEnd()
      : Math.max(0, splide.length - perPage); // último índice alcanzable (fallback)
    const i = typeof idx === 'number' ? idx : splide.index;
    setDots(pages);
    // el último bloque puede ser parcial (10 cards no es múltiplo de 3): al tocar el
    // final se enciende siempre el último bullet.
    setActive(i >= end ? pages - 1 : Math.min(pages - 1, Math.floor(i / perPage)));
  };
  const sync = (splide) => syncAt(splide, splide.index);

  return (
    <section id="casino" ref={ref} className={`wl-section wl-top10${inView ? ' wl-inview' : ''}`}>
      <div className="wl-top10__bg" aria-hidden="true" />
      <div className="wl-top10__head wl-reveal">
        <div>
          <h2 className="wl-h2" style={{ margin: 0 }}>Top 10 de juegos</h2>
          <p className="wl-sub" style={{ margin: '6px 0 0' }}>Los juegos y slots más jugados del casino esta semana.</p>
        </div>
        <a className="wl-see-all" href="#" onClick={(e) => e.preventDefault()}>
          Ver todo el casino <Chevron />
        </a>
      </div>
      <div className="wl-reveal wl-reveal--d1">
        <Splide
          className="clmc-splide-lobbySlider wl-top10__slider"
          options={{
            // Sin `perMove` → Splide avanza UNA PÁGINA por swipe (bloque completo de
            // cards). La paginación propia (ver `sync`) pinta un bullet por página.
            gap: '10px', pagination: false, arrows: true, perPage: 5,
            drag: true,
            // OJO: perPage debe ser ENTERO (Splide no soporta fracciones como 1.6 —
            // eso rompía el arrastre en móvil). Para "asomar" el siguiente card se
            // usa `padding`, que sí es la opción correcta de Splide.
            breakpoints: {
              1100: { perPage: 4 },
              900: { perPage: 3 },
              680: { perPage: 2, gap: '8px' },
              480: { perPage: 2, gap: '8px' },
            },
          }}
          aria-label="Top 10 de juegos"
          onMounted={sync}
          onMove={syncAt}
          onMoved={sync}
          onDragged={sync}
          onUpdated={sync}
          onResized={sync}
        >
          {games.map((g, i) => (
            <SplideSlide key={g.machine}>
              <MachineCard game={g} rank={i + 1} />
            </SplideSlide>
          ))}
        </Splide>
        {/* bullets propios: uno por posición alcanzable (solo móvil/tablet) */}
        <div className="wl-dots" aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => (
            <span key={i} className={i === active ? 'wl-dot wl-dot--on' : 'wl-dot'} />
          ))}
        </div>
      </div>
    </section>
  );
}
