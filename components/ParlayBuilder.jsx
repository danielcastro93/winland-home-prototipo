// Bloque interactivo de DEPORTES: "Arma tu combinada".
// El usuario toca los momios (1 / X / 2) de varios partidos de Liga MX; cada
// selección entra al boleto y la cuota combinada + ganancia potencial se
// recalculan en vivo. Es la interacción nativa de un sportsbook.
// En integración esto lo alimentaría el bet-slip real de Altenar.
import { useMemo, useState } from 'react';
import { matchEvents } from '../lib/data';
import { useInView } from '../lib/hooks';

const dead = (e) => e.preventDefault();
const OUTCOMES = [['home', '1'], ['draw', 'X'], ['away', '2']];

export default function ParlayBuilder() {
  const [ref, inView] = useInView(0.1);
  // selecciones: { [matchId]: 'home'|'draw'|'away' }
  const [picks, setPicks] = useState({});
  const [stake, setStake] = useState(100);
  const games = matchEvents.slice(0, 5);

  const toggle = (id, out) => {
    setPicks((p) => {
      const next = { ...p };
      if (next[id] === out) delete next[id];
      else next[id] = out;
      return next;
    });
  };

  const { count, combined, selection } = useMemo(() => {
    const entries = Object.entries(picks);
    let comb = 1;
    const sel = entries.map(([id, out]) => {
      const ev = games.find((g) => String(g.id) === String(id));
      const odd = ev.ml[out];
      comb *= odd;
      const label = out === 'home' ? ev.home.name : out === 'away' ? ev.away.name : 'Empate';
      return { id, label, odd, ev, out };
    });
    return { count: entries.length, combined: comb, selection: sel };
  }, [picks, games]);

  const potential = count > 0 ? stake * combined : 0;

  return (
    <section id="combinada" ref={ref} className={`wl-section wl-parlay${inView ? ' wl-inview' : ''}`}>
      <span className="wl-kicker wl-reveal">Arma tu apuesta</span>
      <h2 className="wl-h2 wl-reveal wl-reveal--d1">Crea tu combinada</h2>
      <p className="wl-sub wl-reveal wl-reveal--d1">
        Toca los momios de la Liga MX y mira crecer tu cuota. Entre más partidos, mayor la ganancia.
      </p>

      <div className="wl-parlay__grid wl-reveal wl-reveal--d1">
        <div className="wl-parlay__matches">
          {games.map((ev) => (
            <div className="wl-parlay__match" key={ev.id}>
              <div className="wl-parlay__match-info">
                <span className="wl-parlay__match-meta">
                  {ev.live && <span className="wl-match__live" style={{ margin: 0 }}><span className="wl-live-dot" /> EN VIVO</span>}
                  {ev.date} · {ev.league}
                </span>
                <div className="wl-parlay__teams">
                  <img src={ev.home.logo} alt="" aria-hidden="true" /> <b>{ev.home.name}</b>
                  <span className="wl-parlay__vs">vs</span>
                  <b>{ev.away.name}</b> <img src={ev.away.logo} alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="wl-parlay__outcomes">
                {OUTCOMES.map(([out, lbl]) => (
                  <button
                    key={out}
                    type="button"
                    className={`wl-parlay__odd${picks[ev.id] === out ? ' is-on' : ''}`}
                    onClick={() => toggle(ev.id, out)}
                    aria-pressed={picks[ev.id] === out}
                  >
                    <span>{lbl}</span>
                    <b>{ev.ml[out].toFixed(2)}</b>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="wl-slip">
          <div className="wl-slip__head">
            <span>Tu boleto</span>
            {count > 0 && <span className="wl-slip__count">{count}</span>}
          </div>
          {count === 0 ? (
            <p className="wl-slip__empty">Toca los momios para armar tu combinada.</p>
          ) : (
            <>
              <ul className="wl-slip__list">
                {selection.map((s) => (
                  <li key={s.id}>
                    <div>
                      <b>{s.label}</b>
                      <span>{s.ev.home.name} vs {s.ev.away.name}</span>
                    </div>
                    <em>{s.odd.toFixed(2)}</em>
                    <button type="button" className="wl-slip__remove" aria-label="Quitar" onClick={() => toggle(s.id, s.out)}>×</button>
                  </li>
                ))}
              </ul>
              <div className="wl-slip__row">
                <span>Cuota combinada</span>
                <b className="wl-slip__combined">{combined.toFixed(2)}</b>
              </div>
              <label className="wl-slip__stake">
                <span>Tu apuesta</span>
                <div>
                  $<input type="number" min="10" step="10" value={stake}
                    onChange={(e) => setStake(Math.max(0, Number(e.target.value) || 0))} />
                </div>
              </label>
              <div className="wl-slip__payout">
                <span>Ganancia potencial</span>
                <b>${potential.toLocaleString('es-MX', { maximumFractionDigits: 2 })}</b>
              </div>
            </>
          )}
          <button className="wl-btn wl-btn--primary wl-slip__cta" type="button" disabled={count === 0} onClick={dead}>
            {count === 0 ? 'Elige tus partidos' : `Apostar $${stake.toLocaleString('es-MX')}`}
          </button>
        </aside>
      </div>
    </section>
  );
}
