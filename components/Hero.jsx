// HERO estilo 888.com: banner full-bleed (imagen O video de fondo, arte a la
// derecha) con SOLO copy + CTA inyectados por código a la izquierda (indexable,
// controlable por campaña; sin label superior). Bullets ovalados debajo del
// carrusel (estilo casino) + flechas. Slide inicial fijable por utm_content.
// Medida de banner: 1920×566 (desktop). Soporta <img> y <video autoplay muted loop>.
import { useEffect, useRef } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useInView } from '../lib/hooks';

const dead = (e) => e.preventDefault();

// ────────────────────────────────────────────────────────────────────────────
// SLIDES DEL HERO — editar aquí para agregar / quitar / cambiar banners.
// Assets en: public/assets/hero/  ·  MEDIDA: 1920 × 600 px (imagen O video).
//   • Imagen: .jpg o .webp de 1920×600.
//   • Video: .mp4 de 1920×600 (≤8s, silenciado, <1MB) + un "poster" .jpg de 1920×600.
//   Para REEMPLAZAR un banner: sobrescribe el archivo en la carpeta con el MISMO
//   nombre (no toques código). Para AGREGAR: copia el archivo y añade una entrada.
//   `h1: true` va solo en el primero (una sola H1 por SEO).
// ────────────────────────────────────────────────────────────────────────────
const HERO = '/assets/hero';
const SLIDES = [
  {
    id: 'casino', kind: 'image', src: `${HERO}/slide-1-casino.jpg`, h1: true,
    title: 'Casino online en México',
    sub: 'Ruleta, slots y jackpots — con bono de bienvenida del 200% hasta $5,000.',
    ctas: [{ label: 'Jugar casino', variant: 'primary' }, { label: 'Regístrate', variant: 'ghost' }],
  },
  {
    id: 'deportes', kind: 'video', src: `${HERO}/slide-2-deportes.mp4`, poster: `${HERO}/slide-2-deportes-poster.jpg`,
    title: 'Apuestas deportivas en México',
    sub: 'Liga MX, NFL, NBA y MLB con momios en vivo, minuto a minuto.',
    ctas: [{ label: 'Ir a deportes', variant: 'primary' }],
  },
];

function Media({ s, eager }) {
  if (s.kind === 'video') {
    return (
      <video
        className="wl-h888__bg" autoPlay muted loop playsInline
        poster={s.poster} preload={eager ? 'auto' : 'metadata'}
      >
        <source src={s.src} type="video/mp4" />
      </video>
    );
  }
  return <img className="wl-h888__bg" src={s.src} alt="" aria-hidden="true" fetchPriority={eager ? 'high' : 'auto'} />;
}

export default function Hero() {
  const [ref, inView] = useInView(0.02);
  const splideRef = useRef(null);

  useEffect(() => {
    const map = { casino: 0, deportes: 1, bono: 0 };
    const v = new URLSearchParams(window.location.search).get('utm_content');
    if (v && map[v] != null) splideRef.current?.go(map[v]);
  }, []);

  // Relleno FLUIDO de los bullets, dirigido por el timer real del autoplay de Splide
  // (rate 0→1). Se reinicia solo al cambiar de slide (incl. con flechas), y es suave
  // porque Splide lo actualiza cada frame. Sin animación CSS "robotizada".
  useEffect(() => {
    const sp = splideRef.current?.splide;
    if (!sp) return;
    const root = sp.root;
    const setFill = (rate) => {
      const active = root.querySelector('.splide__pagination__page.is-active');
      if (active) active.style.setProperty('--wl-fill', String(rate));
    };
    const reset = () => root.querySelectorAll('.splide__pagination__page').forEach((p) => p.style.setProperty('--wl-fill', '0'));
    const onPlaying = (rate) => setFill(rate);
    sp.on('autoplay:playing', onPlaying);
    sp.on('move', reset);

    // Flechas visibles SOLO cuando el cursor está sobre el media (track), no sobre
    // los bullets ni los tabs. Por geometría (no por :hover) para que la flecha,
    // que se dibuja encima del track, siga siendo clickeable.
    const hero = root.closest('.wl-hero888');
    const track = root.querySelector('.splide__track');
    let onMove, onLeave;
    if (track && hero && window.matchMedia('(pointer: fine)').matches) {
      onMove = (e) => {
        const r = track.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        hero.classList.toggle('wl-show-arrows', inside);
      };
      onLeave = () => hero.classList.remove('wl-show-arrows');
      root.addEventListener('mousemove', onMove);
      root.addEventListener('mouseleave', onLeave);
    }

    return () => {
      sp.off('autoplay:playing', onPlaying); sp.off('move', reset);
      if (onMove) { root.removeEventListener('mousemove', onMove); root.removeEventListener('mouseleave', onLeave); }
    };
  }, []);

  return (
    <section ref={ref} className={`wl-hero888${inView ? ' wl-inview' : ''}`}>
      <Splide
        ref={splideRef}
        options={{
          type: 'fade', rewind: true, autoplay: true, interval: 6000,
          speed: 700, pauseOnHover: false, arrows: true, pagination: true,
        }}
        aria-label="Winland: casino y apuestas deportivas"
      >
        {SLIDES.map((s, i) => {
          const H = s.h1 ? 'h1' : 'h2';
          return (
            <SplideSlide key={s.id}>
              <div className="wl-h888">
                <div className="wl-h888__media"><Media s={s} eager={i === 0} /></div>
                <div className="wl-h888__scrim" aria-hidden="true" />
                <div className="wl-h888__content">
                  <div className="wl-h888__inner">
                    <div className="wl-h888__text wl-reveal">
                      <H className="wl-h888__title">{s.title}</H>
                      {s.sub && <p className="wl-h888__sub">{s.sub}</p>}
                      <div className="wl-h888__ctas">
                        {s.ctas.map((c) => (
                          <a key={c.label} href="#" onClick={dead} className={`wl-btn wl-btn--${c.variant}`}>{c.label}</a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SplideSlide>
          );
        })}
      </Splide>
    </section>
  );
}
