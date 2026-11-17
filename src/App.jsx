import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'
import Teclado from './components/Teclado.jsx'

const FILAS = 6
const COLUMNAS = 5
// Usamos palabras de 5 letras para mantener las 5 columnas (puedes ajustar 'GATOS' si prefieres otra)
const PALABRAS = ['PERRO', 'GATOS', 'RATON', 'MIRLO', 'RATAS']

function elegirPalabraAleatoria() {
  const indice = Math.floor(Math.random() * PALABRAS.length)
  return PALABRAS[indice]
}

function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

function obtenerEstadosFila(intentoFila, solucion) {
  const estados = Array(COLUMNAS).fill('ausente')
  const solucionLetras = solucion.split('')
  const intentoLetras = intentoFila.map(l => l.toUpperCase())

  for (let i = 0; i < COLUMNAS; i++) {
    if (intentoLetras[i] === solucionLetras[i]) {
      estados[i] = 'correcta'
      solucionLetras[i] = null
      intentoLetras[i] = null
    }
  }

  for (let i = 0; i < COLUMNAS; i++) {
    if (intentoLetras[i] !== null) {
      const index = solucionLetras.indexOf(intentoLetras[i])
      if (index !== -1) {
        estados[i] = 'presente'
        solucionLetras[index] = null
      }
    }
  }

  return estados
}

function App() {
  // La máquina elige una palabra aleatoria al iniciar
  const [solucion, setSolucion] = useState(() => elegirPalabraAleatoria())
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)

  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  // Calculamos los colores acumulados para las teclas del teclado virtual
  const estadosTeclas = {}
  for (let f = 0; f < filaActual; f++) {
    const estadosFila = obtenerEstadosFila(intentos[f], solucion)
    intentos[f].forEach((letra, i) => {
      const actual = estadosFila[i]
      const previo = estadosTeclas[letra]
      if (actual === 'correcta') {
        estadosTeclas[letra] = 'correcta'
      } else if (actual === 'presente' && previo !== 'correcta') {
        estadosTeclas[letra] = 'presente'
      } else if (actual === 'ausente' && !previo) {
        estadosTeclas[letra] = 'ausente'
      }
    })
  }

  useEffect(() => {
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    if (!/^[A-ZÑ]?$/.test(letra)) return

    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)

    if (letra !== '') {
      // Saltamos al siguiente contenedor de casilla si las envuelves en un div
      const siguiente = evento.target.closest('.casilla-contenedor')?.nextElementSibling?.querySelector('input')
      if (siguiente) siguiente.focus()
      else evento.target.nextElementSibling?.focus()
    }
  }

  function manejarTeclaVirtual(tecla) {
    if (terminada) return

    const filaActualLetras = [...intentos[filaActual]]
    const primerVacio = filaActualLetras.indexOf('')
    const copia = intentos.map((fila) => [...fila])

    if (tecla === 'BACKSPACE') {
      let indexBorrar = filaActualLetras.findLastIndex(l => l !== '')
      if (indexBorrar !== -1) {
        copia[filaActual][indexBorrar] = ''
        setIntentos(copia)
      }
      return
    }

    if (tecla === 'ENTER') {
      if (!filaActualLetras.includes('')) {
        setFilaActual(filaActual + 1)
      }
      return
    }

    if (/^[A-ZÑ]$/.test(tecla) && primerVacio !== -1) {
      copia[filaActual][primerVacio] = tecla
      setIntentos(copia)
    }
  }

  function comprobar(evento) {
    evento.preventDefault()
    if (terminada) return
    if (intentos[filaActual].includes('')) return
    setFilaActual(filaActual + 1)
  }

  function reiniciarPartida() {
    setSolucion(elegirPalabraAleatoria()) // Elegimos una nueva palabra al reiniciar
    setIntentos(tableroVacio())
    setFilaActual(0)
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => {
          const estadosFila = f < filaActual ? obtenerEstadosFila(fila, solucion) : []

          return (
            <div className="fila" key={f}>
              {fila.map((letra, c) => (
                <Casilla
                  key={c}
                  letra={letra}
                  estado={f < filaActual ? estadosFila[c] : ''}
                  activa={f === filaActual && !terminada}
                  onCambio={(evento) => cambiarLetra(f, c, evento)}
                />
              ))}
            </div>
          )
        })}
      </div>

      {terminada ? (
        <div className="fin-partida">
          <p className="mensaje" role="status">
            {ganada
              ? '¡Enhorabuena, has acertado!'
              : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={reiniciarPartida}>
            Nueva partida
          </button>
        </div>
      ) : (
        <button className="boton" type="submit">
          Comprobar
        </button>
      )}

      <Teclado onTecla={manejarTeclaVirtual} estadosTeclas={estadosTeclas} />
    </form>
  )
}

export default App