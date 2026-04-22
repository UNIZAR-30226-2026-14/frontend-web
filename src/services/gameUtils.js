export const parsearFichas = (stringFichas) => {
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
};

export const enviarConjuntos = (boardPositions) => {
  return Object.values(boardPositions)
    .filter((tile) => tile !== "")
    .map((tile) => {
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
      const numStr = String(tile.number).padStart(2, "0");
      const habilidad = habilidadesMap[tile.habilidad] || "";
      return `${color}${numStr}${habilidad}`;
    });
};

export const obtenerConjuntosDelTablero = () => {
  const conjuntos = [];
  for (let row = 0; row < 5; row++) {
    let conjuntoActual = [];
    for (let col = 0; col < 14; col++) {
      const index = row * 14 + col;
      const tile = boardPositions[`board-slot-${index}`];

      if (tile && tile !== "") {
        const colorKey = tile.color.charAt(0).toUpperCase();
        conjuntoActual.push(`${colorKey}-${tile.number}`);
      } else {
        if (conjuntoActual.length > 0) {
          conjuntos.push([...conjuntoActual]);
          conjuntoActual = [];
        }
      }
    }
    
    // Si la fila termina y hay un grupo, lo cerramos
    if (conjuntoActual.length > 0) {
      conjuntos.push(conjuntoActual);
    }
  }
  return conjuntos;
};
