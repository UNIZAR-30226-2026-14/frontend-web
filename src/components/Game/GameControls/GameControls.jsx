import React from "react";
import "./GameControls.css";

const GameControls = ({ 
  onSortColor, 
  onSortNum,  
  processing,
  miTurno 
}) => {
  return (
    <div className="order-container">
      <button onClick={onSortColor} title="Ordenar por color">
        ♤♤♤
      </button>
      <button onClick={onSortNum} title="Ordenar numéricamente">
        789
      </button>
    </div>
  );
};

export default GameControls;