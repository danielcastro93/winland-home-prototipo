import { Html, Head, Main, NextScript } from 'next/document';

// Hojas del design system (emotion/MUI compilado primero y Calimaco después) para que
// las clases `clmc-*` ganen el cascade. La capa propia (`wl-*`) la inyecta Next al
// final vía _app, y encima va la tipografía Barlow de la propuesta.
export default function Document() {
  return (
    <Html lang="es-MX">
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: '@font-face{font-family:winland;src:url("/prod/fonts/DenimINK.ttf") format("truetype");font-display:swap}',
          }}
        />
        <link rel="stylesheet" href="/prod/emotion.css" />
        <link rel="stylesheet" href="/prod/winland-prod.css" />
        <link rel="icon" href="/assets/img/favicon.png" sizes="any" />
        {/* BARLOW: tipografía de TODO el sitio en la propuesta (títulos, textos, CTAs,
            header, footer y navegación inferior). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
