function Casilla({ letra, estado, activa, onCambio }) {
  // Asignamos el símbolo visual según el estado
  const iconos = {
    correcta: '✓',
    presente: '?',
    ausente: '✕'
  }

  // Texto descriptivo para accesibilidad (lectores de pantalla)
  const textosEstado = {
    correcta: 'letra correcta en posición correcta',
    presente: 'letra presente en otra posición',
    ausente: 'letra no está en la palabra'
  }

  const etiquetaAccesible = letra
    ? `${letra}${estado ? `, ${textosEstado[estado]}` : ''}`
    : 'Casilla vacía'

  return (
    <div className="casilla-contenedor">
      <input
        className={`casilla ${estado}`}
        type="text"
        maxLength={1}
        value={letra}
        disabled={!activa}
        onChange={onCambio}
        aria-label={etiquetaAccesible}
      />
      {estado && (
        <span className="icono-accesibilidad" aria-hidden="true">
          {iconos[estado]}
        </span>
      )}
    </div>
  )
}

export default Casilla