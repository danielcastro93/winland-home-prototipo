// HERO estilo 888.com: banner full-bleed (imagen O video de fondo, arte a la
// derecha) con SOLO copy + CTA inyectados por código a la izquierda (editable y
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
//   • Imagen: .jpg o .webp de 1920×600 (+ versión móvil dedicada `-mobile`, 1200×750).
//   • VIDEO (opcional): el hero TAMBIÉN soporta video de fondo. Para conectarlo, pon
//     en la entrada `kind: 'video'`, `src` al .mp4 (silenciado) y `poster` a un .jpg.
//   RECOMENDACIÓN al usar video (importante para el rendimiento):
//     – El PRIMER slide SIEMPRE debe ser IMAGEN: carga al instante; un video pesa y
//       retrasa el primer pintado. El video va del 2.º slide en adelante.
//     – Videos MUY BREVES: ~10-15 s máx, silenciados y ligeros (<1-1.5 MB). El
//       carrusel rota solo cada 6 s (ver `interval` abajo), así que un clip corto en
//       loop luce mejor que uno largo que se corta.
//   Para REEMPLAZAR un banner: sobrescribe el archivo con el MISMO nombre (no toques
//   código). Para AGREGAR: copia el archivo y añade una entrada.
//   `h1: true` va solo en el primero (un solo H1 en la página).
// ────────────────────────────────────────────────────────────────────────────
const HERO = '/assets/hero';
const SLIDES = [
  {
    // `light: true` → imagen con lado claro y fundido a negro en el arte (tratamiento
    // nuevo: título naranja, texto gris, sin scrim, y en móvil textos arriba + imagen abajo).
    id: 'casino', kind: 'image', src: `${HERO}/slide-1-casino.jpg`, srcMobile: `${HERO}/slide-1-casino-mobile.jpg`, h1: true, light: true,
    title: 'Casino online en México',
    sub: 'Ruleta, slots y jackpots. Bono de bienvenida del 200% hasta $5,000.',
    ctas: [{ label: 'Jugar casino', variant: 'primary' }, { label: 'Regístrate', variant: 'ghost' }],
  },
  {
    // VIDEO en escritorio Y en móvil, cada uno con su imagen de respaldo (poster):
    // si el video no carga/falla, se ve el .jpg. `srcMobile` termina en .mp4 → móvil
    // también reproduce video (dedicado, más vertical). Cambia los archivos y listo.
    id: 'deportes', kind: 'video',
    src: `${HERO}/slide-2-deportes.mp4`, poster: `${HERO}/slide-2-deportes.jpg`,
    srcMobile: `${HERO}/slide-2-deportes-mobile.mp4`, posterMobile: `${HERO}/slide-2-deportes-mobile.jpg`,
    light: true,
    title: 'Apuestas deportivas en México',
    sub: 'Liga MX, NFL, NBA y MLB con momios en vivo, minuto a minuto.',
    ctas: [{ label: 'Ir a deportes', variant: 'primary' }],
  },
];

function Media({ s, eager }) {
  // Media MÓVIL dedicado (opcional). Si `srcMobile` es .mp4 → video (con su poster de
  // respaldo); si es imagen → <img>. Si el archivo no existe/ falla, se auto-elimina
  // (onError) y queda el media de escritorio como respaldo. Sube el archivo y aparece solo.
  const swapOn = (e) => e.currentTarget.parentElement?.classList.add('wl-media-m');
  const drop = (e) => e.currentTarget.remove();
  const mobileIsVideo = s.srcMobile && /\.mp4(\?|$)/i.test(s.srcMobile);
  const mobile = !s.srcMobile ? null : mobileIsVideo ? (
    <video className="wl-h888__bg wl-h888__bg--m" autoPlay muted loop playsInline
           poster={s.posterMobile} preload="metadata" onLoadedData={swapOn} onError={drop}>
      <source src={s.srcMobile} type="video/mp4" />
    </video>
  ) : (
    <img className="wl-h888__bg wl-h888__bg--m" src={s.srcMobile} alt="" aria-hidden="true"
         onLoad={swapOn} onError={drop} />
  );
  if (s.kind === 'video') {
    return (
      <>
        <video className="wl-h888__bg wl-h888__bg--d" autoPlay muted loop playsInline
          poster={s.poster} preload={eager ? 'auto' : 'metadata'}>
          <source src={s.src} type="video/mp4" />
        </video>
        {mobile}
      </>
    );
  }
  return (
    <>
      <img className="wl-h888__bg wl-h888__bg--d" src={s.src} alt="" aria-hidden="true" fetchPriority={eager ? 'high' : 'auto'} />
      {mobile}
    </>
  );
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

    // AUTO-CONTRASTE de los bullets: muestrea el brillo del fondo justo donde viven
    // (franja inferior-central de la imagen del slide activo). Fondo oscuro → bullets
    // blancos; fondo claro → bullets naranja. Se re-evalúa al cambiar de slide.
    const pag = root.querySelector('.splide__pagination');
    const sampleBrightness = () => {
      // toma el media VISIBLE del slide activo (la imagen móvil en móvil, la de escritorio si no)
      const medias = [...root.querySelectorAll('.splide__slide.is-active .wl-h888__bg')];
      const media = medias.find((m) => m.offsetParent !== null) || medias[0];
      if (!media || !pag) return;
      const iw = media.naturalWidth || media.videoWidth;
      const ih = media.naturalHeight || media.videoHeight;
      if (!iw || !ih) return;
      try {
        const cv = document.createElement('canvas');
        cv.width = 32; cv.height = 10;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(media, iw * 0.36, ih * 0.86, iw * 0.28, ih * 0.12, 0, 0, 32, 10);
        const d = ctx.getImageData(0, 0, 32, 10).data;
        let sum = 0;
        for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        // umbral 165: solo fondos genuinamente claros/blancos dejan los bullets naranja;
        // oscuros y cálidos-medios (donde el naranja se pierde) → bullets blancos.
        pag.classList.toggle('wl-pag-dark', sum / (d.length / 4) < 165);
      } catch (e) { /* canvas contaminado → conserva el estado por defecto (claro) */ }
    };
    const onLoad = () => sampleBrightness();
    root.querySelectorAll('.wl-h888__bg').forEach((m) => {
      if (m.tagName === 'IMG' && !m.complete) m.addEventListener('load', onLoad);
    });
    // activa el swap para el media móvil YA listo al hidratar (el on-load del JSX no
    // dispara si la imagen ya está en caché o el video ya tiene datos).
    root.querySelectorAll('.wl-h888__bg--m').forEach((m) => {
      const ready = m.tagName === 'VIDEO' ? m.readyState >= 2 : (m.complete && m.naturalWidth > 0);
      if (ready) m.parentElement?.classList.add('wl-media-m');
    });
    sp.on('mounted moved', sampleBrightness);
    const bt = setTimeout(sampleBrightness, 300);

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
      sp.off('mounted moved', sampleBrightness); clearTimeout(bt);
      root.querySelectorAll('.wl-h888__bg').forEach((m) => m.removeEventListener('load', onLoad));
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
              <div className={`wl-h888${s.light ? ' wl-h888--light' : ''}`}>
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
