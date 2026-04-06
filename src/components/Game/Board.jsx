import { useEffect, useState, act } from "react";
import Tile from "./Tile.jsx";
import Hand from "./Hand.jsx";
import DraggableTile from "./draggableTile.jsx";
import { useGame } from "../../hooks/useGame.js";
import "./Board.css";
import { useDraggable, DndContext, DragOverlay } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { areCompatible } from "../../hooks/deckFactory.js";
import { sortColor, sortNum } from "./botones_f.js";
import { handleDragLogic } from "./dragHandlers.js";

const parsearFichas = (stringFichas) => {
  if (!stringFichas) return [];

  const coloresMap = {
    R: "red",
    B: "blue",
    O: "orange",
    K: "black",
  };

  return stringFichas.split(",").map((f, index) => {
    const color = f[0];
    const numero = f.substring(1);

    return {
      id: color === "J" ? `J-${index}` : `${color}-${numero}-${index}`, // ID único id
      color: coloresMap[color] || "black",
      number: color === "J" ? "J" : parseInt(numero),
      placed: false,
    };
  });
};

const enviarConjuntos = (stringFichas) => {
  if (!stringFichas) return [];

  const coloresMap = {
    red: "R",
    blue: "B",
    orange: "O",
    black: "K",
  };

  return stringFichas.split(",").map((f, index) => {
    const color = f[0];
    const numero = f.substring(1);

    return {
      id: color === "J" ? `J-${index}` : `${color}-${numero}-${index}`, // ID único id
      color: coloresMap[color] || "black",
      number: color === "J" ? "J" : parseInt(numero),
      placed: false,
    };
  });
};

function Board({ idPartida, userId, currentBackground, onWin }) {
  // Obtenemos el estado del juego y las funciones para manipularlo
  const { bag, playerHand, gameBoard, setGameBoard, setPlayerHand } = useGame();
  const [activeId, setActiveId] = useState(null); // Para rastrear qué ficha se arrastra
  const [joinedSlots, setJoinedSlots] = useState([]);
  const [miTurno, setMiTurno] = useState(false); // pa turnos
  const [idJugadorTurno, setIdJugadorTurno] = useState(null);
  const [processing, setProcessing] = useState(false); // Para que se pueda o no usar el botón de robar y tal
  const [ordenTurno, setOrdenTurno] = useState(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // pa pruebas

  const [handPositions, setHandPositions] = useState(() => {
    // Inicializamos 20 huecos vacíos
    const initial = {};
    for (let i = 0; i < 20; i++) initial[`hand-slot-${i}`] = "";
    return initial;
  });

  const [boardPositions, setBoardPositions] = useState(() => {
    // Inicializamos 40 huecos vacíos
    const initial = {};
    for (let i = 0; i < 70; i++) initial[`board-slot-${i}`] = "";
    return initial;
  });

  useEffect(() => {
    const newJoined = [];

    // Recorremos el tablero por filas (5 filas de 14)
    for (let row = 0; row < 5; row++) {
      let currentRowIndices = [];
      let currentRowTiles = [];

      for (let col = 0; col < 14; col++) {
        const index = row * 14 + col;
        const slotId = `board-slot-${index}`;
        const tile = boardPositions[slotId];

        if (tile !== "") {
          currentRowIndices.push(slotId);
          currentRowTiles.push(tile);
        } else {
          // Al encontrar un hueco vacío, validamos el grupo acumulado hasta ahora
          if (areCompatible(currentRowTiles)) {
            newJoined.push(...currentRowIndices);
          }
          currentRowIndices = [];
          currentRowTiles = [];
        }
      }
      // Validar si quedó un grupo al final de la fila
      if (areCompatible(currentRowTiles)) {
        newJoined.push(...currentRowIndices);
      }
    }

    setJoinedSlots(newJoined);
  }, [boardPositions]); // Se ejecuta cada vez que el tablero cambie

  const actualizarManoVisual = (fichas) => {
    const newPositions = {};
    for (let i = 0; i < 20; i++) {
      newPositions[`hand-slot-${i}`] = fichas[i] || "";
    }
    setHandPositions(newPositions);
  };

  const actualizarTableroVisual = (tableroString) => {
    const fichas = parsearFichas(tableroString);
    const newBoard = {};
    // Inicializamos vacío
    for (let i = 0; i < 70; i++) newBoard[`board-slot-${i}`] = "";
    // Rellenamos (asumiendo que el string guarda posiciones, si no, los pone en orden)
    fichas.forEach((ficha, index) => {
      newBoard[`board-slot-${index}`] = { ...ficha, placed: true };
    });
    setBoardPositions(newBoard);
  };

  // Detectamos si es nuestro turno
  useEffect(() => {
    if (!idPartida) return;

    const sincronizar = async () => {
      try {
        // Pedimos el estado de la partida
        const res = await fetch(
          `http://localhost:8080/api/partidas/${idPartida}`,
        );
        const partida = await res.json();

        // Si no tenemos turno, lo pedimos
        if (ordenTurno === null) {
          const resParti = await fetch(
            `http://localhost:8080/api/participaciones/${userId}/${idPartida}`,
          );
          if (resParti.ok) {
            const participacion = await resParti.json();

            if (participacion.ordenTurno !== null) {
              console.log("Orden asignado: " + participacion.ordenTurno);
              setOrdenTurno(participacion.ordenTurno);
              const fichas = parsearFichas(participacion.manoActual);
              actualizarManoVisual(fichas);
            }
          }
        }

        // Si ya tenemos turno, comparamos con el turno actual de la partida
        if (ordenTurno !== null) {
          if (partida.turnoActual === ordenTurno && !miTurno) {
            setMiTurno(true);
            // Actualizar tablero con lo que hizo el rival
            //if (partida.tableroActual)
            //  actualizarTableroVisual(partida.tableroActual);
          }
        } else if (partida.turnoActual !== ordenTurno && miTurno) {
          setMiTurno(false);
        }
      } catch (error) {
        console.error("Error al obtener estado:", error);
      }
    };

    const interval = setInterval(sincronizar, 3000);
    return () => clearInterval(interval);
  }, [idPartida, userId, ordenTurno, miTurno]);

  function handleDragStart(event) {
    setActiveId(event.active.id); // Guardamos el ID al empezar
  }

  function handleDragEnd(event) {
    setActiveId(null);

    // Empaquetamos estados y setters para pasarlos a la lógica externa
    const states = {
      handPositions,
      setHandPositions,
      boardPositions,
      setBoardPositions,
      setPlayerHand,
      setGameBoard,
      miTurno,
      activeTile,
    };

    handleDragLogic(event, states);
  }

  const activeTile =
    Object.values(handPositions).find((t) => t?.id === activeId) ||
    Object.values(boardPositions).find((t) => t?.id === activeId);

  const sortByNumber = () => {
    const sorted = [
      ...Object.values(handPositions).filter((t) => t !== ""),
    ].sort(sortNum);

    const newPositions = {};
    for (let i = 0; i < 20; i++) {
      newPositions[`hand-slot-${i}`] = sorted[i] || "";
    }
    setHandPositions(newPositions);
  };

  const sortByColor = () => {
    const sorted = [
      ...Object.values(handPositions).filter((t) => t !== ""),
    ].sort(sortColor);

    const newPositions = {};
    for (let i = 0; i < 20; i++) {
      newPositions[`hand-slot-${i}`] = sorted[i] || "";
    }
    setHandPositions(newPositions);
  };

  const drawTile = async () => {
    if (!miTurno || processing) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("rummi-token");
      const res = await fetch(
        `http://localhost:8080/api/partidas/${idPartida}/pasar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idJugador: userId,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        const fichasNuevas = parsearFichas(data.manoActual);
        actualizarManoVisual(fichasNuevas)

        setHandPositions(newPositions);
        //setPlayerHand(Object.values(newPositions));

        const orden = participacion.ordenTurno;
        //orden === 0 ? setMiTurno(true) : setMiTurno(false);
        setMiTurno(false);

        //llamar a fichasActuales para el numero
      }
    } catch (error) {
      console.error("Error al robar:", error);
    } finally {
      setProcessing(false)   
    }
  };

  const cambiarTurno = async () => {
    // esto temporal pa ponerle algo
    setMiTurno(false);
    setProcessing(true);

    const token = localStorage.getItem("rummi-token");

    const res = await fetch(
      `http://localhost:8080/api/partidas/${idPartida}/pasar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idJugador: userId,
        }),
      },
    );

    if (res.ok) {
      setMiTurno(false);
      console.log("Siguiente urno. Esperando al oponente...");
    }

    //marcar todas las fichas de tablero como placed ESTO IRÁ AL ACTUALIZAR TABLERO
    setBoardPositions((prev) => {
      const nextState = {};
      for (const id in prev) {
        const currentTile = prev[id];
        if (currentTile && typeof currentTile === "object") {
          // Creamos una copia profunda de la ficha con el nuevo atributo
          nextState[id] = {
            ...currentTile,
            placed: true,
          };
        } else {
          nextState[id] = currentTile;
        }
      }
      return nextState;
    });

    console.log("Fin de turno");
    await delay(3000);
    setMiTurno(true);
    setProcessing(false);
    console.log("Empieza turno");
  };

  useEffect(() => {});

  const drawTileButton = () => {
    drawTile(); //cambiarTurno();
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="game-container">
        {/* HEADER: Información del mazo y botón de robar */}
        <div className="header">RUMMIPLUS TABLE</div>

        {/* ÁREA DEL TABLERO */}
        <main className="board-area">
          {/* El SVG de fondo */}
          <svg width="760" height="350" className="board-svg">
            <rect width="800" height="800" fill="#073600" />
          </svg>

          {/* FICHAS DINÁMICAS (Las que el jugador tiene en la mano) */}
          <div className="board-grid">
            {(() => {
              const slots = Object.keys(boardPositions);
              let groupCounter = 0; // Contador para el índice dentro del grupo

              return slots.map((slotId, index) => {
                const isJoined = joinedSlots.includes(slotId);

                // Lógica de conteo:
                // Si la ficha está unida, aumentamos el contador.
                // Si no está unida o es inicio de fila, reseteamos a 0.
                if (!isJoined || index % 14 === 0) {
                  groupCounter = 0;
                } else {
                  groupCounter++;
                }

                return (
                  <Hand
                    key={slotId}
                    id={slotId}
                    // Pasamos la variable CSS directamente al style
                    style={{ "--tile-index": groupCounter }}
                    className={isJoined ? "tile-joined" : ""}
                  >
                    {boardPositions[slotId] && (
                      <DraggableTile tile={boardPositions[slotId]} />
                    )}
                  </Hand>
                );
              });
            })()}
          </div>
        </main>

        {/* Baraja con las fichas restantes */}
        <button
          className="deck-container"
          disabled={processing}
          onClick={drawTileButton}
          title="Robar ficha"
        >
          <div className="deck-stack">
            <div className="deck-count">{bag.length}</div>
          </div>
        </button>

        {/* Botones para ordenar las fichas */}
        <div className="order-container">
          <button onClick={sortByColor} title="Ordenar por palo">
            ♤♤♤
          </button>
          <button onClick={sortByNumber} title="Ordenar numéricamente">
            789
          </button>

          <button
            disabled={processing}
            onClick={cambiarTurno}
            title="fin turno"
          >
            FIN
          </button>
        </div>

        {/* SOPORTE DEL JUGADOR */}
        <div className="player-rack">
          {/* El SVG de madera */}
          <svg width="600" height="150" className="rack-svg">
            <rect
              x="30"
              y="20"
              width="540"
              height="60"
              fill="#5d2e0a"
              stroke="#3e1f07"
              strokeWidth="2"
              rx="5"
            />
            <rect
              x="30"
              y="70"
              width="540"
              height="60"
              fill="#8B4513"
              stroke="#5d2e0a"
              strokeWidth="2"
              rx="5"
            />
          </svg>

          {/* FICHAS DINÁMICAS (Las que el jugador tiene en la mano) */}

          <div className="player-Hand">
            {Object.keys(handPositions).map((slotId) => (
              <Hand key={slotId} id={slotId}>
                {handPositions[slotId] && (
                  <DraggableTile tile={handPositions[slotId]} />
                )}
              </Hand>
            ))}
          </div>
        </div>
      </div>

      {/* ESTO ES LO QUE PERMITE EL ARRASTRE LIBRE */}
      <DragOverlay zIndex={1000}>
        {activeId ? (
          <Tile
            number={activeTile.number}
            color={activeTile.color}
            placed={activeTile.placed}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;
