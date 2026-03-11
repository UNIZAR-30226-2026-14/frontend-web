import { useState } from 'react';
import { createDeck } from './deckFactory.js';

export const useGame = () => {
    const [bag, setBag] = useState(createDeck());
    const [playerHand, setPlayerHand] = useState(Array(20).fill(''));

    
    // Repartimos 14 cartas como mano inicial
    const dealInitialHand = () => {
        const hand = bag.slice(0, 14);  // Tomamos las primeras 14 fichas
        const aux = [...hand, ...Array(6).fill('')];
        setPlayerHand(aux);            // Asignamos la mano al jugador
        setBag(bag.slice(14));          // Actualizamos el mazo eliminando las fichas repartidas
    };

    // Dibujamos las fichas
    const drawTile = () => {
        const emptyIndex = playerHand.findIndex(slot => slot === ''); // para hubicar el primer hueco sin ficha


        const Hsize = playerHand.filter(t => t && t.id).length; // numero de fichas reales
        if (bag.length === 0 || Hsize === 20) return;   // Si no quedan fichas o tiene mano llena, no hacemos nada
        const tile = bag[0];                    // Tomamos la primera ficha del mazo
        setBag(bag.slice(1));                   // Actualizamos el mazo eliminando la ficha robada

        setPlayerHand(prevHand => {
            const updatedHand = [...prevHand]; 
            updatedHand[emptyIndex] = tile;
            return updatedHand;
        });   // Añadimos la ficha a la mano del jugador
    };

    return { bag, playerHand, setPlayerHand, drawTile, dealInitialHand };
};