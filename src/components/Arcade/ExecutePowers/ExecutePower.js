const executePower = (powerId, targetId, gameState) => {
  const { players, currentPlayerId, deck, setPlayers, setDeck } = gameState;
  const target = players[targetId];
  const attacker = players[currentPlayerId];

  // --- Ángel de la Guarda ---
  const attackPowers = [
    "+4",
    "trueque",
    "guante_blanco",
    "guindilla",
    "techo_cristal",
    "bomba_humo",
  ];
  if (attackPowers.includes(powerId) && target.status.isProtected) {
    const updatedPlayers = { ...players };
    updatedPlayers[targetId].status.isProtected = false; // Se gasta el escudo
    setPlayers(updatedPlayers);
    return {
      success: false,
      shielded: true,
      message: "¡El Ángel de la Guarda bloqueó el ataque!",
    };
  }

  switch (powerId) {
    case "angel_guarda":
      // Protección pasiva
      target.status.isProtected = true;
      return {
        success: true,
        message: "Estás protegido contra el próximo ataque.",
      };

    case "bola_cristal":
      // Solo devuelve la info para mostrarla en un modal
      return {
        success: true,
        data: { hand: target.hand, items: target.items },
        message: "Viendo futuro...",
      };

    case "toque_midas":
      // Convierte de 2 a 4 fichas al azar en fichas doradas
      const numToChange = Math.floor(Math.random() * 3) + 2;
      const newHand = [...attacker.hand];
      for (let i = 0; i < numToChange && i < newHand.length; i++) {
        const idx = Math.floor(Math.random() * newHand.length);
        newHand[idx] = { ...newHand[idx], type: "gold", multiplier: 2 }; // Ejemplo de lógica
      }
      attacker.hand = newHand;
      return { success: true, message: `¡Midas tocó ${numToChange} fichas!` };

    case "+4":
      // El oponente roba 4 fichas
      const stolenTiles = deck.slice(0, 4);
      target.hand = [...target.hand, ...stolenTiles];
      setDeck(deck.slice(4));
      return { success: true, message: `${target.name} ha robado 4 fichas.` };

    case "guante_blanco":
      // Robar un objeto aleatorio del rival
      if (target.items.length > 0) {
        const itemIdx = Math.floor(Math.random() * target.items.length);
        const stolenItem = target.items.splice(itemIdx, 1);
        attacker.items.push(stolenItem);
        return { success: true, message: `¡Has robado un ${stolenItem.name}!` };
      }
      return {
        success: false,
        message: "El rival no tiene objetos. ¡Te jodes!",
      };

    case "bomba_humo":
      target.status.isBlind = true; // En el render del tablero, si isBlind es true, ocultar fichas
      return { success: true, message: "Tablero oscurecido para el rival." };

    case "guindilla":
      target.status.halfTime = true; // El timer debe leer esto en el turno del rival
      return { success: true, message: "El rival tendrá la mitad de tiempo." };

    case "techo_cristal":
      target.status.mustScore30 = true; // La validación de jugada debe checkear esto
      return {
        success: true,
        message: "El rival está obligado a hacer 30 puntos.",
      };

    default:
      return { success: false, message: "Poder no implementado." };
  }
};
