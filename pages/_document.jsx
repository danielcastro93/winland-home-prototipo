import { Html, Head, Main, NextScript } from 'next/document';

// Las hojas REALES de producción se cargan aquí en el mismo orden que el sitio:
// emotion (MUI compilado) primero y Calimaco después, para que `clmc-*` gane el
// cascade. La capa propia (`wl-*`) la inyecta Next al final vía _app.
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
        {/* Fuente display definitiva: SORA (titulares · header · CTAs · títulos del footer).
            El cuerpo de texto sigue en Denim INK. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
