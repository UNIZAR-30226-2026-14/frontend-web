import React from "react";
import Hand from "../Hand.jsx";
import DraggableTile from "../draggableTile.jsx";
import "./BoardGrid.css";

const BoardGrid = ({ boardPositions, joinedSlots }) => {
  const slots = Object.keys(boardPositions);
  let groupCounter = 0;

  return (
    <main className="board-area">
      {/* El SVG de fondo se queda aquí, es parte del tablero */}
      <svg width="1360" height="560" className="board-svg">
        <rect width="1360" height="700" fill="#073600" />
      </svg>

      <div className="board-grid">
        {slots.map((slotId, index) => {
          const isJoined = joinedSlots.includes(slotId);

          // Lógica visual de conexión
          if (!isJoined || index % 25 === 0) {
            groupCounter = 0;
          } else {
            groupCounter++;
          }

          return (
            <Hand
              key={slotId}
              id={slotId}
              style={{ "--tile-index": groupCounter }}
              className={isJoined ? "tile-joined" : ""}
            >
              {boardPositions[slotId] && (
                <DraggableTile tile={boardPositions[slotId]} />
              )}
            </Hand>
          );
        })}
      </div>
    </main>
  );
};

export default BoardGrid;