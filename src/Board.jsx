import { useEffect, useState } from 'react';
import Tile from './Tile.jsx';
import Hand from './Hand.jsx';
import { useGame } from './useGame.js';
import './Board.css';
import { useDraggable, DndContext, DragOverlay } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {arrayMove, useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

//-------------------ESTO LUEGO IRÁ APARTE
  function ShortableTile({ tile }) { // Versión de ficha ya draggeable
    const { attributes, listeners, setNodeRef, transform, transition,isDragging } = useSortable({
      id: tile.id, // El ID único que ya tienes
    });

    // Estilo para que el componente se desplace visualmente
    const style = {
      transform: CSS.Translate.toString(transform), transition, touchAction: 'none',
      opacity: isDragging ? 0 : 1, // La ficha original se vuelve traslúcida
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
  const { bag, playerHand, setPlayerHand, drawTile, dealInitialHand } = useGame();
  const [activeId, setActiveId] = useState(null); // Para rastrear qué ficha se arrastra

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
    if (over && active.id !== over.id) {
      setPlayerHand((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }
  const activeTile = playerHand.find(t => t.id === activeId);

  const sortByNumber = () => {
    const sorted = [...playerHand].sort((a,b) => {
      const aIsJoker = a.number === 'J';
      const bIsJoker = b.number === 'J';

      // Si ambos son Jokers, se quedan igual entre ellos
      if (aIsJoker && bIsJoker) return 0;

      // Si 'a' es Joker, lo mandamos al final (positivo)
      if (aIsJoker) return 1;

      // Si 'b' es Joker, lo mandamos al final (negativo para que 'a' vaya antes)
      if (bIsJoker) return -1;

      // Si ninguno es Joker, resta normal
      return a.number - b.number;
    });
    setPlayerHand(sorted);
  };

  const sortByColor = () => {
    const sorted = [...playerHand].sort((a, b) => {
      const aIsJoker = a.number === 'J';
      const bIsJoker = b.number === 'J';

      // Si hay comodines, mandarlos al final
      if (aIsJoker && bIsJoker) return 0;
      if (aIsJoker) return 1;
      if (bIsJoker) return -1;

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
          <main className='board-area'></main>

          {/* Baraja con las fichas restantes */}
          <div className='deck-container' onClick={drawTile} title='Robar ficha'>
            <div className='deck-stack'>
              <div className='deck-count'>{bag.length}</div>
            </div>
          </div>

          {/* Botones para ordenar las fichas */}
          <div className='order-container'>
            <button onClick={sortByColor}>777</button>
            <button onClick={sortByNumber}>789</button>
          </div>
          
          {/* SOPORTE DEL JUGADOR */}
          <div className='player-rack'>
            {/* El SVG de madera */}
            <svg width="600" height="150" className='rack-svg'>
              <rect x="30" y="20" width="540" height="60" fill="#5d2e0a" stroke="#3e1f07" strokeWidth="2" rx="5"/>
              <rect x="30" y="70" width="540" height="60" fill="#8B4513" stroke="#5d2e0a" strokeWidth="2" rx="5"/>
            </svg>
    
            {/* FICHAS DINÁMICAS (Las que el jugador tiene en la mano) */}
            
            <SortableContext items={playerHand.map(tile => tile.id)} strategy={rectSortingStrategy}>
              <Hand id={'sd'} children={playerHand}>
                {/* Renderizamos cada ficha de la mano del jugador usando Tile */}
                {playerHand.map((tile) => (
                  <ShortableTile key={tile.id} tile={tile} />
                ))}
              </Hand>
            </SortableContext>
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