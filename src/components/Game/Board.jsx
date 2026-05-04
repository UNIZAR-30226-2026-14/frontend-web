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

import {
  parsearFichas,
  obtenerConjuntosDelTablero,
} from "../../services/gameUtils.js";
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
  const [heJugado, setHeJugado] = useState(false); // pa indicar que has puesto algo en tablero
  const [processing, setProcessing] = useState(false); // Para que se pueda o no usar el botón de robar y tal
  const [ordenTurno, setOrdenTurno] = useState(null);

  const [matchPoints, setMatchPoints] = useState(0);
  const [activeEvent, setActiveEvent] = useState(null);
  const [deckSize, setDeckSize] = useState(0);

  const [slotsNecesarios, setSlotsNecesarios] = useState(20);
  const [slotsTablero, setSlotsTablero] = useState(200);

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
    //esto mejor será ponerlo aparte
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
    // Inicializamos 200 huecos vacíos
    const initial = {};
    for (let i = 0; i < 200; i++) initial[`board-slot-${i}`] = "";
    return initial;
  });

  // PA QUE AL RESETEAR EL BOARD SE VACIE
  const [startTurnBoard, setStartTurnBoard] = useState(() => {
    // Inicializamos 200 huecos vacíos
    const initial = {};
    for (let i = 0; i < 200; i++) initial[`board-slot-${i}`] = "";
    return initial;
  });

  useEffect(() => {
    const newJoined = [];

    // Recorremos el tablero por filas (8 filas de 25)
    for (let row = 0; row < 8; row++) {
      let currentRowIndices = [];
      let currentRowTiles = [];

      for (let col = 0; col < 25; col++) {
        const index = row * 25 + col;
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

  /*const actualizarTableroVisual = (tableroApi) => {
    const n = tableroString.length;
    if (n <= 200) {
      //ya cambiamos el numero luego si eso
      setSlotsTablero(200);
    } else {
      setSlotsTablero(n);
    }
    if (!tableroApi) return;

    // Inicializamos vacío
    const newBoard = {};
    for (let i = 0; i < 200; i++) newBoard[`board-slot-${i}`] = "";

    // Rellenamos (asumiendo que el string guarda posiciones, si no, los pone en orden)
    let slotIndex = 0;

    tableroApi.forEach((conjunto) => {
      const fichasParseadas = parsearFichas(conjunto, true);

      fichasParseadas.forEach((ficha) => {
        newBoard[`board-slot-${slotIndex}`] = ficha;
        slotIndex++;
      });
      slotIndex++;
    });
    setBoardPositions(newBoard);
    setStartTurnBoard(newBoard);
  };*/

  const actualizarTableroVisual = (tableroApi) => {
    console.log("Inicio actualizar tablero");
    if (!tableroApi) return;
    console.log("Tablero api no es null");

    const newBoard = {};
    for (let i = 0; i < 200; i++) newBoard[`board-slot-${i}`] = "";
    
    setBoardPositions((prev) => {
      //const newPositions = { ...prev };
      let slotIndex = 0;
      const conjuntos = tableroApi.split(';');
      conjuntos.forEach((conjunto) => {
        const fichas = parsearFichas(conjunto, true);
        fichas.forEach((ficha) => {
          if (slotIndex < 200) {
            //console.log("ficha: ", ficha);
            newBoard[`board-slot-${slotIndex}`] = ficha;
            slotIndex++;
          }
        });
         newBoard[`board-slot-${slotIndex}`] = "";
        slotIndex++;
        if (slotIndex % 25 === 0) {
              slotIndex++;
        }
      });

       // setGameBoard(Object.values(newBoard));

        return newBoard;
    });

    setStartTurnBoard(newBoard);

    //setGameBoard(newBoard);
    console.log("Tablero original: ", startTurnBoard);

    console.log("Tablero actualizado: ", newBoard);
    //setBoardPositions(newBoard);
  };

  // Detectamos si es nuestro turno
  /*useEffect(() => {
    if (!idPartida || !user.id || processing) return;

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

        const esMiTurnoAhora = Number(partida.turno) === miOrdenAsignado;

        if (!esMiTurnoAhora || (esMiTurnoAhora && !miTurno)) {
          // Si el backend lo manda como String, lo parseamos; si es Array, directo.
          const mesaData =
            typeof partida.conjuntoMesa === "string"
              ? JSON.parse(partida.conjuntoMesa)
              : partida.conjuntoMesa;

          if (mesaData) {
            actualizarTableroVisual(mesaData);
          }
        }
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
        //actualizarTableroVisual(partida.tableroActual);

        if (esMiTurno !== miTurno) {
          setMiTurno(esMiTurno);
          setStartTurnHand(handPositions);
        }
      } catch (error) {
        console.error("Error en sincronización:", error);
      }
    };

    sincronizar();
    const interval = setInterval(sincronizar, 3000);
    return () => clearInterval(interval);
  }, [idPartida, user.id, ordenTurno, miTurno, processing]);*/

  useEffect(() => {
    if (!idPartida || !user.id || processing) return;

    const sincronizar = async () => {
      try {
        const resP = await fetch(
          `http://localhost:8080/api/partidas/${idPartida}`,
        );
        if (!resP.ok) return;
        const partida = await resP.json();

        const turnoDeLaPartida = Number(partida.turno);
        const esMiTurnoAhora = turnoDeLaPartida === ordenTurno;

        // Actualizar bolsa
        if (partida.bolsa) {
          setDeckSize(partida.bolsa.split(",").filter((f) => f !== "").length);
        }

        // Si acaba de empezar mi turno, sincronizamos frontend y backend
        if (esMiTurnoAhora && !miTurno) {
          const resU = await fetch(
            `http://localhost:8080/api/participaciones/${user.id}/${idPartida}`,
          );
          if (resU.ok) {
            const participacion = await resU.json();
            //console.log("conjunto mesa:", partida.conjuntoMesa)
            
            /*const mesaData =
              typeof partida.conjuntoMesa === "string"
                ? JSON.parse(partida.conjuntoMesa)
                : partida.conjuntoMesa;*/
            const mesaData = partida.conjuntoMesa;

            //console.log("mesaData: ", mesaData);    

            actualizarTableroVisual(mesaData);
            //actualizarManoVisual(parsearFichas(participacion.manoActual));

            // Guardar backup para el botón "Deshacer"
            
            setStartTurnHand(handPositions);
            setMiTurno(true);
          }
        } else if (!esMiTurnoAhora) {
          // Si no es mi turno, solo actualizamos tablero
          const mesaData = partida.conjuntoMesa;
          actualizarTableroVisual(mesaData);
          if (miTurno) setMiTurno(false);
        }
      } catch (error) {
        console.error("Error en sincronización:", error);
      }
    };

    // Carga inicial del orden de turno
    if (ordenTurno === null) {
      fetch(`http://localhost:8080/api/participaciones/${user.id}/${idPartida}`)
        .then((res) => res.json())
        .then((data) => {
          setOrdenTurno(Number(data.ordenTurno));
          actualizarManoVisual(parsearFichas(data.manoActual));
        });
    }

    const interval = setInterval(sincronizar, 3000);
    return () => clearInterval(interval);
  }, [idPartida, user.id, ordenTurno, miTurno, processing]);

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
      heJugado,
      setHeJugado,
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

  /*const drawTile = async () => {
    try {
      setBoardPositions(startTurnBoard);
      setHandPositions(startTurnHand);
      setProcessing(true);
      const data = await gameService.drawTile(user.id, idPartida);
      const fichaNueva = parsearFichas(data.fichaRobada);

      if (fichaNueva) {
        añadirFichaALaMano(fichaNueva[0]);
      }

      setMiTurno(false);
    } catch (error) {
      console.error("Error al robar:", error);
    } finally {
      setProcessing(false);
    }
  };*/

  const drawTile = async () => {
    try {
      setProcessing(true);
      const data = await gameService.drawTile(user.id, idPartida);
      const fichasNuevas = parsearFichas(data.fichaRobada);

      if (fichasNuevas.length > 0) {
        añadirFichaALaMano(fichasNuevas[0]);
        setDeckSize((prev) => prev - 1);
      }
      setMiTurno(false);
    } catch (error) {
      console.error("Error al robar:", error);
    } finally {
      setProcessing(false);
    }
  };

  /*const cambiarTurno = async () => {
    try {
      setProcessing(true);
      const conjuntos = obtenerConjuntosDelTablero(boardPositions);

      if (conjuntos.length === 0) {
        // Resetear si obligamos al usuario a empezar de cero
        //setBoardPositions(startTurnBoard);
        //setHandPositions(startTurnHand);
        setProcessing(false);
        return;
      }

      await gameService.playAdvanced(
        user.id,
        idPartida,
        "replace_board",
        conjuntos,
      );

      setBoardPositions((prev) => {
        const nextState = {};
        for (const id in prev) {
          const currentTile = prev[id];
          if (currentTile && typeof currentTile === "object") {
            nextState[id] = { ...currentTile, placed: true };
          } else {
            nextState[id] = currentTile;
          }
        }
        return nextState;
      });

      setMiTurno(false);
    } catch (error) {
      console.error("Error al terminar turno:", error);
    } finally {
      setProcessing(false);
    }
  };*/

  const cambiarTurno = async () => {
    try {
      setProcessing(true);
      const conjuntos = obtenerConjuntosDelTablero(boardPositions);

      if (conjuntos.length === 0) {
        undoMove();
        setProcessing(false);
        return;
      }

      await gameService.playAdvanced(
        user.id,
        idPartida,
        "replace_board",
        conjuntos,
      );

     /* setBoardPositions((prev) => {
        const nextState = {};
        for (const id in prev) {
          nextState[id] = prev[id] !== "" ? { ...prev[id], placed: true } : "";
        }
        return nextState;
      });*/

      setMiTurno(false);
      setHeJugado(false);
    } catch (error) {
      console.error("Error al terminar turno:", error);
      // Si falla, podríamos llamar a undoMove() para restaurar el tablero
      // undoMove();
    } finally {
      setProcessing(false);
    }
  };

  const drawTileButton = () => {
    undoMove();
    drawTile();
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="game-container" style={{backgroundcolor: currentBackground}}>
        {/* HEADER: Información del mazo y botón de robar */}
        <div className="header">RUMMIPLUS TABLE</div>

        <BoardGrid boardPositions={boardPositions} joinedSlots={joinedSlots} />

        <Deck
          deckSize={deckSize}
          onDraw={drawTileButton}
          processing={processing || !miTurno}
          miTurno={miTurno}
        />
        <div className="UNDO">
          <button
            onClick={undoMove}
            disabled={processing || !miTurno}
            title="Deshacer movimientos del turno"
          >
            🗘
          </button>
        </div>

        <div className="FINISH">
          <button
            className="finish-button"
            disabled={processing || !miTurno || !heJugado}
            onClick={cambiarTurno}
            title="Finalizar turno"
          >
            {processing || !miTurno ? "..." : "FIN"}
          </button>
        </div>

        <div className="puntos">
          <div>Puntos: {points}</div>
        </div>

        <GameControls onSortColor={sortByColor} onSortNum={sortByNumber} />

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
