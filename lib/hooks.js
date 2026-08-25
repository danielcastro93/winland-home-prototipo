import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

// Marca .wl-inview cuando la sección entra al viewport (dispara las animaciones de entrada).
export function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Progreso de scroll global 0–1 en una CSS var (rAF-throttled, solo lectura pasiva).
export function useScrollProgressVar() {
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--wl-scroll', p.toFixed(4));
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

// Contador con física de odómetro: anima de 0 al valor al entrar en viewport.
export function useOdometer(target, inView, duration = 1400) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setValue(target); return; }
    let raf; const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4); // easeOutQuart, frena como odómetro
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      setValue(Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);
  return value;
}

// Tilt 3D sutil al hover (solo pointer fino y sin reduced-motion; móvil queda estático).
export function useTilt(max = 7) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [max]);
  return ref;
}

// Botón magnético: se desplaza sutilmente hacia el cursor (solo pointer fino; móvil = bounce por CSS).
export function useMagnetic(strength = 0.25, radius = 90) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < radius + Math.max(r.width, r.height) / 2) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = '';
      }
    };
    const leave = () => { el.style.transform = ''; };
    const zone = el.parentElement || el;
    zone.addEventListener('mousemove', move);
    zone.addEventListener('mouseleave', leave);
    return () => { zone.removeEventListener('mousemove', move); zone.removeEventListener('mouseleave', leave); };
  }, [strength, radius]);
  return ref;
}
