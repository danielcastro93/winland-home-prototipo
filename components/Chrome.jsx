// Header, Footer y BottomNav — chrome del sitio con el design system Calimaco (clmc-*).
// Todos los enlaces están neutralizados a "#" (ver lib/frags.js).
import { useCallback, useEffect, useRef, useState } from 'react';
import { headerHTML, footerHTML, bottomNavHTML } from '../lib/frags';

// Evita que los "#" muevan el scroll.
function useDeadLinks() {
  return useCallback((e) => {
    if (e.target.closest('a')) e.preventDefault();
  }, []);
}

// Desplegables del menú (propuesta): UNO solo abierto a la vez. Se abre al pasar el
// cursor, con el teclado (focus) o con un toque, y se cierra con una pequeña espera al
// salir para que el cursor pueda bajar al panel sin que se cierre.
// Los eventos se escuchan en el CONTENEDOR del header (delegación), no en cada
// desplegable: así siguen funcionando aunque el HTML interno se vuelva a pintar.
function useSingleDropdown(ref, enabled) {
  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root) return undefined;
    let timer = 0;
    const setOpen = (dd) => {
      clearTimeout(timer);
      root.querySelectorAll('.wl-dd').forEach((d) => {
        const on = d === dd;
        d.classList.toggle('is-open', on);
        d.querySelector('.wl-dd__trigger')?.setAttribute('aria-expanded', String(on));
      });
    };
    const closeSoon = () => { clearTimeout(timer); timer = setTimeout(() => setOpen(null), 160); };
    const ddOf = (el) => (el instanceof Element ? el.closest('.wl-dd') : null);
    const onOver = (e) => { const dd = ddOf(e.target); if (dd) setOpen(dd); };
    const onOut = (e) => { const dd = ddOf(e.target); if (dd && !dd.contains(e.relatedTarget)) closeSoon(); };
    const onFocusIn = (e) => { const dd = ddOf(e.target); if (dd) setOpen(dd); };
    const onFocusOut = (e) => { const dd = ddOf(e.target); if (dd && !dd.contains(e.relatedTarget)) closeSoon(); };
    // en pantallas táctiles el primer toque abre el panel; el segundo navega
    const onTouch = (e) => {
      const trigger = e.target instanceof Element ? e.target.closest('.wl-dd__trigger') : null;
      const dd = ddOf(trigger);
      if (dd && !dd.classList.contains('is-open')) { e.preventDefault(); setOpen(dd); }
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    root.addEventListener('mouseover', onOver);
    root.addEventListener('mouseout', onOut);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    root.addEventListener('touchend', onTouch);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      root.removeEventListener('mouseover', onOver);
      root.removeEventListener('mouseout', onOut);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      root.removeEventListener('touchend', onTouch);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, enabled]);
}

export function Header({ propuesta = false }) {
  const onClick = useDeadLinks();
  const ref = useRef(null);
  useSingleDropdown(ref, propuesta);
  return <div ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: headerHTML(propuesta) }} />;
}

// En la propuesta, `logos` elige la variante del cinturón de logos: 'chip' (cada logo
// en una pastilla blanca) o 'color' (a color directo sobre el fondo negro).
export function Footer({ propuesta = false, logos = 'chip' }) {
  const onClick = useDeadLinks();
  const cls = propuesta ? `wl-footer-p wl-footer-p--${logos}` : undefined;
  return <div className={cls} onClick={onClick} dangerouslySetInnerHTML={{ __html: footerHTML(propuesta, logos) }} />;
}

// `onMenu` (solo en la propuesta): el botón "Menú" abre el menú lateral.
export function BottomNav({ onMenu }) {
  const dead = useDeadLinks();
  const onClick = (e) => {
    if (onMenu && e.target.closest('.clmc-mobile-menu-option [aria-haspopup="true"]')) {
      e.preventDefault();
      onMenu();
      return;
    }
    dead(e);
  };
  return (
    <div className="wl-only-mobile" onClick={onClick} dangerouslySetInnerHTML={{ __html: bottomNavHTML() }} />
  );
}

export function StickyCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setVisible(p > 0.22 && p < 0.85);
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <div className={`wl-sticky-cta${visible ? ' is-visible' : ''}`} role="complementary">
      <div className="wl-sticky-cta__txt">
        Bono de bienvenida <b>200% hasta $5,000</b>
        <br />
        <span style={{ color: 'var(--wl-grey)' }}>CUPON2026 · T&C aplican</span>
      </div>
      <button className="wl-btn wl-btn--primary" type="button">Regístrate</button>
    </div>
  );
}
