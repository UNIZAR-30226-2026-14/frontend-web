import { useEffect, useState } from "react";
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
import alex from "../../assets/avatars/Dani.png";

import PlayerRack from "./PlayerRack/PlayerRack.jsx";
import BoardGrid from "./BoardGrid/BoardGrid.jsx";
import GameControls from "./GameControls/GameControls.jsx";
import Deck from "./Deck/Deck.jsx";

import { parsearFichas, enviarConjuntos } from "../../services/gameUtils.js";
import { gameService } from "../../services/gameService.js";

function Board({
  idPartida,
  objetos,
  user,
  userPic,
  user2,
  user2Pic,
  user3,
  user3Pic,
  user4,
  user4Pic,
  currentBackground,
  onWin,
  isArcade,
}) {
  // Obtenemos el estado del juego y las funciones para manipularlo
  const { bag, playerHand, gameBoard, setGameBoard, setPlayerHand } = useGame();
  const [activeId, setActiveId] = useState(null); // Para rastrear qué ficha se arrastra
  const [joinedSlots, setJoinedSlots] = useState([]);
  const [miTurno, setMiTurno] = useState(false); // pa turnos
  const [processing, setProcessing] = useState(false); // Para que se pueda o no usar el botón de robar y tal
  const [ordenTurno, setOrdenTurno] = useState(null);

  const [matchPoints, setMatchPoints] = useState(0);
  const [activeEvent, setActiveEvent] = useState(null);
  const [deckSize, setDeckSize] = useState(0);

  const [slotsNecesarios, setSlotsNecesarios] = useState(20);
  const [slotsTablero, setSlotsTablero] = useState(70);

  const [currentSort, setCurrentSort] = useState(null);

  //para guardar el estado de tablero y mano na mas empezar turno por si cancelas
  const [startTurnHand, setStartTurnHand] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [points, setPoints] = useState(0);

  // Función para conseguir puntos para comprar power-ups
  const sumarPuntosPorJugada = (fichasColocadas) => {
    const puntosGanados = fichasColocadas.length * 10;
    setMatchPoints((prev) => prev + puntosGanados);
  };

  const ejecutarPowerup = (powerup) => {
    switch (powerup.id) {
      case "toque de midas":
        setHandPositions((prev) => {
          const next = { ...prev };
          const slotsConFichas = Object.keys(next).filter(
            (key) => next[key] !== "",
          );
          const seleccionadas = slotsConFichas
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          seleccionadas.forEach((slot) => {
            next[slot] = { ...next[slot], habilidad: "dorada" };
          });

          return next;
        });
        break;

      case 1:

      default:
        break;
    }

    // Quitar del inventario una vez usado
    setInventory((prev) => prev.filter((item) => item.id !== powerup.id));
  };

  const mostrarEvento = (evento) => {
    setActiveEvent(evento);
    setTimeout(() => setActiveEvent(null), 5000);
  };

  useEffect(() => {
    if (miTurno && !processing) {
      // Verificar si hay un evento de inicio de turno
      switch (activeEvent?.id) {
        case "AUTO_DRAW":
          drawTile();
          break;

        case "NO_SPECIFIC_COLOR":
          // Cosas
          break;

        case "50%_DISCOUNT":
          // Cosas
          break;

        case "HALF_PLAYTIME":
          // Cosas
          break;

        case "DOUBLE_PLAYTIME":
          // Cosas
          break;

        default:
          break;
      }
    }
  }, [miTurno]); // Se dispara cada vez que te toca

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

  // PA QUE AL RESETEAR EL BOARD SE VACIE, ESTO ES TEMPORAL
  const [startTurnBoard, setStartTurnBoard] = useState(() => {
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
  // ESTO LUEGO TENDRÍA QUE IR EN OTRO LAO PERO COMO FALTA POR IMPLEMENTAR EL ACTUALIZAR BOARD
  //setStartTurnBoard(boardPositions);

  const actualizarManoVisual = (fichas) => {
    if (!fichas) return;

    let fichasParaPintar = [...fichas];

    if (currentSort === "num") {
      fichasParaPintar.sort(sortNum);
    } else if (currentSort === "color") {
      fichasParaPintar.sort(sortColor);
    }

    setHandPositions((prev) => {
      const n = fichas.length;

      if (n <= 20) {
        setSlotsNecesarios(20);
      } else {
        setSlotsNecesarios(n);
      }

      const newPositions = { ...prev };
      for (let i = 0; i < slotsNecesarios; i++) {
        newPositions[`hand-slot-${i}`] = fichasParaPintar[i] || "";
      }
      return newPositions;
    });
  };

  const añadirFichaALaMano = (nuevaFicha) => {
    if (!nuevaFicha) return;

    setHandPositions((prev) => {
      const next = { ...prev };

      // Buscamos el primer slot vacío
      const slots = Object.keys(next);
      const primerHuecoLibre = slots.find((key) => next[key] === "");

      if (primerHuecoLibre) {
        next[primerHuecoLibre] = nuevaFicha;
      } else {
        // Si no hay hueco, creamos un nuevo slot
        const nuevoIndice = slots.length;
        setSlotsNecesarios(nuevoIndice + 1); // Expandimos el rack
        next[`hand-slot-${nuevoIndice}`] = nuevaFicha;
      }

      return next;
    });
  };

  const actualizarTableroVisual = (tableroString) => {
    const n = tableroString.length;
    if (n <= 70) {
      //ya cambiamos el numero luego si eso
      setSlotsTablero(70);
    } else {
      setSlotsTablero(n);
    }
    const fichas = parsearFichas(tableroString);
    const newBoard = {};
    // Inicializamos vacío
    for (let i = 0; i < 70; i++) newBoard[`board-slot-${i}`] = "";
    // Rellenamos (asumiendo que el string guarda posiciones, si no, los pone en orden)
    fichas.forEach((ficha, index) => {
      newBoard[`board-slot-${index}`] = { ...ficha, placed: true };
    });
    setBoardPositions(newBoard);
    setStartTurnBoard(boardPositions);
  };

  // Detectamos si es nuestro turno
  useEffect(() => {
    if (!idPartida || !user.id) return;

    const sincronizar = async () => {
      try {
        // Obtener datos de la partida y de tu participación
        const [resP, resU] = await Promise.all([
          fetch(`http://localhost:8080/api/partidas/${idPartida}`),
          fetch(
            `http://localhost:8080/api/participaciones/${user.id}/${idPartida}`,
          ),
        ]);

        if (!resP.ok || !resU.ok) return;

        const partida = await resP.json();
        const participacion = await resU.json();

        if (partida.bolsa) {
          const numeroFichas = partida.bolsa
            .split(",")
            .filter((f) => f !== "").length;
          setDeckSize(numeroFichas);
        } else {
          setDeckSize(0);
        }

        const turnoDeLaPartida = Number(partida.turno);
        const miOrdenAsignado = Number(participacion.ordenTurno);

        // Actualizar el orden si no lo teníamos
        if (ordenTurno === null) {
          setOrdenTurno(miOrdenAsignado);
          actualizarManoVisual(parsearFichas(participacion.manoActual));
        }
        setStartTurnHand(handPositions);

        // Lógica de cambio de turno
        const esMiTurno = turnoDeLaPartida === miOrdenAsignado;

        if (esMiTurno !== miTurno) {
          setMiTurno(esMiTurno);
          setStartTurnHand(handPositions);

          // Si acabamos de recibir el turno, actualizamos el tablero
          //if (esMiTurno && partida.tableroActual) {
          //  actualizarTableroVisual(partida.tableroActual);
          //}
        }
      } catch (error) {
        console.error("Error en sincronización:", error);
      }
    };

    sincronizar();
    const interval = setInterval(sincronizar, 3000);
    return () => clearInterval(interval);
  }, [idPartida, user.id, ordenTurno, miTurno]);

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
    setCurrentSort("num");
    const sorted = [
      ...Object.values(handPositions).filter((t) => t !== ""),
    ].sort(sortNum);

    const newPositions = {};
    for (let i = 0; i < slotsNecesarios; i++) {
      newPositions[`hand-slot-${i}`] = sorted[i] || "";
    }
    setHandPositions(newPositions);
  };

  const sortByColor = () => {
    setCurrentSort("color");
    const sorted = [
      ...Object.values(handPositions).filter((t) => t !== ""),
    ].sort(sortColor);

    const newPositions = {};
    for (let i = 0; i < slotsNecesarios; i++) {
      newPositions[`hand-slot-${i}`] = sorted[i] || "";
    }
    setHandPositions(newPositions);
  };

  const undoMove = () => {
    setHandPositions(startTurnHand);
    setBoardPositions(startTurnBoard);
  };

  const drawTile = async () => {
    if (!miTurno || processing) return;
    //setStartTurnHand(handPositions);

    try {
      setProcessing(true);
      const data = await gameService.drawTile(user.id, idPartida);

      const fichaNueva = parsearFichas(data.fichaRobada);

      console.log("fichaNueva: ", fichaNueva)

      if (fichaNueva) {
        añadirFichaALaMano(fichaNueva[0]);
      }

      setMiTurno(false);

      //const fichasNuevas = parsearFichas(data.manoActual);
      //actualizarManoVisual(fichasNuevas);

      //setHandPositions(newPositions);
      //setPlayerHand(Object.values(newPositions));

      //const orden = participacion.ordenTurno;
      //orden === 0 ? setMiTurno(true) : setMiTurno(false);
      //setMiTurno(false);

      //llamar a fichasActuales para el numero
    } catch (error) {
      console.error("Error al robar:", error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    console.log("--- CAMBIO EN MANO DETECTADO ---");
    console.log(
      "Fichas actuales en mano:",
      Object.values(handPositions).filter((f) => f !== "").length,
    );
    console.log("Contenido de handPositions:", handPositions);
  }, [handPositions]);

  const cambiarTurno = async () => {
    // esto temporal pa ponerle algo
    setMiTurno(false);
    setProcessing(true);
    await gameService.passTurn(user.id, idPartida);

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
  };

  const drawTileButton = () => {
    drawTile(); //cambiarTurno();
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="game-container">
        {/* HEADER: Información del mazo y botón de robar */}
        <div className="header">RUMMIPLUS TABLE</div>

        <BoardGrid boardPositions={boardPositions} joinedSlots={joinedSlots} />

        <Deck
          deckSize={deckSize}
          onDraw={drawTileButton}
          processing={processing}
          miTurno={miTurno}
        />
        <div className="UNDO">
          <button onClick={undoMove} title="Deshacer movimientos del turno">
            🗘
          </button>
        </div>

        <div className="FINISH">
          <button
            className="finish-button"
            disabled={processing || !miTurno}
            onClick={cambiarTurno}
            title="Finalizar turno"
          >
            {processing ? "..." : "FIN"}
          </button>
        </div>

        <div className="puntos">
          <div>Puntos: {points}</div>
        </div>

        <GameControls
          onSortColor={sortByColor}
          onSortNum={sortByNumber}
          processing={processing}
          miTurno={miTurno}
        />

        <div className="Users">
          <div>
            <img src={user4?.urlimagenPerfil || alex} />
            <div>{user4?.nombre || "otro"}</div>
          </div>
          <div>
            <img src={user3?.urlimagenPerfil || alex} />
            <div>{user3?.nombre || "otro"}</div>
          </div>
          <div>
            <img src={user2?.urlimagenPerfil || alex} />
            <div>{user2?.nombre || "otro"}</div>
          </div>
          <div className="ME">
            <img src={userPic || alex} />
            <div>{user.nombre}</div>
          </div>
        </div>

        {/* SOPORTE DEL JUGADOR */}
        <PlayerRack
          handPositions={handPositions}
          slotsNecesarios={slotsNecesarios}
        />
      </div>

      {/* ESTO ES LO QUE PERMITE EL ARRASTRE LIBRE */}
      <DragOverlay zIndex={1000}>
        {activeId ? (
          <Tile
            number={activeTile.number}
            color={activeTile.color}
            placed={activeTile.placed}
            habilidad={activeTile.habilidad}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;
