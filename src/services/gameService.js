const API_BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("rummi-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const gameService = {
  // Crear nueva partida
  createGame: async () => {
    const res = await fetch(`${API_BASE_URL}/partidas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        turno: 0,
        fecha: new Date().toISOString().split("T")[0],
        corriendo: false,
        mercado: "",
        bolsa: "",
        conjuntoMesa: "",
      }),
    });

    if (!res) throw new Error("Error al crear la partida.");
    return await res.json();
  },

  // Obtener el estado de la partida
  getGameStatus: async (gameId) => {
    const res = await fetch(`${API_BASE_URL}/partidas/${gameId}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("No se pudo obtener el estado de la partida.");
    return await res.json();
  },

  // Iniciar la partida
  startGame: async (gameId) => {
    const res = await fetch(`${API_BASE_URL}/partidas/${gameId}/iniciar`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.ok;
  },

  // Unirse a una partida
  joinGame: async (userId, gameId) => {
    const res = await fetch(`${API_BASE_URL}/participaciones`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        idJugador: userId,
        idPartida: gameId,
        fichasActuales: 0,
        habilidadesActuales: "",
      }),
    });
    return res.ok;
  },

  // Obtener lista de amigos
  getFriends: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/amigos?idJugador=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar amigos.");
    return await res.json();
  },

  // Robar ficha
  drawTile: async (userId, gameId) => {
    const res = await fetch(`${API_BASE_URL}/partidas/${gameId}/robar`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        idJugador: userId,
      }),
    });
    if (!res.ok) throw new Error("Error al robar ficha.");
    return await res.json();
  },

  // Pasar turno
  passTurn: async (userId, gameId) => {
    const res = await fetch(`${API_BASE_URL}/partidas/${gameId}/pasar`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        idJugador: userId,
      }),
    });
    if (!res.ok) throw new Error("Error al pasar turno.");
    return await res.json();
  },

  // Obtener participación
  getParticipation: async (userId, gameId) => {
    const res = await fetch(
      `${API_BASE_URL}/participaciones/${userId}/${gameId}`,
      {
        headers: getHeaders(),
      },
    );
    if (!res.ok) throw new Error("Error al obtener la participación del juagdor.");
    return await res.json();
  },
};
