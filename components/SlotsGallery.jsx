// Tragamonedas — CARRUSEL horizontal de scroll LIBRE + auto-play continuo.
// Se reproduce solo; al pasar el cursor por encima se PAUSA y aparecen las flechas
// (mismo estilo que Top 10 / eventos) para avanzar o regresar a mano. Contenido
// duplicado para loop sin costuras. reduced-motion: sin auto-play (scroll manual).
import { useEffect, useRef } from 'react';
import { lobbies } from '../lib/data';
import MachineCard from './MachineCard';
import PhysicsToy from './PhysicsToy';

const dead = (e) => e.preventDefault();

function buildCards() {
  const src = [
    ...lobbies.top20.games.slice(0, 5),
    ...lobbies.nuevos.games.slice(0, 4),
    ...lobbies.crash.games.slice(0, 3),
    ...lobbies.recomendados.games.slice(0, 3),
  ];
  const seen = new Set();
  return src.filter((g) => (seen.has(g.machine) ? false : seen.add(g.machine)));
}

// mismo ícono que las flechas de Splide (Top 10) para que sean idénticas
const Chevron = ({ dir }) => (
  <svg width="15" height="15" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" style={dir === 'prev' ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.6 4.3 4.38 14.6-14.6-4.6-4.38z" />
  </svg>
);

export default function SlotsGallery() {
  const scrollerRef = useRef(null);
  const pausedRef = useRef(false);
  const cards = useRef(buildCards()).current;

  // AUTO-PLAY continuo en TODAS las resoluciones (loop sin costuras: el contenido
  // va duplicado, así que al llegar a la mitad se reinicia sin salto visible).
  // OJO: no se puede hacer `el.scrollLeft += 0.28` porque el navegador redondea
  // scrollLeft a entero y el carrusel se quedaba CLAVADO. Se acumula la posición en
  // una variable propia (float) y se asigna completa en cada frame.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let pos = el.scrollLeft;
    const SPEED = 0.35; // px por frame (~21 px/s)

    const tick = () => {
      const half = el.scrollWidth / 2;
      if (!pausedRef.current && half > 0 && el.scrollWidth > el.clientWidth) {
        pos += SPEED;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft; // resync tras arrastre manual / pausa
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // mantiene el loop también en scroll manual (rueda / flechas / dedo)
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
  };

  const nudge = (dir) => scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });

  return (
    <section id="slots" className="wl-slotgal">
      <PhysicsToy type="chip" label="Aviéntame" />
      <div className="wl-slotgal__head">
        <div>
          <h2 className="wl-h2" style={{ margin: 0 }}>Tragamonedas que no paran</h2>
          <p className="wl-sub" style={{ margin: '16px 0 0' }}>Cientos de slots, jackpots y crash games. Desliza y elige tu favorito.</p>
        </div>
        <a className="wl-see-all" href="#" onClick={dead}>
          Ver todos los slots
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <div
        className="wl-slotgal__wrap"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { setTimeout(() => { pausedRef.current = false; }, 2400); }}
      >
        <button className="wl-slotgal__arrow wl-slotgal__arrow--prev" type="button" aria-label="Anterior" onClick={() => nudge(-1)}><Chevron dir="prev" /></button>
        <div className="wl-slotgal__scroller" ref={scrollerRef} onScroll={onScroll}>
          {[...cards, ...cards].map((g, i) => (
            <article className="wl-slotcard" key={`${g.machine}-${i}`}>
              <MachineCard game={g} />
            </article>
          ))}
        </div>
        <button className="wl-slotgal__arrow wl-slotgal__arrow--next" type="button" aria-label="Siguiente" onClick={() => nudge(1)}><Chevron dir="next" /></button>
      </div>
    </section>
  );
}
