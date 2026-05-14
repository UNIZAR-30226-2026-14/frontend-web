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
import { LogOut, Pause } from "lucide-react";

import PlayerRack from "./PlayerRack/PlayerRack.jsx";
import BoardGrid from "./BoardGrid/BoardGrid.jsx";
import GameControls from "./GameControls/GameControls.jsx";
import Deck from "./Deck/Deck.jsx";
import PowerUpSlots from "../Arcade/PowerUpSlots/PowerUpSlots.jsx";
import PowerUpsShop from "../Arcade/PowerUpsShop/PowerUpsShop.jsx";

import {
  parsearFichas,
  obtenerConjuntosDelTablero,
  validarInicial,
} from "../../services/gameUtils.js";
import { gameService } from "../../services/gameService.js";

function Board({
  idPartida,
  objetos,
  user,
  userPic,
  currentBackground,
  currentSkin,
  onWin,
  isArcade,
  onLeave,
  isHost,
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
  const [primeraJugada, setPrimeraJugada] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [deckSize, setDeckSize] = useState(0);

  const [isShopOpen, setIsShopOpen] = useState(false);

  // Datos de los oponentes (participaciones del juego, cargadas al inicio)
  const [opponents, setOpponents] = useState([]);

  const [slotsNecesarios, setSlotsNecesarios] = useState(20);
  const [slotsTablero, setSlotsTablero] = useState(200);

  const [currentSort, setCurrentSort] = useState(null);
  const [ilegalColor, setIlegalColor] = useState(null);

  //para guardar el estado de tablero y mano na mas empezar turno por si cancelas
  const [startTurnHand, setStartTurnHand] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [myTime, setMyTime] = useState(30);
  



  //Pal evento del 50%
  const [discount, setDiscount] = useState(false); 
  const [angel, setAngel] = useState(false); 

  // Dentro de la función Board
  const [activeEffects, setActiveEffects] = useState({
    isBlind: false, // Bomba de humo
    halfTime: false, // Guindilla
    mustScore30: false, // Techo de cristal
    isProtected: false, // Ángel de la guarda
  });


  // Función para conseguir puntos para comprar power-ups
  const sumarPuntosPorJugada = () => {
    let puntosGanados = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 25; col++) {
          const index = row * 25 + col;
          const tile = boardPositions[`board-slot-${index}`];
          console.log(tile);
          if (tile !== "" && tile.placed === false) {
            if (tile.habilidad === "dorada") {
              puntosGanados = puntosGanados + 2;
            }
            else {
              puntosGanados++;
            }
          } 
        }
      }

    setMatchPoints((prev) => prev + puntosGanados);
  };

    const recibirPowerup = (powerup) => {
    //esto mejor será ponerlo aparte
    switch (powerup.id) {

      case "GUARDIAN_ANGEL":
        setAngel(true);

      case "PLUS_FOUR":
        if (angel) {
          setAngel(false); //Indicar que lo hemos usao
        } else drawFour();

      case "SMOKE_BOMB":
        if (angel) {
          setAngel(false); //Indicar que lo hemos usao
        } else {
          setActiveEffects((prev) => ({
          ...prev,
          isBlind: true,
        }));
        }

      /*case "midasTouch":
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
        break;*/

      case 1:

      default:
        break;
    }

    // Quitar del inventario una vez usado
    setInventory((prev) => prev.filter((item) => item.id !== powerup.id));
  };

  const ejecutarPowerup = (powerup) => {
    //esto mejor será ponerlo aparte
    switch (powerup.id) {


      case "midasTouch":
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

  // EVENTOS RANDOM
  useEffect(() => {
      // Verificar si hay un evento de inicio de turno
      console.log("EVENTO AHORA ES: ", activeEvent);
      switch (activeEvent) {
         
        case "+pieza":
          setDiscount(false);
          setIlegalColor(null);
          drawTile_NOPASS();
          break;

        case "prohibido_rojo":
          setDiscount(false); 
          setIlegalColor("red");
          break;

        case "prohibido_azul":
          setDiscount(false); 
          setIlegalColor("blue");
          break;

        case "prohibido_naranja":
          setDiscount(false); 
          setIlegalColor("orange");
          break;

        case "prohibido_negro":
          setDiscount(false);
          setIlegalColor("black");
          break;

        case "50porcien":
          setDiscount(true); // Cosas
          setIlegalColor(null);
          break;
        default:
          setDiscount(false);
          setIlegalColor(null);
          break;
      }
    
  }, [activeEvent]); // Se dispara cada vez que te toca




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

  const [isPaused, setIsPaused] = useState(false);

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
      setStartTurnHand(next);

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

        setIsPaused(partida.estado === "PAUSED");

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

        if (isArcade) {
          
          //const mercado = await gameService.getMercado(idPartida);
         // console.log("Monedas: ", mercado.monedasJugador);
         // console.log("Objetos en venta: ", mercado.objetosMercado);
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
          if (isArcade) {
            setActiveEvent(partida.eventoActual);
          }
          const resU = await gameService.getParticipation(user.id, idPartida);
          setMyTime(30);
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

            setActiveEffects((prev) => ({
          ...prev,
          isBlind: false,
        }));

            drawTile_NOPASS();

            setMyTime(30);

            gameService.passTurn(user.id, idPartida);
  }


  useEffect(() => {
    let timer;
    if (miTurno && myTime > 0 && !processing && !isPaused) {
      timer = setInterval(() => {
        setMyTime((prev) => prev - 1);
      }, 1000);
    } else if (myTime === 0 && miTurno) {
      finalizarTurnoPorTimeout();
    }

    return () => clearInterval(timer);
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

  const drawFour = async () => {
    try {
      setProcessing(true);
      const data = await gameService.drawTile_NOPASS(user.id, idPartida, 4);
      const fichasNuevas = parsearFichas(data.fichaRobada);
      if (fichasNuevas.length > 0) {
      for (let i = 0; i < fichasNuevas.length; i++) {
        añadirFichaALaMano(fichasNuevas[i]);
        
      }
        setDeckSize((prev) => prev - 4);
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
      setActiveEffects((prev) => ({
          ...prev,
          isBlind: false,
        }));
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
      const conjuntos = obtenerConjuntosDelTablero(boardPositions, ilegalColor);

      if (conjuntos.length === 0 || (primeraJugada && !validarInicial(boardPositions))) {
        undoMove();
        setProcessing(false);
        return;
      }
      sumarPuntosPorJugada();
      if (primeraJugada) {
        setPrimeraJugada(false);
      }

      await gameService.playAdvanced(
        user.id,
        idPartida,
        "replace_board",
        conjuntos,
      );
      setActiveEffects((prev) => ({
          ...prev,
          isBlind: false,
        }));
      
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

  const shop = () => {
    console.log("Click");
    setIsShopOpen(true);
  };

  const drawTileButton = () => {
    undoMove();
    drawTile();
  };

  useEffect(() => {
    const handleDebugHumo = (e) => {
      // Si pulsas la tecla 'b' (de Bomba de humo)
      if (e.key.toLowerCase() === "b") {
        setActiveEffects((prev) => ({
          ...prev,
          isBlind: !prev.isBlind,
        }));

        console.log("Estado Bomba de Humo:", !activeEffects.isBlind);
      }
    };

    window.addEventListener("keydown", handleDebugHumo);

    return () => window.removeEventListener("keydown", handleDebugHumo);
  }, [activeEffects.isBlind]);

  const abandonarPartida = async () => {
    const confirmar = window.confirm("¿Estás seguro de que quieres abandonar?");
    if (!confirmar) return;

    try {
      setProcessing(true);
      await gameService.leaveGame(idPartida, user.id);
      onLeave(); 
    } catch (error) {
      console.error("Error al abandonar:", error);
      onLeave();
    } finally {
      setProcessing(false);
    }
  };

  const handlePause = async () => {
    try {
      setProcessing(true);
      const ok = await gameService.pauseGame(idPartida);
      if (ok && isHost) {
        onLeave();
      }
    } catch (error) {
      console.error("Error al pausar:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div
        className={`game-container ${activeEffects.isBlind ? "smoke-screen" : ""}`}
        style={{ backgroundColor: currentBackground }}
      >
        <div className="header">RUMMIPLUS TABLE</div>

        <div className="EXIT-CONTROL" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
          {isHost && (
            <button 
              className="pause-button" 
              onClick={handlePause}
              disabled={processing}
            >
              <Pause size={25} />
            </button>
          )}

          <button
              className="logout-button"
              onClick={abandonarPartida}
              title="Cerrar sesión"
            >
              <LogOut size={25} color="#ff4444" />
            </button>
        </div>

        {isPaused && (
          <div className="pause-overlay">
            <div className="pause-modal">
              <h2>LA PARTIDA SE HA PAUSADO</h2>              
              <button 
                onClick={onLeave} 
                className="leave-button"
                style={{ marginTop: '20px' }}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        <div className={activeEffects.isBlind ? "blur-grid" : ""}>
          <BoardGrid
            boardPositions={boardPositions}
            joinedSlots={joinedSlots}
            currentSkin={currentSkin}
            blured={activeEffects.isBlind}
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

        { isArcade && (<PowerUpSlots inventory={inventory} onActivate={ejecutarPowerup} shop={shop} disabled={processing || !miTurno}/>)} 
        {isShopOpen && (
            <PowerUpsShop 
              matchPoints={matchPoints}
              setMatchPoints={setMatchPoints}
              inventory={inventory}
              setInventory={setInventory}
              onClose={() => setIsShopOpen(false)} 
            />
          )}

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
          <div>🪙 {matchPoints}</div>
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
          currentSkin={currentSkin}
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
            skinColor={currentSkin}
            blured={activeEffects.isBlind}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;
