// Selector para comparar las dos opciones de logos del footer en la propuesta.
// Actualiza la URL (?logos=chip|color) para poder compartir cada vista. Usa el enrutador
// de Next en modo "shallow": cambia la URL sin volver a montar la página (antes,
// reescribir el historial a mano hacía que el header se volviera a pintar).
import { useRouter } from 'next/router';

export default function LogoToggle({ value, onChange }) {
  const router = useRouter();
  const pick = (v) => () => {
    onChange(v);
    router.replace({ pathname: router.pathname, query: { ...router.query, logos: v } }, undefined, { shallow: true, scroll: false });
  };
  return (
    <div className="wl-logotoggle" role="group" aria-label="Logos del footer">
      <span className="wl-logotoggle__lbl">Logos del footer</span>
      <button type="button" aria-pressed={value === 'chip'} onClick={pick('chip')}>Pastilla blanca</button>
      <button type="button" aria-pressed={value === 'color'} onClick={pick('color')}>A color</button>
    </div>
  );
}
