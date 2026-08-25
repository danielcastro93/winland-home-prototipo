// CUPÓN — SIMULACIÓN de la barra del boleto de apuesta.
// Comportamiento (como producción): OCULTO de inicio; cuando el usuario toca una cuota
// en "Eventos deportivos destacados" aparece la barra naranja anclada abajo-derecha con
// el contador de selecciones y la CUOTA TOTAL (producto de las cuotas). No se expande:
// es solo visual, para comunicar que el boleto vive también en el home.
//
// >>> EN INTEGRACIÓN: ELIMINAR este componente. Aquí va el CUPÓN REAL de producción
// >>> (Altenar WSDK · WBetslipOverlay, el mismo de /deportes): al montar el widget,
// >>> las selecciones de las cuotas caen a él automáticamente y él pinta la barra,
// >>> el panel, el flujo de apuesta completo y "Mis apuestas".
//
// Escucha el evento `wl:bet` que disparan las cuotas de MatchCards:
//   detail: { id: <id del evento>, odds: <cuota>, on: <true=agregar / false=quitar> }
import { useEffect, useState } from 'react';

export default function BetSlip() {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const onBet = (e) => {
      const { id, odds, on } = e.detail || {};
      setBets((prev) => {
        const rest = prev.filter((b) => b.id !== id);
        return on ? [...rest, { id, odds }] : rest;
      });
    };
    window.addEventListener('wl:bet', onBet);
    return () => window.removeEventListener('wl:bet', onBet);
  }, []);

  if (!bets.length) return null;
  const total = bets.reduce((acc, b) => acc * b.odds, 1);

  return (
    <div className="wl-betslip" role="status" aria-live="polite">
      <div className="wl-betslip__bar">
        <span className="wl-betslip__left">
          CUPÓN <b className="wl-betslip__count">{bets.length}</b>
        </span>
        <span className="wl-betslip__right">
          CUOTA TOTAL <b>{total.toFixed(2)}</b>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 10 6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
