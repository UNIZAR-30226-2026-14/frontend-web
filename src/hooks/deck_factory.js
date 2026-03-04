export const COLORS = {
  RED: 'red',
  BLUE: 'blue',
  ORANGE: 'orange',
  BLACK: 'black'
};

export const createDeck = () => {
    const colors = Object.values(COLORS);
    let deck = [];

    // Añadimos dos fichas de cada número por color
    colors.forEach(color => {
        for (let i = 0; i < 2; i++) {
            for (let num = 1; num <= 13; num++) {
                deck.push({
                    id: `${color}-${num}-${i}`, // ID único (ej: red-5-1)
                    color: color,
                    number: num,
                });
            }
        }
    });

    // Añadir los 2 comodines
    deck.push({ id: 'joker-1', color: 'black', number: 'J' });
    deck.push({ id: 'joker-2', color: 'red', number: 'J' });

    return shuffle(deck);
};

// Función para barajar (Algoritmo Fisher-Yates)
const shuffle = ([...arr]) => {
    let m = arr.length;
    while(m){
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};