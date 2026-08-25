// Casino — "La sala brilla".
// Curaduría = los lobbies REALES del CMS de Winland (Calimaco):
//   CASINO1 "Top 20" (prueba social) → aquí el top 3 se presenta como PODIO escénico
//   CASINO3 "Recomendados Winland" (la curaduría de la casa)
//   CASINO9 "Juegos Nuevos" (frescura) · CASINO4 "Crash Games" (tendencia)
// Cards con clases clmc reales (hover de barrido naranja) + glow + tilt 3D.
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { lobbies, thumb } from '../lib/data';
import { useInView, useTilt } from '../lib/hooks';

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

export function MachineCard({ game, rank }) {
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

// Podio: los 3 más jugados como piezas flotando sobre el piso del casino.
function PodiumCard({ game, place }) {
  const tilt = useTilt(8);
  return (
    <div ref={tilt} className={`wl-podium__item wl-podium__item--${place}`}>
      <span className="wl-podium__rank" aria-hidden="true">{place}</span>
      <img className="wl-podium__img" src={thumb(game)} alt={game.web_name} />
      <div className="wl-podium__meta">
        <b>{game.web_name}</b>
        <button className="wl-play-btn" type="button">Play</button>
      </div>
    </div>
  );
}

function Podium({ games }) {
  const [g1, g2, g3] = games;
  if (!g1 || !g2 || !g3) return null;
  return (
    <div className="wl-podium wl-reveal wl-reveal--d1" aria-label="Los 3 juegos más jugados">
      <span className="wl-float-glow wl-podium__glow" aria-hidden="true" />
      <PodiumCard game={g2} place={2} />
      <PodiumCard game={g1} place={1} />
      <PodiumCard game={g3} place={3} />
    </div>
  );
}

function Row({ title, games, ranked, icon, startRank = 1 }) {
  return (
    <>
      <div className="wl-row-head wl-reveal">
        <h3>
          {icon && <img className="wl-row-icon" src={`https://www.winland.com.mx/static/images/icons/menu-lobby/casino/${icon}.png`} alt="" aria-hidden="true" />}
          {title} <span className="wl-count-badge">{games.length + (ranked ? startRank - 1 : 0)}</span>
        </h3>
        <a className="wl-see-all" href="#" onClick={(e) => e.preventDefault()}>
          Ver todo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </a>
      </div>
      <div className="wl-reveal wl-reveal--d1 wl-stagger">
        <Splide
          className="clmc-splide-lobbySlider"
          options={{
            gap: '8px',
            pagination: false,
            perPage: ranked ? 4 : 6,
            perMove: 2,
            breakpoints: {
              1100: { perPage: ranked ? 3 : 5 },
              900: { perPage: ranked ? 3 : 4 },
              680: { perPage: ranked ? 2 : 3 },
              480: { perPage: 2 },
            },
          }}
          aria-label={title}
        >
          {games.map((g, i) => (
            <SplideSlide key={g.machine}>
              <MachineCard game={g} rank={ranked ? i + startRank : null} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </>
  );
}

export default function CasinoRows() {
  const [ref, inView] = useInView(0.08);
  const top = lobbies.top20.games;
  return (
    <section id="casino" ref={ref} className={`wl-section${inView ? ' wl-inview' : ''}`}>
      <span className="wl-kicker wl-reveal">Casino</span>
      <h2 className="wl-h2 wl-reveal wl-reveal--d1">La sala brilla</h2>
      <p className="wl-sub wl-reveal wl-reveal--d1">
        El podio de la semana, la curaduría de la casa y lo recién llegado — directo del piso del casino.
      </p>
      <Podium games={top.slice(0, 3)} />
      <Row title={lobbies.top20.name} games={top.slice(3)} ranked startRank={4} icon="CASINO1" />
      <Row title={lobbies.nuevos.name} games={lobbies.nuevos.games.slice(0, 18)} icon="CASINO9" />
    </section>
  );
}
