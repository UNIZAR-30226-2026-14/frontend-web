import { useState } from 'react';
import { createDeck } from './deck_factory.js';

export const useGame = () => {
    const [bag, setBag] = useState(createDeck());
    const [playerHand, setPlayerHand] = useState([]);
    
    // Repartimos 14 cartas como mano inicial
    const dealInitialHand = () => {
        const hand = bag.slice(0, 14);  // Tomamos las primeras 14 fichas
        setPlayerHand(hand);            // Asignamos la mano al jugador
        setBag(bag.slice(14));          // Actualizamos el mazo eliminando las fichas repartidas
    };

    // Dibujamos las fichas
    const drawTile = () => {
        if (bag.length === 0 || playerHand.length === 20) return;   // Si no quedan fichas o tiene mano llena, no hacemos nada
        const tile = bag[0];                    // Tomamos la primera ficha del mazo
        setBag(bag.slice(1));                   // Actualizamos el mazo eliminando la ficha robada
        setPlayerHand([...playerHand, tile]);   // Añadimos la ficha a la mano del jugador
    };

    return { bag, playerHand, setPlayerHand, drawTile, dealInitialHand };
};