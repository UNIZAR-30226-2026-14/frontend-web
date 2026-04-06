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
  console.log("PROPS EN BOARD:", { idPartida, userId });

  const { bag, playerHand, setPlayerHand, gameBoard, setGameBoard, drawTile } =
    useGame();
  const [activeId, setActiveId] = useState(null); // Para rastrear qué ficha se arrastra
  const [joinedSlots, setJoinedSlots] = useState([]);
  const [miTurno, setMiTurno] = useState(true); // pa turnos
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

  // Cuando recibas las 14 fichas iniciales, llénalas en los primeros huecos:
  /*useEffect(() => {
    if (playerHand.length > 0) {
      const newPositions = { ...handPositions };
      playerHand.forEach((tile, index) => {
        newPositions[`hand-slot-${index}`] = tile;
      });
      setHandPositions(newPositions);
    }
  }, [playerHand]);*/

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

  useEffect(() => {
    if (!userId || !idPartida) {
      console.warn("Fetch abortado: faltan datos", { userId, idPartida });
      return;
    }

    const fetchInitialHand = async () => {
      try {
        console.log(userId);
        console.log(idPartida);
        const res = await fetch(
          `http://localhost:8080/api/participaciones/${userId}/${idPartida}`,
        );
        const participacion = await res.json();
        const fichas = parsearFichas(participacion.manoActual); 

        const newPositions = { ...handPositions };
        fichas.forEach((tile, index) => {
          newPositions[`hand-slot-${index}`] = tile;
        });

        setHandPositions(newPositions);

        const orden= participacion.ordenTurno;
        //orden === 0 ? setMiTurno(true) : setMiTurno(false);
        setOrdenTurno(orden);

        //llamar a fichasActuales para el numero
      } catch (error) {
        console.error("Error al cargar la mano:", error);
      }
    };

    fetchInitialHand();
  }, [idPartida, userId]);

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
    const sorted = [...playerHand].sort(sortNum);
    setPlayerHand(sorted);
  };

  const sortByColor = () => {
    const sorted = [...playerHand].sort(sortColor);
    setPlayerHand(sorted);
  };

  const cambiarTurno = async () => {
    // esto temporal pa ponerle algo
    setMiTurno(false);
    setProcessing(true);
    //marcar todas las fichas de tablero como placed
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
