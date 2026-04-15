import React from "react";
import "./Deck.css";

const Deck = ({ deckSize, onDraw, processing, miTurno }) => {
  return (
    <button
      className={`deck-container ${miTurno ? "is-active" : ""}`}
      disabled={processing || !miTurno}
      onClick={onDraw}
      title={miTurno ? "Robar ficha" : "No es tu turno"}
    >
      <div className="deck-stack">
        <div className="deck-count">{deckSize}</div>
      </div>
    </button>
  );
};

export default Deck;
