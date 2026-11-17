const FILAS_TECLADO = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]

export default function Teclado({ onTecla, estadosTeclas }) {
  return (
    <div className="teclado">
      {FILAS_TECLADO.map((fila, index) => (
        <div className="fila-teclado" key={index}>
          {fila.map((tecla) => {
            // Obtenemos el estado de la letra ('correcta', 'presente', 'ausente' o '')
            const estado = estadosTeclas[tecla] || ''
            const esEspecial = tecla === 'ENTER' || tecla === 'BACKSPACE'

            return (
              <button
                key={tecla}
                type="button"
                className={`tecla ${estado} ${esEspecial ? 'especial' : ''}`}
                onClick={() => onTecla(tecla)}
              >
                {tecla === 'BACKSPACE' ? '⌫' : tecla}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}