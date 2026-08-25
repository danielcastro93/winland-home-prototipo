// POPUP promocional = ARTE (imagen del CMS) + CTA EN HTML.
// Por qué híbrido y no solo imagen: el CTA por código es medible (clics/conversión),
// se puede hacer A/B testing, marketing cambia el copy sin rediseñar el arte, y es
// legible/accesible en cualquier pantalla.
//
// >>> DESTINO DEL CTA (a definir con el cliente en integración):
// >>>   · Usuario NO logueado  → /registro con el cupón precargado  ← mayor valor
// >>>   · Usuario logueado     → caja/depósito con el bono aplicado
// >>> Mandarlo a /promociones agrega pasos y pierde conversión.
//
// >>> FRECUENCIA (a validar con el cliente):
// >>>   Hoy aparece en CADA carga (petición del cliente para la demo).
// >>>   Para producción se recomienda 1 vez por sesión o 1 cada 24 h, y dejar de
// >>>   mostrarlo cuando el usuario ya convirtió. Implementación lista abajo:
// >>>   descomentar el bloque `FRECUENCIA` y elegir SESSION o DAILY.
//
// ACTIVACIÓN SIN CÓDIGO: se enciende subiendo la imagen a /assets/popup/popup.jpg
// (o .png). Si el archivo no existe, el popup simplemente no aparece.
// Para forzarlo en pruebas: ?popup=1
import { useEffect, useState, useCallback } from 'react';

const IMG_BASE = '/assets/popup/popup';

// Copy del CTA (editable sin tocar el arte)
const CTA_TEXT = 'Reclamar bono';
const LEGAL_TEXT = 'CUPON2026 · Aplican términos y condiciones';

export default function Popup() {
  const [src, setSrc] = useState(`${IMG_BASE}.jpg`);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // aparece SIEMPRE al cargar/recargar (desktop y mobile)
  useEffect(() => {
    /* ---- FRECUENCIA (descomentar para producción) -------------------------
    const KEY = 'wl-popup-seen';
    const MODE = 'SESSION';            // 'SESSION' = 1 vez por sesión · 'DAILY' = 1 cada 24 h
    const force = window.location.search.includes('popup=1');
    try {
      if (!force) {
        if (MODE === 'SESSION' && sessionStorage.getItem(KEY)) return;
        if (MODE === 'DAILY') {
          const last = Number(localStorage.getItem(KEY) || 0);
          if (Date.now() - last < 86400000) return;
        }
      }
      if (MODE === 'SESSION') sessionStorage.setItem(KEY, '1');
      else localStorage.setItem(KEY, String(Date.now()));
    } catch (e) {}
    ----------------------------------------------------------------------- */
    const t = setTimeout(() => setOpen(true), 900); // deja respirar el LCP del hero
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    // bloquea el scroll del fondo mientras el modal está abierto
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const onErr = () => {
    if (src.endsWith('.jpg')) setSrc(`${IMG_BASE}.png`);
    else setOpen(false); // sin imagen → sin popup
  };

  if (!open) return null;
  return (
    <div className={`wl-popup${ready ? ' wl-popup--in' : ''}`} role="dialog" aria-modal="true" aria-label="Promoción" onClick={close}>
      <div className="wl-popup__box" onClick={(e) => e.stopPropagation()}>
        <button className="wl-popup__close" type="button" aria-label="Cerrar" onClick={close}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </button>

        {/* ARTE: imagen del CMS (plug-and-play) */}
        <img className="wl-popup__img" src={src} alt="Promoción Winland" onError={onErr} onLoad={() => setReady(true)} />

        {/* CTA en HTML sobre el arte: medible, editable y accesible */}
        <div className="wl-popup__cta">
          <a href="#" onClick={(e) => e.preventDefault()} className="wl-btn wl-btn--primary wl-popup__btn">
            {CTA_TEXT}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <p className="wl-popup__legal">{LEGAL_TEXT}</p>
        </div>
      </div>
    </div>
  );
}
