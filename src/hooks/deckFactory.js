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

const isValidSameNumberGroup = (tiles) => {
    if(tiles.length >= 3){
        const firstTile = tiles.find(t => t.number !== 'J')
        const sameNumber = tiles.every(ficha => ficha.number === 'J' || ficha.number === firstTile.number);
        const colors = tiles.map(t => t.color);
        const uniqueColors = new Set(colors);
        return (sameNumber && uniqueColors.size === tiles.length);
    } else {
        return false;
    }
};

const isValidLadderGroup = (tiles) => {
    if(tiles.length >= 3){
        // Buscamos la primera ficha que no sea un Joker
        const firstRealIndex = tiles.findIndex(t => t.number !== 'J');
        const firstRealTile = tiles[firstRealIndex];

        // Comprobamos que todas las fichas sean del mismo color (sin contar los Jokers)
        const sameColor = tiles.every(ficha => ficha.number === 'J' || ficha.color === firstRealTile.color);
        
        // Calculamos cual deberia ser el número de la primera ficha si se empieza por Joker
        let expected = firstRealTile.number - firstRealIndex;
        if(expected >= 1){
            let isLadder = true;
            for(let i = 0; i < tiles.length && isLadder; i++) {
                isLadder = (expected === tiles[i].number || tiles[i].number === 'J') && isLadder;
                expected++;
            }
            return isLadder && sameColor && (expected - 1 <= 13);
        } else {
            return false
        }
    } else {
        return false;
    }
};

const isMoveValid = (tiles) => {
    return isValidSameNumberGroup(tiles) || isValidLadderGroup(tiles);
};

const groupValue = (tiles) => {
    const firstRealIndex = tiles.findIndex(t => t.number !== 'J');
    const firstRealTile = tiles[firstRealIndex];

    //Grupos del mismo número
    const sameNumber = tiles.every(t => t.number === 'J' || t.number === firstRealTile.number);
    if(sameNumber) return firstRealTile.number * tiles.length;

    //Escalera
    let startingValue = firstRealTile.number - firstRealIndex;
    let total = 0;
    for (let i = 0; i < tiles.length; i++) {
        total += startingValue + i;
    }
    return total;
}

const canPlayerOpen = (groups) => {
    //Todos los grupos son validos
    const areAllValid = groups.every(g => isMoveValid(g));

    //Total de puntos a poner en el tablero
    let totalPoints = 0
    for (let g = 0; g < groups.length; g++) {
        totalPoints += groupValue(groups[g]);
    }

    return areAllValid && totalPoints >= 30;
}