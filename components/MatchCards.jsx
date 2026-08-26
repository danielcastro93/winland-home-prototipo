// DEPORTES — eventos destacados en CARRUSEL de cards altos (referencia draftea.mx):
// foto del jugador a toda la card, degradado negro abajo y los datos encima (fecha,
// equipos, mercado Total + momios reales de Altenar), SIN escudos. Al entrar al
// viewport los cards están APILADOS y se despliegan a su posición en la fila; al pasar
// el cursor el card se levanta y se destaca, atenuando el resto.
import { useState, useEffect, useCallback } from 'react';
import { ligaLogo } from '../lib/data';
import { useInView } from '../lib/hooks';
import PhysicsToy from './PhysicsToy';

const dead = (e) => e.preventDefault();
const T = (f) => `/assets/img/teams/${f}.png`;

// Fixtures reales de Liga MX. Mercado Total O/U 2.5. `image` = foto del partido/jugadores
// (plug-and-play: se cae al ambiente CSS si falta el archivo).
const EVENTS = [
  { id: 1, date: '21/08 · 19:00', line: '2.5', over: '1.66', under: '2.14', image: '/assets/img/deportes/match-1.jpg',
    home: { name: 'Tigres UANL' }, away: { name: 'Atlas' } },
  { id: 2, date: '21/08 · 19:00', line: '2.5', over: '1.57', under: '2.33', image: '/assets/img/deportes/match-2.jpg',
    home: { name: 'Club León' }, away: { name: 'Monterrey' } },
  { id: 3, date: '21/08 · 21:00', line: '2.5', over: '1.73', under: '2.05', image: '/assets/img/deportes/match-3.jpg',
    home: { name: 'Necaxa' }, away: { name: 'América' } },
  { id: 4, date: '21/08 · 21:10', line: '2.5', over: '1.58', under: '2.30', image: '/assets/img/deportes/match-4.jpg',
    home: { name: 'Querétaro' }, away: { name: 'Toluca' } },
  { id: 5, date: '22/08 · 17:07', line: '2.5', over: '1.63', under: '2.20', image: '/assets/img/deportes/match-5.jpg',
    home: { name: 'Guadalajara' }, away: { name: 'Pumas UNAM' } },
  { id: 6, date: '22/08 · 19:00', line: '2.5', over: '1.60', under: '2.25', image: '/assets/img/deportes/match-6.jpg',
    home: { name: 'Cruz Azul' }, away: { name: 'Puebla' } },
];

const CARD_STEP = 284; // ancho card + gap (para apilar al centro)

const BallIcon = () => <span className="wl-ev__ball" aria-hidden="true">⚽</span>;
const StatsIcon = () => (
  <svg className="wl-ev__stats" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="13" width="3.2" height="7" rx="1" fill="currentColor" />
    <rect x="10.4" y="9" width="3.2" height="11" rx="1" fill="currentColor" />
    <rect x="16.8" y="5" width="3.2" height="15" rx="1" fill="currentColor" />
  </svg>
);
// mismo ícono que las flechas de Splide (Top 10 / promos) para que sean idénticas
const Chevron = ({ dir }) => (
  <svg width="15" height="15" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" style={dir === 'prev' ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.6 4.3 4.38 14.6-14.6-4.6-4.38z" />
  </svg>
);

function EventCard({ ev }) {
  // selección simulada: al tocar una cuota se marca y "cae" al cupón (evento wl:bet);
  // tocarla de nuevo la quita. En integración esto lo hace el WSDK de Altenar.
  const [pick, setPick] = useState(null); // 'over' | 'under' | null
  const choose = (side) => (e) => {
    e.preventDefault();
    const next = pick === side ? null : side;
    setPick(next);
    const odds = next ? Number(next === 'over' ? ev.over : ev.under) : 0;
    window.dispatchEvent(new CustomEvent('wl:bet', { detail: { id: ev.id, odds, on: !!next } }));
  };
  return (
    <article className={`wl-ev${ev.image ? ' wl-ev--photo' : ''}`}>
      {ev.image && (
        <img className="wl-ev__photo" src={ev.image} alt="" aria-hidden="true" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      )}
      <span className="wl-ev__scrim" aria-hidden="true" />
      <div className="wl-ev__top">
        <span className="wl-ev__meta">
          <BallIcon />
          <span className="wl-ev__date">{ev.date}</span>
          <img className="wl-ev__liga" src={ligaLogo} alt="" aria-hidden="true" />
          <span className="wl-ev__ligatxt">Liga MX</span>
        </span>
        <StatsIcon />
      </div>
      <div className="wl-ev__info">
        <div className="wl-ev__teams">{ev.home.name} <span className="wl-ev__vs">vs</span> {ev.away.name}</div>
        <div className="wl-ev__market">Total</div>
        <div className="wl-ev__odds">
          <a href="#" onClick={choose('over')} className={`wl-ev__odd${pick === 'over' ? ' wl-ev__odd--on' : ''}`}><b>{ev.over}</b><span>Más de {ev.line}</span></a>
          <a href="#" onClick={choose('under')} className={`wl-ev__odd${pick === 'under' ? ' wl-ev__odd--on' : ''}`}><b>{ev.under}</b><span>Menos de {ev.line}</span></a>
        </div>
      </div>
    </article>
  );
}

export default function MatchCards() {
  const [ref, inView] = useInView(0.08);
  // observer del carrusel: dispara el despliegue solo cuando entra de verdad al viewport
  const [rowRef, rowOpen] = useInView(0.25);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [active, setActive] = useState(0);
  const [dots, setDots] = useState(EVENTS.length);
  const N = EVENTS.length;

  // Un bullet por POSICIÓN ALCANZABLE (no uno por card): si caben `v` cards a la vez,
  // las posiciones reales son N - v + 1. Así cada swipe avanza exactamente un bullet
  // en cualquier resolución (móvil y tablet) y el último se marca al llegar al final.
  const onScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdges({ start: el.scrollLeft <= 4, end: atEnd });

    const kids = el.children;
    const step = kids.length > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : CARD_STEP;
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    const total = Math.max(1, N - visible + 1);
    setDots(total);
    setActive(atEnd ? total - 1 : Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / step))));
  }, [rowRef, N]);

  // listener NATIVO sobre el scroller (más fiable que onScroll de React: responde
  // igual al swipe con el dedo, a las flechas y al scroll programático)
  useEffect(() => {
    const el = rowRef.current;
    onScroll();
    el?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll, rowRef]);

  const nudge = (dir) => rowRef.current?.scrollBy({ left: dir * CARD_STEP * 2, behavior: 'smooth' });

  return (
    <section id="deportes" ref={ref} className={`wl-section wl-deportes${inView ? ' wl-inview' : ''}`}>
      <PhysicsToy type="ball" label="Patéame" />
      <div className="wl-row-head wl-reveal">
        <div>
          <h2 className="wl-h2" style={{ margin: 0 }}>Eventos deportivos destacados</h2>
          <p className="wl-sub" style={{ margin: '16px 0 0' }}>Los partidos más esperados de la Liga MX y las grandes ligas del mundo.</p>
        </div>
        <a className="wl-see-all" href="#" onClick={dead}>
          Todos los deportes
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>

      <div className="wl-evrow-wrap">
        <button className="wl-evrow__arrow wl-evrow__arrow--prev" type="button" aria-label="Anterior" onClick={() => nudge(-1)} disabled={edges.start}><Chevron dir="prev" /></button>
        <div className={`wl-evrow${rowOpen ? ' wl-evrow--open' : ''}`} ref={rowRef}>
          {EVENTS.map((ev, i) => (
            <div className="wl-evrow__item" key={ev.id} style={{ '--dx': `${-i * CARD_STEP}px` }}>
              <EventCard ev={ev} />
            </div>
          ))}
        </div>
        <button className="wl-evrow__arrow wl-evrow__arrow--next" type="button" aria-label="Siguiente" onClick={() => nudge(1)} disabled={edges.end}><Chevron dir="next" /></button>
        {/* bullets (mobile): justificados a la izquierda, activo tipo pill */}
        <div className="wl-evrow-dots" aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => (
            <span key={i} className={i === active ? 'wl-dot wl-dot--on' : 'wl-dot'} />
          ))}
        </div>
      </div>
    </section>
  );
}
