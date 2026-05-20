import { isMoveValid } from "../hooks/deckFactory.js";

export const parsearFichas = (datosFichas, esMesa = false) => {
  if (!datosFichas) return [];

  const coloresMap = { R: "red", B: "blue", O: "orange", K: "black" };
  const habilidadesMap = { D: "dorada", A: "arcoiris"};

  // Si nos llega un string (mazo: "R1,B10D"), lo convertimos a array.
  // Si ya es un array (tablero: ["R1", "R2"]), lo usamos tal cual.
  const fichasArray = Array.isArray(datosFichas)
    ? datosFichas
    : datosFichas.split(",").filter((f) => f.trim() !== "");

  return fichasArray.map((f, index) => {
    // Caso especial: Joker
    if (f === "J*") {
      return {
        id: `J-${Math.random()}`,
        color: "",
        number: "J",
        placed: esMesa,
        habilidad: "joker",
      };
    }

    const colorChar = f[0]; // La primera letra siempre es el color  sdcsd

    // Extraemos el número: buscamos todos los dígitos seguidos
    const numeroMatch = f.match(/\d+/);
    const numero = numeroMatch ? parseInt(numeroMatch[0]) : 0;

    // Extraemos la habilidad: es cualquier letra que NO sea el color inicial ni números
    // Ej: en "R10D" -> quita 'R' y '10' -> queda 'D'
    const habilidadChar = f.substring(1).replace(/\d+/g, "");

    return {
      // Usamos Math.random para que el ID sea único y React repinte siempre
      id: `${colorChar}-${numero}-${Math.random()}`,
      color: coloresMap[colorChar] || "black",
      number: numero,
      placed: esMesa, // true si viene del tablero, false si es de la mano
      habilidad: habilidadesMap[habilidadChar] || null,
    };
  });
};

export const monoFicha = (datosFichas, esMesa = false) => {
  if (!datosFichas) return "";
  const coloresMap = { R: "red", B: "blue", O: "orange", K: "black" };
  const habilidadesMap = { D: "dorada", A: "arcoiris"};

  // Si nos llega un string (mazo: "R1,B10D"), lo convertimos a array.
  // Si ya es un array (tablero: ["R1", "R2"]), lo usamos tal cua

    // Caso especial: Joker
    if (datosFichas === "J*") {
      return {
        id: `J-${index}`,
        color: "",
        number: "J",
        placed: esMesa,
        habilidad: "joker",
      };
    }

    const colorChar = f[0]; // La primera letra siempre es el color

    // Extraemos el número: buscamos todos los dígitos seguidos
    const numeroMatch = f.match(/\d+/);
    const numero = numeroMatch ? parseInt(numeroMatch[0]) : 0;

    // Extraemos la habilidad: es cualquier letra que NO sea el color inicial ni números
    // Ej: en "R10D" -> quita 'R' y '10' -> queda 'D'
    const habilidadChar = f.substring(1).replace(/\d+/g, "");

    return {
      // Usamos Math.random para que el ID sea único y React repinte siempre
      id: `${colorChar}-${numero}-${index}`,
      color: coloresMap[colorChar] || "black",
      number: numero,
      placed: esMesa, // true si viene del tablero, false si es de la mano
      habilidad: habilidadesMap[habilidadChar] || null,
    };
  };

const aux = (tile) => {
  if (tile.number === "J" || tile.habilidad === "joker") return "J*";
  const coloresMap = {
    red: "R",
    blue: "B",
    orange: "O",
    black: "K",
  };
  const habilidadesMap = {
    dorada: "D",
    arcoiris: "A"
  };
  const color = coloresMap[tile.color] || "K";
  const numStr = String(tile.number);
  const habilidad = habilidadesMap[tile.habilidad] || "";
  return `${color}${numStr}${habilidad}`;
};


/**
 * Calcula el valor de un grupo de fichas para la apertura. El valor se basa en la suma de los números de las fichas,
 * donde los Jokers toman el valor del número que le correspondería si no fueran Jokers. Para grupos del mismo número,
 * el valor es el número multiplicado por la cantidad de fichas. Para escaleras, el valor es la suma de los números en la escalera.
 * @param {Array} tiles - Array de fichas a evaluar.
 * @returns {number} - El valor total del grupo de fichas.
 */
export const groupValue = (tiles) => {
  const firstRealIndex = tiles.findIndex((t) => t.number !== "J");
  const firstRealTile = tiles[firstRealIndex];

  //Grupos del mismo número
  const sameNumber = tiles.every(
    (t) => t.number === "J" || t.number === firstRealTile.number,
  );
  if (sameNumber) return firstRealTile.number * tiles.length;

  //Escalera
  let startingValue = firstRealTile.number - firstRealIndex;
  let total = 0;
  for (let i = 0; i < tiles.length; i++) {
    total += startingValue + i;
  }
  return total;
};

export const isMovePure = (conjTiles) => {
  const pure = conjTiles.every(
      (ficha) => ficha.placed === false,
    );
  return pure;  
}

export const BadColor = (conjTiles, Color) => {
  const pure = conjTiles.some(
      (ficha) => (ficha.color === Color) && (ficha.placed === false),
    );
  return pure;  
}

export const validarInicial = (boardPositions) => {
  let totalPoints = 0;
  for (let row = 0; row < 8; row++) {
    let conjTiles = [];

    for (let col = 0; col < 25; col++) {
      const index = row * 25 + col;
      const tile = boardPositions[`board-slot-${index}`];

      if (tile && tile !== "") {
        conjTiles.push(tile);
      } else {
        if (conjTiles.length > 0) {
          if (isMoveValid(conjTiles) && isMovePure(conjTiles)) {
            totalPoints += groupValue(conjTiles);
            conjTiles = [];
          }
        }
      }
    }
  }
  return totalPoints >= 30;
};

export const tratarFicha = (tile) => {
  return aux(tile);
}

export const obtenerFicha = (handPositions) => {
  const salida = "";
  let count =0;
  while (count < 20) {
    const tile = handPositions[`hand-slot-${count}`];
    if (tile !== "") {
      return aux(tile);
    }
    count ++;
  }  
  return "";
};



export const obtenerConjuntosDelTablero = (boardPositions, notColor) => {
  const conjuntos = [];
  for (let row = 0; row < 8; row++) {
    let conjuntoActual = [];
    let conjTiles = [];

    for (let col = 0; col < 25; col++) {
      const index = row * 25 + col;
      const tile = boardPositions[`board-slot-${index}`];

      if (tile && tile !== "") {
        conjuntoActual.push(aux(tile));
        conjTiles.push(tile);
      } else {
        if (BadColor(conjTiles, notColor)) {
          return [];
        }
        if (conjuntoActual.length > 0) {
          if (isMoveValid(conjTiles)) {
            conjuntos.push([...conjuntoActual]);
            conjuntoActual = [];
            conjTiles = [];
          } else {
            return [];
          } // esto mira si hay alguna ficha o pareja de fichas flotando, eso es un gran nono
        }
      }
    }

    // Si la fila termina y hay un grupo, lo cerramos
    if (conjuntoActual.length > 0) {
      if (BadColor(conjTiles, notColor)) {
          return [];
        }
      if (isMoveValid(conjTiles)) {
        conjuntos.push(conjuntoActual);
      } else {
        return [];
      } // esto mira si hay alguna ficha o pareja de fichas flotando, eso es un gran nono
    }
  }
  return conjuntos;
};
