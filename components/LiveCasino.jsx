// Casino en vivo — "La mesa te espera": cards limpios con imagen (media 16:10, sin
// recortes feos) + badge EN VIVO + barra de datos abajo. CTA al estilo de las demás
// secciones. Sin fichitas flotantes.
import { lobbies, thumb } from '../lib/data';
import { useInView } from '../lib/hooks';

const dead = (e) => e.preventDefault();

const TABLES = () => [
  { key: 'ruleta', label: 'Ruleta en Vivo', sub: 'Crupieres reales · 24/7', game: lobbies.liveRuleta.games[0] },
  { key: 'blackjack', label: 'Blackjack', sub: `${lobbies.liveBlackjack.games.length}+ mesas abiertas`, game: lobbies.liveBlackjack.games[0] },
  { key: 'baccarat', label: 'Baccarat', sub: 'Mesas VIP y Punto Banco', game: lobbies.liveBaccarat.games[0] },
];

function LiveCard({ t, i }) {
  return (
    <a href="#" onClick={dead} className={`wl-live-card wl-reveal wl-reveal--d${i + 1}`}>
      <div className="wl-live-card__media">
        {t.game && <img className="wl-live-card__img" src={thumb(t.game)} alt="" loading="lazy" />}
        <span className="wl-live-card__badge"><span className="wl-live-dot" /> EN VIVO</span>
      </div>
      <div className="wl-live-card__body">
        <div className="wl-live-card__txt">
          <div className="wl-live-card__name">{t.label}</div>
          <div className="wl-live-card__sub">{t.sub}</div>
        </div>
        <span className="wl-btn wl-btn--primary" style={{ padding: '9px 18px', fontSize: 13 }}>Entrar</span>
      </div>
    </a>
  );
}

export default function LiveCasino() {
  const [ref, inView] = useInView();
  return (
    <section id="envivo" ref={ref} className={`wl-section wl-live-section${inView ? ' wl-inview' : ''}`}>
      <div className="wl-row-head wl-reveal">
        <div>
          <h2 className="wl-h2" style={{ margin: 0 }}>La mesa te espera</h2>
          <p className="wl-sub" style={{ margin: '16px 0 0' }}>Ruleta, Blackjack y Baccarat con crupieres reales transmitiendo ahora mismo.</p>
        </div>
        <a className="wl-see-all" href="#" onClick={dead}>
          Ver casino en vivo
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <div className="wl-live-grid">
        {TABLES().map((t, i) => (
          <LiveCard key={t.key} t={t} i={i} />
        ))}
      </div>
    </section>
  );
}
