# Assets del HERO (banner principal)

**Escritorio: 1920 × 600 px** (imagen o video). **Celular: 1200 × 750 px** (versión `-mobile`).

## Archivos actuales
- `slide-1-casino.jpg` / `slide-1-casino-mobile.jpg` → Banner 1 (Casino). Imagen.
- `slide-2-deportes.mp4` / `slide-2-deportes-mobile.mp4` → Banner 2 (Deportes). Video.
- `slide-2-deportes.jpg` / `slide-2-deportes-mobile.jpg` → Imagen de respaldo del video, se muestra mientras carga o si no se reproduce.

## Para REEMPLAZAR un banner
Sobrescribe el archivo en esta carpeta con el **mismo nombre** y la misma medida.

## Para AGREGAR o cambiar textos/CTA
Edita el arreglo `SLIDES` en `components/Hero.jsx` (una entrada por banner).
- Imagen: `{ kind: 'image', src, srcMobile, title, sub, ctas }`
- Video: `{ kind: 'video', src, poster, srcMobile, posterMobile, title, sub, ctas }` (`poster` es la imagen de respaldo)

## Specs recomendadas
- Imagen: JPG o WEBP, sujeto o arte hacia la derecha (el texto va a la izquierda).
- Video: MP4 (H.264), silenciado, en loop, breve (10 a 15 s) y ligero. Siempre con imagen de respaldo.
- El primer banner siempre debe ser imagen; el video va del segundo en adelante.
