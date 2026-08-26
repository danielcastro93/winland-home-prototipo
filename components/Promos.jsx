// Promociones: solo 2 banners (imagen), sin CTAs por card; un único CTA "Ver todas".
// Cabecera homologada (título + subtítulo + see-all) como las demás secciones.
import { promos } from '../lib/data';
import { useInView, useTilt } from '../lib/hooks';

const dead = (e) => e.preventDefault();

function PromoCard({ p }) {
  const tilt = useTilt(4);
  return (
    <a ref={tilt} href="#" onClick={dead} className="wl-promo-card" aria-label={p.alt}>
      <img src={p.img} alt={p.alt} loading="lazy" />
    </a>
  );
}

export default function Promos() {
  const [ref, inView] = useInView(0.1);
  const visible = promos.slice(0, 3);
  return (
    <section id="promos" ref={ref} className={`wl-section${inView ? ' wl-inview' : ''}`}>
      <div className="wl-row-head wl-reveal">
        <div>
          <h2 className="wl-h2" style={{ margin: 0 }}>Bonos y promociones</h2>
          <p className="wl-sub" style={{ margin: '16px 0 0' }}>Bono de bienvenida, giros gratis y recargas para sacarle más a cada jugada.</p>
        </div>
        <a className="wl-see-all" href="#" onClick={dead}>
          Ver todas las promociones
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <div className="wl-promo-grid wl-reveal wl-reveal--d1">
        {visible.map((p) => (
          <PromoCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
