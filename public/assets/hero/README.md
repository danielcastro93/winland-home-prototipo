# Assets del HERO (banner principal)

**Medida única: 1920 × 600 px** (para imagen y video).

## Archivos actuales
- `slide-1-casino.jpg`            → Banner 1 (Casino). Imagen 1920×600.
- `slide-2-deportes.mp4`          → Banner 2 (Deportes). Video 1920×600.
- `slide-2-deportes-poster.jpg`   → Póster del video (1920×600), se muestra mientras carga.

## Para REEMPLAZAR un banner (sin tocar código)
Sobrescribe el archivo en esta carpeta con el **mismo nombre**. Ej.: pon tu nueva
imagen de casino como `slide-1-casino.jpg` (1920×600) y listo.

## Para AGREGAR o cambiar textos/CTA
Edita el arreglo `SLIDES` en `components/Hero.jsx` (una entrada por banner).
- Imagen:  `{ kind: 'image', src: '/assets/hero/tu-archivo.jpg', title, sub, ctas }`
- Video:   `{ kind: 'video', src: '/assets/hero/tu-archivo.mp4', poster: '/assets/hero/tu-poster.jpg', title, sub, ctas }`

## Specs recomendadas
- Imagen: JPG o WEBP, 1920×600, sujeto/arte hacia la derecha (el copy va a la izquierda).
- Video: MP4 (H.264), 1920×600, ≤8s, silenciado, <1 MB, en loop. Siempre con póster.
- Móvil: se recorta automáticamente; si quieres arte móvil dedicado, pídelo aparte.
