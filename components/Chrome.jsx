// Header, Footer y BottomNav — HTML real de producción, renderizado tal cual.
// Todos los enlaces están neutralizados a "#" (ver lib/frags.js).
import { useCallback, useEffect, useState } from 'react';
import { headerHTML, footerHTML, bottomNavHTML } from '../lib/frags';

// Evita que los "#" muevan el scroll.
function useDeadLinks() {
  return useCallback((e) => {
    if (e.target.closest('a')) e.preventDefault();
  }, []);
}

export function Header() {
  const onClick = useDeadLinks();
  return <div onClick={onClick} dangerouslySetInnerHTML={{ __html: headerHTML() }} />;
}

export function Footer() {
  const onClick = useDeadLinks();
  return <div onClick={onClick} dangerouslySetInnerHTML={{ __html: footerHTML() }} />;
}

export function BottomNav() {
  const onClick = useDeadLinks();
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
