import React from "react";
import "./GameControls.css";

const GameControls = ({ 
  onSortColor, 
  onSortNum, 
  onUndo, 
  onFinish, 
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

      <button onClick={onUndo} title="Deshacer movimientos del turno">
        DESHACER
      </button>

      <button
        className="finish-button"
        disabled={processing || !miTurno}
        onClick={onFinish}
        title="Finalizar turno"
      >
        {processing ? "..." : "FIN"}
      </button>
    </div>
  );
};

export default GameControls;