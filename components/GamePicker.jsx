// Bloque interactivo "Gíralo y te elegimos un juego" (ref. Versusbet):
// ruleta coverflow de juegos REALES con marco central; el usuario gira y aterriza
// en un juego destacado. Engagement + dwell time (apoya SEO) y los nombres de los
// juegos son texto indexable.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { lobbies, thumb } from '../lib/data';
import { useInView, useReducedMotion } from '../lib/hooks';

const GAP = 14;
const REPEATS = 12;

// pool determinista (sin Math.random en render) a partir de juegos reales
function buildPool() {
  const src = [...lobbies.top20.games, ...lobbies.nuevos.games];
  const seen = new Set();
  const base = [];
  for (const g of src) {
    if (seen.has(g.machine)) continue;
    seen.add(g.machine);
    base.push(g);
    if (base.length >= 16) break;
  }
  const pool = [];
  for (let r = 0; r < REPEATS; r++) pool.push(...base);
  return { base, pool };
}

export default function GamePicker() {
  const [ref, inView] = useInView(0.15);
  const reelRef = useRef(null);
  const stripRef = useRef(null);
  const posRef = useRef(0);
  const seedRef = useRef(1);
  const spinningRef = useRef(false);
  const [{ base, pool }] = useState(buildPool);
  const [selected, setSelected] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const reduced = useReducedMotion();

  const step = useCallback(() => {
    const card = stripRef.current?.querySelector('.wl-reel__card');
    return (card ? card.offsetWidth : 96) + GAP;
  }, []);

  const applyTransform = useCallback((pos, animate) => {
    const strip = stripRef.current;
    const reel = reelRef.current;
    if (!strip || !reel) return;
    const s = step();
    const tx = reel.clientWidth / 2 - (pos + 0.5) * s;
    strip.style.transition = animate ? 'transform 3.4s cubic-bezier(0.12, 0.72, 0.12, 1)' : 'none';
    strip.style.transform = `translate3d(${tx}px,0,0)`;
  }, [step]);

  const centerAt = useCallback((pos) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.querySelectorAll('.wl-reel__card').forEach((c, i) => {
      c.classList.toggle('is-center', i === pos);
    });
  }, []);

  // posición inicial: banda media, primer juego centrado
  useLayoutEffect(() => {
    const start = base.length * 4;
    posRef.current = start;
    applyTransform(start, false);
    centerAt(start);
    setSelected(base[0]);
    const onResize = () => applyTransform(posRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [base, applyTransform, centerAt]);

  const spin = useCallback(() => {
    if (spinningRef.current) return;
    // PRNG determinista por sesión (no rompe SSR); avanza en cada giro
    seedRef.current = (seedRef.current * 1103515245 + 12345) & 0x7fffffff;
    const rnd = seedRef.current % base.length;
    const target = posRef.current + base.length * 3 + rnd;
    const landed = base[target % base.length];

    if (reduced) {
      posRef.current = target;
      applyTransform(target, false);
      centerAt(target);
      setSelected(landed);
      return;
    }

    spinningRef.current = true;
    setSpinning(true);
    centerAt(-1);
    requestAnimationFrame(() => applyTransform(target, true));

    const strip = stripRef.current;
    const onEnd = () => {
      strip.removeEventListener('transitionend', onEnd);
      spinningRef.current = false;
      setSpinning(false);
      setSelected(landed);
      // normalizar a la banda media sin animación (permite girar indefinidamente)
      const norm = base.length * 4 + (target % base.length);
      posRef.current = norm;
      applyTransform(norm, false);
      requestAnimationFrame(() => centerAt(norm));
    };
    strip.addEventListener('transitionend', onEnd);
  }, [base, reduced, applyTransform, centerAt]);

  return (
    <section ref={ref} className={`wl-section wl-picker${inView ? ' wl-inview' : ''}`}>
      <div className="wl-picker__inner">
        <div className="wl-picker__left wl-reveal">
          <h2 className="wl-h2">¿No sabes por dónde empezar?</h2>
          <p className="wl-sub">Gíralo y Winland te recomienda un juego para arrancar la noche.</p>
          <div className="wl-picker__actions">
            <button className="wl-btn wl-btn--primary" type="button" onClick={spin} disabled={spinning}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 2 }}>
                <path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {selected && !spinning ? 'Gira otra vez' : 'Girar'}
            </button>
            {selected && !spinning && (
              <button className="wl-btn wl-btn--ghost" type="button">Jugar {selected.web_name.length > 16 ? 'ahora' : selected.web_name}</button>
            )}
          </div>
        </div>

        <div className="wl-reel-col wl-reveal wl-reveal--d1">
          <div className={`wl-reel${spinning ? ' wl-reel--spinning' : ''}`} ref={reelRef} aria-hidden="true">
            <div className="wl-reel__frame">
              <span className="wl-reel__tri wl-reel__tri--top" />
              <span className="wl-reel__tri wl-reel__tri--bot" />
            </div>
            <div className="wl-reel__strip" ref={stripRef}>
              {pool.map((g, i) => (
                <div className="wl-reel__card" key={`${g.machine}-${i}`}>
                  <img src={thumb(g)} alt="" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="wl-reel__name" aria-live="polite">{spinning ? 'Girando…' : (selected ? selected.web_name : '')}</div>
        </div>
      </div>
    </section>
  );
}
