// Juguete físico INTERACTIVO (ficha / balón). El usuario lo agarra, avienta y gira.
// Física real (momentum, gravedad, rebote, fricción, giro). Regresa a su esquina tras
// reposo (6s, no estorba). BALÓN: portería en la esquina inferior-izq → aviéntalo hacia
// ella para meter gol ("¡GOOOL!"). FICHA: al aventarla fuerte revela un premio.
// reduced-motion: arrastrable sin vuelo.
import { useEffect, useRef } from 'react';

// íconos estilo Material Symbols (SVG limpio, no emoji)
const IC = {
  star: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.6l2.6 6.1 6.6.5-5 4.3 1.5 6.4L12 16.9l-5.7 3.4 1.5-6.4-5-4.3 6.6-.5z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 5V2L7 7l5 5V9a4 4 0 11-4 4H6a6 6 0 106-6z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"/></svg>',
};
const PRIZES = [
  { ic: IC.refresh, t: 'Giro gratis' },
  { ic: IC.star, t: 'Bono 10%' },
  { ic: IC.star, t: '50 Win Points' },
  { ic: IC.plus, t: 'Tiro extra' },
  { ic: IC.star, t: '¡Sigue tu suerte!' },
];

// ---- TEMATIZABLE ----------------------------------------------------------
// Texto de celebración del gol (temporadas: '¡DULCE O TRUCO!', '¡HO HO HO!'…)
const GOAL_TEXT = '¡GOOOL!';
// Assets intercambiables: reemplaza el ARCHIVO (mismo nombre) y el sitio se viste
// solo. SVG preferido; si no existe, cae a .png con el mismo nombre.
const TOYS = {
  ball: '/assets/toys/deportes',            // el que se avienta (balón/calabaza/esfera…)
  goal: '/assets/toys/deportes-objetivo',   // el objetivo (portería/caldero/chimenea…)
  chip: '/assets/toys/slots',               // la ficha
};
const toyFallback = (e) => {
  const el = e.currentTarget;
  if (el.src.endsWith('.svg')) el.src = el.src.replace(/\.svg$/, '.png');
  else el.style.display = 'none';
};
// ---------------------------------------------------------------------------

const PRESET = {
  chip: { size: 84, grav: 0, rest: 0.6, air: 0.975, spin: 1.7, home: [0.945, 0.09], homeM: [0.9, 0.01], anchor: 'content-right' },
  ball: { size: 62, grav: 0.5, rest: 0.7, air: 0.996, spin: 1.0, home: [0.93, 0.06], homeM: [0.9, 0.02] },
};

export default function PhysicsToy({ type = 'chip', label }) {
  const zoneRef = useRef(null);
  const toyRef = useRef(null);
  const goalRef = useRef(null);
  const scoreRef = useRef(null);
  const hintRef = useRef(null);
  const S = useRef({}).current;
  const P = PRESET[type];
  const isBall = type === 'ball';

  useEffect(() => {
    const zone = zoneRef.current, toy = toyRef.current;
    if (!zone || !toy) return;
    let r = P.size / 2; // radio real: se re-mide (en mobile el CSS encoge el juguete)
    // phase: 'rest' | 'held' | 'fly' | 'return'  ·  S.raf es el ÚNICO loop (evita loops duplicados)
    Object.assign(S, { x: 0, y: 0, vx: 0, vy: 0, ang: 0, av: 0, W: 0, H: 0, off: [0, 0], samples: [], raf: 0, phase: 'rest', homeT: 0, scored: false, goals: 0, goal: null });
    S.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      S.W = zone.clientWidth; S.H = zone.clientHeight;
      r = (toy.offsetWidth || P.size) / 2;
      if (isBall && goalRef.current) {
        const gz = zone.getBoundingClientRect();
        const gr = goalRef.current.getBoundingClientRect();
        // boca REAL de la portería (más chica que la caja del SVG): debe entrar de verdad
        S.goal = {
          x2: gr.left - gz.left + gr.width * 0.80,           // entrar a la boca (más amplia)
          y1: gr.top - gz.top + gr.height * 0.18,            // bajo el travesaño (más alto)
          y2: gr.top - gz.top + gr.height * 0.96,            // sobre el suelo (más bajo)
        };
      }
    };
    const homeXY = () => {
      // en mobile (<900) usa homeM (más arriba / menos invasivo) si está definido
      const home = (S.W < 900 && P.homeM) ? P.homeM : P.home;
      let hx;
      if (P.anchor === 'content-right' && S.W >= 900) {
        // alinear el borde derecho de la ficha al margen del contenido (como el CTA),
        // no al borde de la pantalla (la sección de slots es full-width).
        const contentRight = Math.min(S.W - 32, S.W / 2 + 640 - 32);
        hx = contentRight - r;
      } else {
        hx = S.W * home[0];
      }
      return [Math.min(Math.max(hx, r), S.W - r), Math.min(Math.max(S.H * home[1], r), S.H - r)];
    };
    const apply = () => { toy.style.transform = `translate3d(${S.x - r}px, ${S.y - r}px, 0) rotate(${S.ang}deg)`; };
    const placeHint = () => {
      if (!hintRef.current) return;
      const [hx, hy] = homeXY();
      const el = hintRef.current;
      el.style.left = `${hx}px`;
      el.style.top = `${hy}px`;
      // clamp horizontal: el globito respeta los márgenes de la pantalla
      const w = el.offsetWidth || 90;
      el.style.left = `${Math.min(Math.max(hx, w / 2 + 12), S.W - w / 2 - 12)}px`;
    };
    const place = () => { measure(); const [hx, hy] = homeXY(); S.x = hx; S.y = hy; apply(); placeHint(); };
    const vibrate = (n) => { if (!S.reduced && navigator.vibrate) try { navigator.vibrate(n); } catch (e) {} };

    const spawn = (x, y, cls, dx, dy) => {
      const p = document.createElement('span');
      p.className = cls;
      p.style.left = `${x}px`; p.style.top = `${y}px`;
      p.style.setProperty('--dx', `${dx}px`); p.style.setProperty('--dy', `${dy}px`);
      zone.appendChild(p);
      setTimeout(() => p.remove(), 850);
    };
    const popLabel = (x, y, text, cls, ttl, html) => {
      const l = document.createElement('span');
      l.className = `wl-toy-pop ${cls || ''}`;
      if (html) l.innerHTML = text; else l.textContent = text;
      l.style.left = `${x}px`; l.style.top = `${y}px`;
      zone.appendChild(l);
      // clamp dentro de la zona para que NO se corte en los bordes
      const lw = l.offsetWidth || 120;
      l.style.left = `${Math.min(Math.max(x, lw / 2 + 8), S.W - lw / 2 - 8)}px`;
      l.style.top = `${Math.max(y, 24)}px`;
      setTimeout(() => l.remove(), ttl);
    };
    const particles = (x, y, n, cls) => {
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + 0.3, d = 26 + (i % 3) * 14;
        spawn(x, y, `wl-toy-particle ${cls}`, Math.cos(ang) * d, Math.sin(ang) * d - 10);
      }
    };
    const celebrateGoal = (x, y) => {
      zone.classList.add('wl-toy-zone--goal');
      setTimeout(() => zone.classList.remove('wl-toy-zone--goal'), 700);
      popLabel(S.W * 0.5, S.H * 0.4, GOAL_TEXT, 'wl-toy-pop--goal', 1600);
      particles(x, y, 14, 'wl-toy-particle--ball');
      if (scoreRef.current) scoreRef.current.textContent = String(S.goals);
      vibrate([12, 40, 12]);
    };
    const revealPrize = (x, y) => {
      const prize = PRIZES[S.goals % PRIZES.length]; S.goals++;
      popLabel(x, Math.max(y - 6, 30), `<i class="wl-toy-pop__ic">${prize.ic}</i><span>${prize.t}</span>`, 'wl-toy-pop--prize', 2800, true);
      particles(x, y, 10, 'wl-toy-particle--chip');
      vibrate(16);
    };

    // ÚNICO punto de arranque del loop: nunca crea un segundo rAF.
    const ensureLoop = () => { if (!S.raf && (S.phase === 'fly' || S.phase === 'return')) S.raf = requestAnimationFrame(step); };
    const stopLoop = () => { if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; } };

    const step = () => {
      S.raf = 0;
      if (S.phase === 'return') {
        const [hx, hy] = homeXY();
        S.x += (hx - S.x) * 0.08; S.y += (hy - S.y) * 0.08; S.ang *= 0.9;
        apply();
        if (Math.abs(hx - S.x) < 0.6 && Math.abs(hy - S.y) < 0.6) { S.x = hx; S.y = hy; S.ang = 0; apply(); S.phase = 'rest'; return; }
        S.raf = requestAnimationFrame(step); return;
      }
      if (S.phase !== 'fly') return; // held/rest: no loop
      S.vy += P.grav; S.vx *= P.air; S.vy *= P.air;
      S.x += S.vx; S.y += S.vy; S.ang += S.av; S.av *= 0.96;
      let hitFloor = false;
      if (S.x < r) { S.x = r; S.vx = Math.abs(S.vx) * P.rest; S.av = S.vx * P.spin; }
      else if (S.x > S.W - r) { S.x = S.W - r; S.vx = -Math.abs(S.vx) * P.rest; S.av = -S.vx * P.spin; }
      if (S.y < r) { S.y = r; S.vy = Math.abs(S.vy) * P.rest; }
      else if (S.y > S.H - r) { S.y = S.H - r; if (Math.abs(S.vy) > 3) hitFloor = true; S.vy = -Math.abs(S.vy) * P.rest; S.vx *= (isBall ? 0.84 : 1); S.av = S.vx * P.spin; if (Math.abs(S.vy) < 1.2) S.vy = 0; }
      // GOL: hay que aventarlo con FUERZA hacia la izquierda (vx<-6) y que el balón
      // entre de verdad a la boca de la portería (no basta rozar el borde).
      if (isBall && S.goal && !S.scored && S.vx < -5 && S.x < S.goal.x2 && S.y > S.goal.y1 && S.y < S.goal.y2) {
        S.scored = true; S.goals++; celebrateGoal(S.x, S.y);
        S.vx *= 0.18; S.vy *= 0.18;
      }
      apply();
      if (hitFloor && isBall) vibrate(8);
      const speed = Math.abs(S.vx) + Math.abs(S.vy) + Math.abs(S.av);
      const grounded = isBall ? (S.y >= S.H - r - 0.6) : true;
      if (grounded && speed < 0.45) {
        S.phase = 'rest';
        clearTimeout(S.homeT);
        S.homeT = setTimeout(() => { if (S.phase === 'rest') { S.phase = 'return'; ensureLoop(); } }, 6000);
        return;
      }
      S.raf = requestAnimationFrame(step);
    };

    const now = () => (performance.now ? performance.now() : Date.now());
    const onDown = (e) => {
      try { toy.setPointerCapture(e.pointerId); } catch (er) {}
      measure(); clearTimeout(S.homeT);
      stopLoop();
      S.phase = 'held'; S.scored = false; S.vx = 0; S.vy = 0; S.av = 0;
      zone.classList.add('wl-toy-zone--played');
      const rect = zone.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      S.off = [S.x - px, S.y - py];
      S.samples = [{ x: px, y: py, t: now() }];
    };
    const onMove = (e) => {
      if (S.phase !== 'held') return;
      const rect = zone.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      S.x = Math.min(Math.max(px + S.off[0], r), S.W - r);
      S.y = Math.min(Math.max(py + S.off[1], r), S.H - r);
      S.ang += (px - (S.samples[S.samples.length - 1]?.x ?? px)) * 0.4;
      S.samples.push({ x: px, y: py, t: now() });
      if (S.samples.length > 6) S.samples.shift();
      apply();
    };
    const onUp = (e) => {
      if (S.phase !== 'held') return;
      try { toy.releasePointerCapture(e.pointerId); } catch (er) {}
      const s = S.samples; let speed = 0;
      if (s.length >= 2) {
        const a = s[Math.max(0, s.length - 4)], b = s[s.length - 1], dt = Math.max(16, b.t - a.t);
        S.vx = Math.max(-46, Math.min(46, (b.x - a.x) / dt * 16));
        S.vy = Math.max(-46, Math.min(46, (b.y - a.y) / dt * 16));
        S.av = S.vx * P.spin; speed = Math.hypot(S.vx, S.vy);
      }
      if (S.reduced) { S.phase = 'rest'; clearTimeout(S.homeT); S.homeT = setTimeout(() => { S.phase = 'return'; ensureLoop(); }, 4000); return; }
      if (!isBall && speed > 14) revealPrize(S.x, S.y - r);
      S.phase = 'fly';
      ensureLoop();
    };

    place();
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) stopLoop(); else ensureLoop();
    }, { threshold: 0 });
    io.observe(zone);
    toy.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', place);
    return () => {
      io.disconnect(); clearTimeout(S.homeT);
      toy.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', place);
      if (S.raf) cancelAnimationFrame(S.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={zoneRef} className={`wl-toy-zone wl-toy-zone--${type}`}>
      {isBall && (
        <>
          <img ref={goalRef} className="wl-goal" src={`${TOYS.goal}.svg`} onError={toyFallback} alt="" aria-hidden="true" draggable="false" />
          <span className="wl-goal-score" aria-hidden="true">
            <img className="wl-goal-score__ic" src={`${TOYS.ball}.svg`} onError={toyFallback} alt="" aria-hidden="true" draggable="false" />
            <b ref={scoreRef}>0</b>
          </span>
        </>
      )}
      <span ref={toyRef} className={`wl-toy wl-toy--${type}`} style={{ width: P.size, height: P.size }} role="button" tabIndex={-1} aria-hidden="true">
        <span className="wl-toy__art">
          <img src={`${TOYS[isBall ? 'ball' : 'chip']}.svg`} onError={toyFallback} alt="" aria-hidden="true" draggable="false" />
        </span>
      </span>
      {label && <span ref={hintRef} className="wl-toy-hint">{label}</span>}
    </div>
  );
}
