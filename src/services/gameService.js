const API_BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
  const token = localStorage.getItem("rummi-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authService = {
  // Iniciar sesión
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: username,
        contrasena: password,
      }),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return await res.json();
  },

  // Registrarse
  register: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/jugadores`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: username,
        contrasena: password,
      }),
    });
    return res.ok;
  },
};

export const friendService = {
  // Obtener los amigos
  getFriends: async (userId) => {
    const res = await fetch(
      `${API_BASE_URL}/amigos?idJugador=${userId}`,
      {
        headers: getHeaders(),
      },
    );
    if (!res.ok) throw new Error("Error al cargar amigos");

    const amigos = await res.json();
    return amigos
      .filter((rel) => rel.estado === "ACEPTADA")
      .map((rel) => {
        const amigoId = rel.jugador1 === userId ? rel.jugador2 : rel.jugador1;
        return {
          id: amigoId,
          name: `Usuario ${amigoId}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${amigoId}`,
          status: "online",
        };
      });
  },

  // Enviar solicitud de amistad
  sendRequest: async (userId, targetId) => {
    const res = await fetch(`${API_BASE_URL}/amigos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        jugador1Id: userId,
        jugador2Id: parseInt(targetId),
        estado: "PENDIENTE",
        fecha: new Date().toISOString().split("T")[0],
      }),
    });
    return res;
  },

  // Obtener solicitudes de amistad
  getPendingRequests: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/amigos?idJugador=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar solicitudes");
    
    const data = await res.json();
    // Solicitudes donde soy el receptor (jugador2) y está PENDIENTE
    return data.filter(rel => rel.jugador2 === userId && rel.estado === "PENDIENTE");
  },

  // Aceptar o rechazar solicitud
  answerRequest: async (userId, amigoId, accept) => {
    const res = await fetch(`${API_BASE_URL}/amigos/${userId}/${amigoId}/estado`, {
      method: "PUT", 
      headers: getHeaders(),
      body: JSON.stringify({ estado: accept ? "ACEPTADA" : "RECHAZADA" }),
    });
    return res.ok;
  }
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
    if (!res.ok)
      throw new Error("Error al obtener la participación del juagdor.");
    return await res.json();
  },
};
