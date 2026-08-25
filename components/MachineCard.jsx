// Card de juego REAL de producción (.clmc-machine) con el hover de barrido naranja
// idéntico al sitio. Reutilizada en el Top 10 y en la galería de slots.
// Con `rank` muestra el número gigante (estilo .clmc-machine-top-rank de prod).
import { thumb } from '../lib/data';

const GLOW = {
  evolution: 'rgba(245, 182, 66, 0.55)',
  alea: 'rgba(232, 91, 16, 0.55)',
  zitro: 'rgba(64, 156, 255, 0.5)',
  default: 'rgba(232, 91, 16, 0.5)',
};

const Heart = () => (
  <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
    <path d="M12 21s-7.5-4.7-9.7-9.2C.8 8.6 2.7 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.4 0 5.3 3.6 3.8 6.8C19.5 16.3 12 21 12 21z" stroke="#fff" strokeWidth="1.8" />
  </svg>
);

export default function MachineCard({ game, rank }) {
  const glow = GLOW[game.provider] || GLOW.default;
  const card = (
    <div className="wl-machine" style={{ '--wl-glow': glow }}>
      <div className="clmc-machine">
        <img className="clmc-machine-image" src={thumb(game)} alt={game.web_name} loading="lazy" width="163" height="163" />
        <button className="clmc-machine-favs-button" aria-label={`Añadir ${game.web_name} a favoritos`} style={{ border: 0, cursor: 'pointer', borderRadius: 0 }}>
          <Heart />
        </button>
        <div className="clmc-machine-hover">
          <div>
            <span>{game.web_name}</span>
            <button className="wl-play-btn" type="button">Play</button>
          </div>
        </div>
      </div>
    </div>
  );
  if (rank == null) return card;
  return (
    <div className="wl-top-item">
      <span className="wl-rank" aria-hidden="true">{rank}</span>
      {card}
    </div>
  );
}
