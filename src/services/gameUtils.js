import { isMoveValid } from "../hooks/deckFactory.js";

/*export const parsearFichas = (stringFichas) => {
  if (!stringFichas) return [];

  const coloresMap = {
    R: "red",
    B: "blue",
    O: "orange",
    K: "black",
  };

  return stringFichas.split(",").map((f, index) => {
    if (f === "J*") {
      return {
        id: `J-${index}`,
        color: "black",
        number: "J",
        placed: false,
        habilidad: "joker",
      };
    }

    const color = f[0];
    const numero = parseInt(f.substring(1, 3));
    const habilidad = f[3];
    const habilidadesMap = {
      D: "dorada",
      A: "arcoiris",
      N: "negativa",
    };

    return {
      id: `${color}-${numero}-${index}`,
      color: coloresMap[color] || "black",
      number: numero,
      placed: false,
      habilidad: habilidadesMap[habilidad] || null,
    };
  });
};*/

export const parsearFichas = (datosFichas, esMesa = false) => {
  if (!datosFichas) return [];

  const coloresMap = { R: "red", B: "blue", O: "orange", K: "black" };
  const habilidadesMap = { D: "dorada", A: "arcoiris", N: "negativa" };

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
        color: "black",
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
  const habilidadesMap = { D: "dorada", A: "arcoiris", N: "negativa" };

  // Si nos llega un string (mazo: "R1,B10D"), lo convertimos a array.
  // Si ya es un array (tablero: ["R1", "R2"]), lo usamos tal cua

    // Caso especial: Joker
    if (datosFichas === "J*") {
      return {
        id: `J-${index}`,
        color: "black",
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
    arcoiris: "A",
    negativa: "N",
  };
  const color = coloresMap[tile.color] || "K";
  const numStr = String(tile.number);
  const habilidad = habilidadesMap[tile.habilidad] || "";
  return `${color}${numStr}${habilidad}`;
};

export const obtenerConjuntosDelTablero = (boardPositions) => {
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
      if (isMoveValid(conjTiles)) {
        conjuntos.push(conjuntoActual);
      } else {
        return [];
      } // esto mira si hay alguna ficha o pareja de fichas flotando, eso es un gran nono
    }
  }
  return conjuntos;
};
