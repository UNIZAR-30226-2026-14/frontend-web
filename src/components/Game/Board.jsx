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
import {
  getAvatarDisplay,
  getProfileImageRaw,
} from "../../data/itemData.jsx";

import PlayerRack from "./PlayerRack/PlayerRack.jsx";
import BoardGrid from "./BoardGrid/BoardGrid.jsx";
import GameControls from "./GameControls/GameControls.jsx";
import Deck from "./Deck/Deck.jsx";
import PowerUpSlots from "../Arcade/PowerUpSlots/PowerUpSlots.jsx"

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

  // Datos de los oponentes (participaciones del juego, cargadas al inicio)
  const [opponents, setOpponents] = useState([]);

  const [slotsNecesarios, setSlotsNecesarios] = useState(20);
  const [slotsTablero, setSlotsTablero] = useState(200);

  const [currentSort, setCurrentSort] = useState(null);

  //para guardar el estado de tablero y mano na mas empezar turno por si cancelas
  const [startTurnHand, setStartTurnHand] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [points, setPoints] = useState(0);
  const [myTime, setMyTime] = useState(30);



  //Pal evento del 50%
  const [discount, setDiscount] = useState(false); 

  // Dentro de la función Board
  const [activeEffects, setActiveEffects] = useState({
    isBlind: false, // Bomba de humo
    halfTime: false, // Guindilla
    mustScore30: false, // Techo de cristal
    isProtected: false, // Ángel de la guarda
  });

  // Función para conseguir puntos para comprar power-ups
  const sumarPuntosPorJugada = (fichasColocadas) => {
    const puntosGanados = fichasColocadas.length;
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
          setDiscount(false);
          drawTile_NOPASS();
          break;

        case "NO_SPECIFIC_COLOR":
          setDiscount(false); //sómo se indica que no se puede un color concreto?????
          // Cosas
          break;

        case "50%_DISCOUNT":
          setDiscount(true);// Cosas
          break;
        default:
          setDiscount(false);
          break;
      }
    }
  }, [miTurno]); // Se dispara cada vez que te toca

  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // pa pruebas

  const [handPositions, setHandPositions] = useState(() => {
    // Inicializamos 20 huecos vacíos
    const initial = {};
    for (let i = 0; i < 20; i++) initial[`hand-slot-${i}`] = "";
    console.log("Es arcade: ", isArcade);
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
  
  const undoMove = () => {
    setHeJugado(false);
    setHandPositions(startTurnHand);
    setBoardPositions(startTurnBoard);
  };

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
      console.log("Manopla: ",newPositions);
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

  const actualizarTableroVisual = (tableroApi) => {
    console.log("Inicio actualizar tablero");
    if (!tableroApi) return;
    console.log("Tablero api no es null");

    const newBoard = {};
    for (let i = 0; i < 200; i++) newBoard[`board-slot-${i}`] = "";

    setBoardPositions((prev) => {
      let slotIndex = 0;
      const conjuntos = tableroApi.split(";");
      conjuntos.forEach((conjunto) => {
        const fichas = parsearFichas(conjunto, true);
        let aux = (slotIndex % 25) + fichas.length;
        console.log("fichas length: ", fichas.length);
        console.log("CUanto queda:", slotIndex % 25);
        console.log("sobrante: ", aux);
        if (aux >= 25) {
          for (let i = 0; i < fichas.length; i++) {
            newBoard[`board-slot-${slotIndex}`] = "";
            slotIndex++;
          }
        }
        fichas.forEach((ficha) => {
          if (slotIndex < 200) {
            newBoard[`board-slot-${slotIndex}`] = ficha;
            slotIndex++;
          }
        });
        newBoard[`board-slot-${slotIndex}`] = "";
        slotIndex++;
      });
      return newBoard;
    });
    setStartTurnBoard(newBoard);
  };

  useEffect(() => {
    if (!idPartida || !user.id || processing) return;

    const sincronizar = async () => {
      try {
        const partida = await gameService.getGameStatus(idPartida);
        if (!partida) return;

        let miPosicion = ordenTurno;
        if (miPosicion === null) {
          const participacion = await gameService.getParticipation(
            user.id,
            idPartida,
          );
          miPosicion = Number(participacion.ordenTurno);
          setOrdenTurno(miPosicion);
          actualizarManoVisual(parsearFichas(participacion.manoActual));
        }

        const turnoDeLaPartida = Number(partida.turno);
        const esMiTurnoAhora = turnoDeLaPartida === ordenTurno;

        // Actualizar bolsa
        if (partida.bolsa) {
          setDeckSize(
            partida.bolsa.split(",").filter((f) => f.trim() !== "").length,
          );
        }

        // Si acaba de empezar mi turno, sincronizamos frontend y backend
        if (esMiTurnoAhora && !miTurno) {
          const resU = await gameService.getParticipation(user.id, idPartida);
          actualizarTableroVisual(partida.conjuntoMesa);
          setStartTurnHand(handPositions);
          setMiTurno(true);

        } else if (!esMiTurnoAhora) {
          // Si no es mi turno, solo actualizamos tablero
          actualizarTableroVisual(partida.conjuntoMesa);
          setMiTurno(false);
        }
      } catch (error) {
        console.error("Error en sincronización:", error);
      }
    };

    // Carga inicial del orden de turno y oponentes
    if (ordenTurno === null) {
      gameService.getParticipation(user.id, idPartida).then((data) => {
        setOrdenTurno(Number(data.ordenTurno));
        actualizarManoVisual(parsearFichas(data.manoActual));
      });

      gameService.getParticipationByGame(idPartida).then((lista) => {
        const otros = lista.filter((p) => p.idJugador !== user.id);
        setOpponents(otros);
      }).catch(() => {});
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

  const finalizarTurnoPorTimeout = () => {
    setMiTurno(false);

            setProcessing(true);

            undoMove();

            drawTile_NOPASS();

            setMyTime(30);

            gameService.passTurn(user.id, idPartida);
  }


  useEffect(() => {
    let timer;
    if (miTurno && myTime > 0 && !processing) {
      timer = setInterval(() => {
        setMyTime((prev) => prev - 1);
      }, 1000);
    } else if (myTime === 0 && miTurno) {
      // Aquí ejecutas la lógica de "se acabó el tiempo"
      finalizarTurnoPorTimeout();
    }

    return () => clearInterval(timer); // Limpieza vital
  }, [miTurno, myTime, processing]);

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

 

  const drawTile_NOPASS = async () => {
    try {
      setProcessing(true);
      const data = await gameService.drawTile_NOPASS(user.id, idPartida);
      const fichasNuevas = parsearFichas(data.fichaRobada);

      if (fichasNuevas.length > 0) {
        añadirFichaALaMano(fichasNuevas[0]);
        setDeckSize((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error al robar:", error);
    } finally {
      setProcessing(false);
    }
  };

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

  // Dentro de tu componente Board, antes del return
  useEffect(() => {
    const handleDebugHumo = (e) => {
      // Si pulsas la tecla 'b' (de Bomba de humo)
      if (e.key.toLowerCase() === "b") {
        setActiveEffects((prev) => ({
          ...prev,
          isBlind: !prev.isBlind,
        }));

        // Opcional: Mostrar un mensaje en consola para confirmar
        console.log("Estado Bomba de Humo:", !activeEffects.isBlind);
      }
    };

    // Escuchamos el teclado
    window.addEventListener("keydown", handleDebugHumo);

    // Limpiamos el evento al desmontar el componente
    return () => window.removeEventListener("keydown", handleDebugHumo);
  }, [activeEffects.isBlind]); // Dependencia para que use el valor actualizado


  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div
        className={`game-container ${activeEffects.isBlind ? "smoke-screen" : ""}`}
        style={{ backgroundcolor: currentBackground }}
      >
        {/* HEADER: Información del mazo y botón de robar */}
        <div className="header">RUMMIPLUS TABLE</div>

        <div className={activeEffects.isBlind ? "blur-grid" : ""}>
          <BoardGrid
            boardPositions={boardPositions}
            joinedSlots={joinedSlots}
          />
        </div>

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

        {/*<PowerUpSlots inventory={inventory}/> */}

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

        <div className="tiempo">
          <div>⏳ {myTime}</div>
        </div>

        <GameControls onSortColor={sortByColor} onSortNum={sortByNumber} />

        <div className="Users">
          {[2, 1, 0].map((idx) => {
            const op = opponents[idx];
            return (
              <div key={idx}>
                <img
                  alt=""
                  src={getAvatarDisplay(getProfileImageRaw(op))}
                />
                <div>{op?.jugadorNombre || "bot"}</div>
              </div>
            );
          })}
          <div className="ME">
            <img
              alt=""
              src={getAvatarDisplay(userPic ?? getProfileImageRaw(user))}
            />
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
