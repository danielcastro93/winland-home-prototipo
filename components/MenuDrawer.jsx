// Menú lateral de celular (PROPUESTA): la misma estructura y orden que el header de
// escritorio (lib/menu.js), con las MEDIDAS del menú lateral actual del sitio: panel
// negro de 320 px, banner 288x107, opciones de 34 px con 14 px entre ellas, divisorias
// entre secciones y subopciones de 46 px con 6 px entre ellas.
// "Ver todo" va al final de cada sección (como en escritorio) con su ícono naranja.
// Se abre desde "Menú" en la barra inferior; se cierra con el fondo, la ✕ o Escape.
import { useEffect, useState } from 'react';
import { MENU } from '../lib/menu';

const ICON = (n) => `/assets/img/menu/aside/${n}.svg`;
const dead = (e) => e.preventDefault();

function Chevron({ open }) {
  return (
    <svg className={`wl-drawer__chev${open ? ' is-open' : ''}`} width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1.6 1.8 6 6.2l4.4-4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ícono de "Ver todo": flecha dentro de un círculo, en naranja
function AllIcon() {
  return (
    <svg className="wl-drawer__ic" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.6" stroke="#E85B11" strokeWidth="1.6" />
      <path d="M8.6 6.6 12 10l-3.4 3.4" stroke="#E85B11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MenuDrawer({ open, onClose }) {
  const [section, setSection] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const sections = MENU.filter((m) => m.items);
  const links = MENU.filter((m) => !m.items);

  return (
    <div className={`wl-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="wl-drawer__overlay" onClick={onClose} />
      <nav className="wl-drawer__panel" aria-label="Menú">
        <button className="wl-drawer__close" type="button" aria-label="Cerrar menú" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </button>
        <a className="wl-drawer__banner" href="#" onClick={dead}>
          <img src="/assets/img/menu/aside/banner.jpg" alt="Fiesta futbolera" />
        </a>

        <div className="wl-drawer__nav">
          {sections.map((m) => {
            const isOpen = section === m.id;
            return (
              <div key={m.id} className="wl-drawer__sec">
                <button className="wl-drawer__row" type="button" aria-expanded={isOpen} onClick={() => setSection(isOpen ? null : m.id)}>
                  <img className="wl-drawer__ic" src={ICON(m.icon)} alt="" aria-hidden="true" />
                  <span>{m.label}</span>
                  <Chevron open={isOpen} />
                </button>
                <div className={`wl-drawer__sub${isOpen ? ' is-open' : ''}`}>
                  {m.items.map((s) => (
                    <a key={s.label} className="wl-drawer__subrow" href="#" onClick={dead}>
                      <img className="wl-drawer__ic" src={ICON(s.icon)} alt="" aria-hidden="true" />
                      <span>{s.label}</span>
                    </a>
                  ))}
                  <a className="wl-drawer__subrow wl-drawer__subrow--all" href="#" onClick={dead}>
                    <AllIcon />
                    <span>Ver todo {m.label}</span>
                  </a>
                </div>
              </div>
            );
          })}
          <div className="wl-drawer__sec wl-drawer__sec--links">
            {links.map((m) => (
              <a key={m.id} className="wl-drawer__row" href="#" onClick={dead}>
                <img className="wl-drawer__ic" src={ICON(m.icon)} alt="" aria-hidden="true" />
                <span>{m.label}</span>
              </a>
            ))}
          </div>
        </div>

        <a className="wl-drawer__agent" href="#" onClick={dead}>
          <span className="wl-drawer__avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" /></svg>
            <i />
          </span>
          <span className="wl-drawer__agenttxt"><b>Hablar con un agente</b><span>Disponible 24/7</span></span>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true"><path d="M1.5 1.5 6.5 7l-5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </nav>
    </div>
  );
}
