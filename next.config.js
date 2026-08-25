/** @type {import('next').NextConfig} */
// Para publicar en GitHub Pages (sirve bajo /<repo>/) se construye con PAGES=1,
// que activa el basePath. En local (sin PAGES) el sitio corre en la raíz.
const repo = '/winland-home-prototipo';
const onPages = process.env.PAGES === '1';

const nextConfig = {
  reactStrictMode: true,
  // El home se entrega como HTML estático pre-renderizado.
  output: 'export',
  images: { unoptimized: true },
  // El indicador de dev de Next 16 truena al procesar el mensaje HMR "isrManifest"
  // (handleStaticIndicator) y aborta la hidratación de React. Desactivado.
  devIndicators: false,
  ...(onPages ? { basePath: repo, assetPrefix: repo } : {}),
};

module.exports = nextConfig;
