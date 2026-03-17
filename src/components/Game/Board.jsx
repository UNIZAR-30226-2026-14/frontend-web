import { useEffect, useState } from 'react';
import Tile from './Tile.jsx';
import Hand from './Hand.jsx';
import { useGame } from '../../hooks/useGame.js';
import './Board.css';
import { useDraggable, DndContext, DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

//-------------------ESTO LUEGO IRÁ APARTE
function DraggableTile({ tile }) { // Versión de ficha ya draggeable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: tile.id, // El ID único que ya tienes
  });

  // Estilo para que el componente se desplace visualmente
  const style = {
    transform: CSS.Translate.toString(transform), transition, touchAction: 'none',
    opacity: isDragging ? 0 : 1, // La ficha original se vuelve traslúcida
    cursor: 'grab',
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <Tile key={tile.id} number={tile.number} color={tile.color} />
    </div>
  );
}
//-----------------------------------------------------

function Board() {
  // Obtenemos el estado del juego y las funciones para manipularlo
  const { bag, playerHand, setPlayerHand, gameBoard, setGameBoard, drawTile, dealInitialHand } = useGame();
  const [activeId, setActiveId] = useState(null); // Para rastrear qué ficha se arrastra

  const [handPositions, setHandPositions] = useState(() => {
    // Inicializamos 20 huecos vacíos
    const initial = {};
    for (let i = 0; i < 20; i++) initial[`hand-slot-${i}`] = null;
    return initial;
  });

  const [boardPositions, setBoardPositions] = useState(() => {
    // Inicializamos 40 huecos vacíos
    const initial = {};
    for (let i = 0; i < 40; i++) initial[`board-slot-${i}`] = null;
    return initial;
  });

  // Cuando recibas las 14 fichas iniciales, llénalas en los primeros huecos:
  useEffect(() => {
    if (playerHand.length > 0) {
      const newPositions = { ...handPositions };
      playerHand.forEach((tile, index) => {
        newPositions[`hand-slot-${index}`] = tile;
      });
      setHandPositions(newPositions);
    }
  }, [playerHand]);

  // Repartimos las 14 fichas iniciales
  useEffect(() => {
    dealInitialHand();
  }, []);


  function handleDragStart(event) {
    setActiveId(event.active.id); // Guardamos el ID al empezar
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log("Ficha movida:", active.id);
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // El ID del hueco: "hand-slot-X"

    const fromHandKey = Object.keys(handPositions).find(k => handPositions[k]?.id === activeId);
    const fromBoardKey = Object.keys(boardPositions).find(k => boardPositions[k]?.id === activeId);

    const tile = fromHandKey ? handPositions[fromHandKey] : boardPositions[fromBoardKey];
    if (!tile) return;

    // si se suleta en tablero
    if (overId.startsWith('board-slot')) {

      //setBoardPositions(prev => ({ ...prev, [overId]: tile }));
      //if (handKey) setHandPositions(prev => ({ ...prev, [handKey]: null })); // La quitamos de la mano
      if (fromHandKey) {
        if (boardPositions[overId] !== null) {
          return;
        }
        const tileMoving = handPositions[fromHandKey];
        setHandPositions((prev) => {
          // IMPORTANTE: Clonamos el objeto anterior para no mutar el estado directamente
          const newPositions = { ...prev };
          // 2. Buscamos en qué hueco estaba la ficha que estamos moviendo
          newPositions[fromHandKey] = '';
          // 4. Actualizamos el playerHand del hook useGame (opcional)
          // Extraemos solo las fichas que no son null para mantener la lista plana sincronizada
          const updatedTilesArray = Object.values(newPositions).filter(tile => tile !== null);
          setPlayerHand(updatedTilesArray);
          return newPositions;
        })

        setBoardPositions((prev) => {
          // IMPORTANTE: Clonamos el objeto anterior para no mutar el estado directamente
          const newPositions = { ...prev };
          // aqui es el huevo
          const oldSlot = Object.keys(prev).find(key => prev[key]?.id === overId);
          // 3. Intercambio de fichas (Swap logic)
          newPositions[overId] = tileMoving;
          // 4. Actualizamos el playerHand del hook useGame (opcional)
          // Extraemos solo las fichas que no son null para mantener la lista plana sincronizada
          const updatedTilesArray = Object.values(newPositions).filter(tile => tile !== null);
          setGameBoard(updatedTilesArray);
          return newPositions;
        })

      };

      // La movemos dentro del tablero
      if (fromBoardKey && fromBoardKey !== overId) {
        setBoardPositions((prev) => {
          // IMPORTANTE: Clonamos el objeto anterior para no mutar el estado directamente
          const newPositions = { ...prev };
          // 2. Buscamos en qué hueco estaba la ficha que estamos moviendo
          const oldSlot = Object.keys(prev).find(key => prev[key]?.id === activeId);
          // Si no se encuentra el origen (por ejemplo, viene de fuera), o es el mismo sitio, no hacemos nada
          if (!oldSlot || oldSlot === overId) return prev;
          // 3. Intercambio de fichas (Swap logic)
          const tileMoving = prev[oldSlot];   // La ficha que arrastras
          const tileAtTarget = prev[overId];  // Lo que haya en el destino (ficha o null)
          newPositions[oldSlot] = tileAtTarget;
          newPositions[overId] = tileMoving;
          // 4. Actualizamos el playerHand del hook useGame (opcional)
          // Extraemos solo las fichas que no son null para mantener la lista plana sincronizada
          const updatedTilesArray = Object.values(newPositions).filter(tile => tile !== null);
          setGameBoard(updatedTilesArray);
          return newPositions;
        })

      };
    }


    // si se suelta en mano
    else if (overId.startsWith('hand-slot')) {

      //si pillas ficha del tablero a la mano, no pasa anada
      if (fromBoardKey) return;

      //si es una que mueves dentro de la mano, todo bien
      if (fromHandKey && fromHandKey !== overId) {
        setHandPositions((prev) => {
          // IMPORTANTE: Clonamos el objeto anterior para no mutar el estado directamente
          const newPositions = { ...prev };
          // 2. Buscamos en qué hueco estaba la ficha que estamos moviendo
          const oldSlot = Object.keys(prev).find(key => prev[key]?.id === activeId);
          // Si no se encuentra el origen (por ejemplo, viene de fuera), o es el mismo sitio, no hacemos nada
          if (!oldSlot || oldSlot === overId) return prev;
          // 3. Intercambio de fichas (Swap logic)
          const tileMoving = prev[oldSlot];   // La ficha que arrastras
          const tileAtTarget = prev[overId];  // Lo que haya en el destino (ficha o null)
          newPositions[oldSlot] = tileAtTarget;
          newPositions[overId] = tileMoving;
          // 4. Actualizamos el playerHand del hook useGame (opcional)
          // Extraemos solo las fichas que no son null para mantener la lista plana sincronizada
          const updatedTilesArray = Object.values(newPositions).filter(tile => tile !== null);
          setPlayerHand(updatedTilesArray);
          return newPositions;
        })
      };
    }
  }

  const activeTile = Object.values(handPositions).find(t => t?.id === activeId) || Object.values(boardPositions).find(t => t?.id === activeId);

  const sortByNumber = () => {
    const sorted = [...playerHand].sort((a, b) => {
      const aIsJoker = a.number === 'J';
      const bIsJoker = b.number === 'J';
      const aIsNull = a === '';
      const bIsNull = b === '';

      if (aIsJoker && bIsNull) return -1;
      if (bIsJoker && aIsNull) return 1;

      // Si ambos son Jokers, se quedan igual entre ellos
      if (aIsJoker && bIsJoker) return 0;

      // Si 'a' es Joker, lo mandamos al final (positivo)
      if (aIsJoker) return 1;

      // Si 'b' es Joker, lo mandamos al final (negativo para que 'a' vaya antes)
      if (bIsJoker) return -1;
      if (aIsNull && bIsNull) return 0;
      if (aIsNull) return 1;
      if (bIsNull) return -1;



      // Si ninguno es Joker, resta normal
      return a.number - b.number;
    });
    setPlayerHand(sorted);
  };

  const sortByColor = () => {
    const sorted = [...playerHand].sort((a, b) => {
      const aIsJoker = a.number === 'J';
      const bIsJoker = b.number === 'J';

      const aIsNull = a === '';
      const bIsNull = b === '';

      if (aIsJoker && bIsNull) return -1;
      if (bIsJoker && aIsNull) return 1;

      // Si hay comodines, mandarlos al final
      if (aIsJoker && bIsJoker) return 0;
      if (aIsJoker) return 1;
      if (bIsJoker) return -1;

      if (aIsNull && bIsNull) return 0;
      if (aIsNull) return 1;
      if (bIsNull) return -1;



      // Si son del mismo color, ordenamos por número dentro del grupo de color
      if (a.color === b.color) {
        return a.number - b.number;
      }

      // Si son de distinto color, ordenamos alfabéticamente por el nombre del color
      return a.color.localeCompare(b.color);
    });

    setPlayerHand(sorted);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className='game-container'>

        {/* HEADER: Información del mazo y botón de robar */}
        <div className='header'>RUMMIPLUS TABLE</div>

        {/* ÁREA DEL TABLERO */}
        <main className='board-area'>
          {/* El SVG de fondo */}
          <svg width="650" height="350" className='board-svg'>
            <rect width="800" height="800" fill="#073600" />
          </svg>

          {/* FICHAS DINÁMICAS (Las que el jugador tiene en la mano) */}
          <div className='board-grid'>
            {Object.keys(boardPositions).map((slotId) => (
              <Hand key={slotId} id={slotId}>
                {boardPositions[slotId] && (
                  <DraggableTile tile={boardPositions[slotId]} />
                )}
              </Hand>
            ))}</div>
        </main>

        {/* Baraja con las fichas restantes */}
        <div className='deck-container' onClick={drawTile} title='Robar ficha'>
          <div className='deck-stack'>
            <div className='deck-count'>{bag.length}</div>
          </div>
        </div>

        {/* Botones para ordenar las fichas */}
        <div className='order-container'>
          <button onClick={sortByColor} title='Ordenar por palo'>♤♤♤</button>
          <button onClick={sortByNumber} title='Ordenar numéricamente'>789</button>
        </div>

        {/* SOPORTE DEL JUGADOR */}
        <div className='player-rack'>
          {/* El SVG de madera */}
          <svg width="600" height="150" className='rack-svg'>
            <rect x="30" y="20" width="540" height="60" fill="#5d2e0a" stroke="#3e1f07" strokeWidth="2" rx="5" />
            <rect x="30" y="70" width="540" height="60" fill="#8B4513" stroke="#5d2e0a" strokeWidth="2" rx="5" />
          </svg>

          {/* FICHAS DINÁMICAS (Las que el jugador tiene en la mano) */}

          <div className='player-Hand'>
            {Object.keys(handPositions).map((slotId) => (
              <Hand key={slotId} id={slotId}>
                {handPositions[slotId] && (
                  <DraggableTile tile={handPositions[slotId]} />
                )}
              </Hand>
            ))}</div>
        </div>
      </div>

      {/* ESTO ES LO QUE PERMITE EL ARRASTRE LIBRE */}
      <DragOverlay zIndex={1000}>
        {activeId ? (
          <Tile
            number={activeTile.number}
            color={activeTile.color}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;