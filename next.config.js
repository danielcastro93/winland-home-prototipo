/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Igual que producción (nextExport): el home se entrega como HTML estático pre-renderizado.
  output: 'export',
  images: { unoptimized: true },
  // El indicador de dev de Next 16 truena al procesar el mensaje HMR "isrManifest"
  // (handleStaticIndicator) y aborta la hidratación de React. Desactivado.
  devIndicators: false,
};

module.exports = nextConfig;
