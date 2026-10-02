// WINLAND — HOME HÍBRIDO (vista compartida)
// La usan dos páginas: "/" (el home tal cual) y "/propuesta" (variantes para revisar
// con el equipo de Winland antes de pasarlas a desarrollo: menú simplificado con
// desplegables, menú lateral en celular y logos del footer a color).
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useScrollProgressVar } from '../lib/hooks';
import Membrane from './Membrane';
import Popup from './Popup';
import ChatBubble from './ChatBubble';
import BetSlip from './BetSlip';
import { Header, Footer, BottomNav } from './Chrome';
import MenuDrawer from './MenuDrawer';
import LogoToggle from './LogoToggle';
import Hero from './Hero';
import Top10 from './Top10';
import SlotsGallery from './SlotsGallery';
import GamePicker from './GamePicker';
import LiveCasino from './LiveCasino';
import MatchCards from './MatchCards';
import Promos from './Promos';

export default function HomeView({ propuesta = false }) {
  useScrollProgressVar(); // expone --wl-scroll (0–1) para la capa de "vida al scroll"
  const [menuOpen, setMenuOpen] = useState(false);
  // logos del footer en la propuesta: 'chip' (pastilla blanca) o 'color' (directo sobre negro)
  const [logos, setLogos] = useState('chip');

  useEffect(() => {
    if (!propuesta) return;
    const v = new URLSearchParams(window.location.search).get('logos');
    if (v === 'color' || v === 'chip') setLogos(v);
  }, [propuesta]);

  // Compatibilidad con deep-links del sportsbook: el hash-routing de Altenar
  // (#/overview, #/sport/…) se reenvía a /deportes ANTES de pintar.
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      // En producción: window.location.replace('/deportes' + window.location.hash);
      console.info('[winland-home] deep-link Altenar detectado → redirigir a /deportes' + window.location.hash);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Winland</title>
        {propuesta && <meta name="robots" content="noindex, nofollow" />}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <Membrane />
      <Popup />
      <Header propuesta={propuesta} />
      <main className="wl-main">
        <Hero />
        {/* ARRANQUE = las 3 verticales, una por bloque (ninguna enterrada):
            casino (Top 10) → deportes (eventos) → casino en vivo */}
        <Top10 />
        <MatchCards />
        <LiveCasino />
        {/* PROFUNDIDAD DE CASINO: vitrina de slots (blanco) + ruleta de juegos */}
        <SlotsGallery />
        <GamePicker />
        {/* PROMOCIONES (cierre; el hero ya abre con promos) */}
        <Promos />
      </main>
      {propuesta && <LogoToggle value={logos} onChange={setLogos} />}
      <Footer propuesta={propuesta} logos={logos} />
      <ChatBubble />
      <BetSlip />
      <BottomNav onMenu={propuesta ? () => setMenuOpen(true) : undefined} />
      {propuesta && <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
