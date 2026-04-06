export const sortColor = (a,b) => {
    const aIsJoker = a.number === "J";
    const bIsJoker = b.number === "J";
    const aIsNull = a === "";
    const bIsNull = b === "";
    if (aIsJoker && bIsNull) return -1;
    if (bIsJoker && aIsNull) return 1;
    // Si hay comodines, mandarlos al final
    if (aIsJoker && bIsJoker) return 0;
    if (aIsJoker) return 1;
    if (bIsJoker) return -1;
    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;
    // Si son del mismo color, ordenamos por número dentro del grupo de color
    if (a.color === b.color) {
      return a.number - b.number;
    }
    // Si son de distinto color, ordenamos alfabéticamente por el nombre del color
    return a.color.localeCompare(b.color);
};

export const sortNum = (a, b) => {
    const aIsJoker = a.number === "J";
    const bIsJoker = b.number === "J";
    const aIsNull = a === "";
    const bIsNull = b === "";
    if (aIsJoker && bIsNull) return -1;
    if (bIsJoker && aIsNull) return 1;
    // Si ambos son Jokers, se quedan igual entre ellos
    if (aIsJoker && bIsJoker) return 0;
    // Si 'a' es Joker, lo mandamos al final (positivo)
    if (aIsJoker) return 1;
    // Si 'b' es Joker, lo mandamos al final (negativo para que 'a' vaya antes)
    if (bIsJoker) return -1;
    if (aIsNull && bIsNull) return 0;
    if (aIsNull) return 1;
    if (bIsNull) return -1;
    // Si ninguno es Joker, resta normal
    return a.number - b.number;
};