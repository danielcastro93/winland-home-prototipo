// Chat de soporte — launcher flotante (placeholder de Zendesk `#launcher`,
// burbuja circular abajo-izquierda). En prod, el ítem "Hablar con un agente" del menú
// abre este mismo widget; como el widget es GLOBAL y flotante, en el home vive igual
// sin necesidad del menú hamburguesa. En integración: cargar el script de Zendesk y
// este botón desaparece (lo pinta el widget real).
export default function ChatBubble() {
  return (
    <button
      className="wl-chat"
      type="button"
      aria-label="Hablar con un agente"
      onClick={(e) => e.preventDefault()}
    >
      <span className="wl-chat__label">Hablar con un agente</span>
      <span className="wl-chat__bubble">
        {/* MISMO ícono de persona que usa producción en "Hablar con un agente" del
            sidebar (MUI Person), con el punto de disponible abajo-derecha. */}
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
        </svg>
        <span className="wl-chat__status" />
      </span>
    </button>
  );
}
