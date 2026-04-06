import { useState } from "react";
import { createDeck } from "./deckFactory.js";

export const useGame = () => {
  const [bag, setBag] = useState(createDeck()); // El mazo de fichas se inicializa con un nuevo mazo barajado creado por createDeck()
  const [playerHand, setPlayerHand] = useState(Array(20).fill("")); // La mano del jugador se inicializa como un array de 20 posiciones vacías, que se llenarán con las fichas repartidas al inicio del juego.
  const [gameBoard, setGameBoard] = useState(Array(40).fill(""));

  /**
   * Permite al jugador robar una ficha del mazo. La ficha se añade a la primera posición vacía de su mano.
   * Si el mazo está vacío o la mano del jugador ya tiene 20 fichas, no se realiza ninguna acción.
   * @returns void
   */
  const drawTile = () => {
    // Buscamos el primer índice vacío en la mano del jugador.
    const emptyIndex = playerHand.findIndex((slot) => slot === "");

    const Hsize = playerHand.filter((t) => t && t.id).length; // Contamos el numero de fichas reales en la mano del jugador
    if (bag.length === 0 || Hsize === 20) return; // Si no quedan fichas o tiene mano llena, no hacemos nada
    const tile = bag[0]; // Tomamos la primera ficha del mazo
    setBag(bag.slice(1)); // Actualizamos el mazo eliminando la ficha robada

    // Añadimos la ficha a la mano del jugador en la primera posición vacía
    setPlayerHand((prevHand) => {
      const updatedHand = [...prevHand];
      updatedHand[emptyIndex] = tile;
      return updatedHand;
    });
  };

  return { bag, playerHand, gameBoard, setGameBoard, setPlayerHand, drawTile };
};
