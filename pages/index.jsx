// WINLAND — HOME HÍBRIDO (prototipo, réplica del design system de producción)
// Header/footer/bottom-nav: HTML real de producción. Página pre-renderizada
// (SSG/static export, igual que producción) con metas, OG y JSON-LD server-side.
import Head from 'next/head';
import { useEffect } from 'react';
import { useScrollProgressVar } from '../lib/hooks';
import Membrane from '../components/Membrane';
import Popup from '../components/Popup';
import ChatBubble from '../components/ChatBubble';
import BetSlip from '../components/BetSlip';
import { Header, Footer, BottomNav } from '../components/Chrome';
import Hero from '../components/Hero';
import Top10 from '../components/Top10';
import SlotsGallery from '../components/SlotsGallery';
import GamePicker from '../components/GamePicker';
import LiveCasino from '../components/LiveCasino';
import MatchCards from '../components/MatchCards';
import Promos from '../components/Promos';

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Winland',
      url: 'https://www.winland.com.mx/',
      logo: 'https://www.winland.com.mx/assets/img/logo_winland_white.png',
      description:
        'Casa de apuestas deportivas y casino en línea en México, regulada por la SEGOB (Permiso Federal No. DGJS/DGAAD/DCRCA/P-01/2017).',
    },
    {
      '@type': 'WebSite',
      name: 'Winland',
      url: 'https://www.winland.com.mx/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.winland.com.mx/casino?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function Home() {
  useScrollProgressVar(); // expone --wl-scroll (0–1) para la capa de "vida al scroll"

  // Compatibilidad con deep-links del sportsbook: el hash-routing de Altenar
  // (#/overview, #/sport/…) se reenvía a /deportes ANTES de pintar (ver doc 08 §2).
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      // En producción: window.location.replace('/deportes' + window.location.hash);
      console.info('[winland-home] deep-link Altenar detectado → redirigir a /deportes' + window.location.hash);
    }
  }, []);


  return (
    <>
      <Head>
        <title>Casa de Apuestas Deportivas y Casino Online en México | Winland</title>
        <meta
          name="description"
          content="Apuesta en la Liga MX, NFL, NBA y MLB, juega +2,800 slots y mesas de casino en vivo con crupieres reales. Bono de bienvenida 200% hasta $5,000. Regulado por SEGOB."
        />
        <link rel="canonical" href="https://www.winland.com.mx/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_MX" />
        <meta property="og:site_name" content="Winland" />
        <meta property="og:title" content="Winland — Apuestas deportivas y casino online en México" />
        <meta property="og:description" content="Deportes, casino y mesas en vivo en un solo lugar. Bono de bienvenida 200% hasta $5,000." />
        <meta property="og:url" content="https://www.winland.com.mx/" />
        <meta property="og:image" content="https://www.winland.com.mx/cms/img/promotions/CUPON2026/CUPON2026_L_1.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      </Head>

      <Membrane />
      <Popup />
      <Header />
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
      <Footer />
      <ChatBubble />
      <BetSlip />
      <BottomNav />
    </>
  );
}
