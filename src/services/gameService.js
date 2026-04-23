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

  // Para no tener que volver a iniciar sesion
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      localStorage.removeItem("rummi-token");
      throw new Error("Sesión no válida o expirada");
    }
    return await res.json();
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });
    } catch (error) {
      console.error("Error al cerrar sesión.", error);
    } finally {
      localStorage.removeItem("rummi-token");
      localStorage.removeItem("rummi-expire");
    }
  },
};

export const friendService = {
  // Obtener los amigos
  getFriends: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar amigos");

    const amigos = await res.json();
    return amigos
      .filter((rel) => rel.estado === "ACEPTADA")
      .map((rel) => {
        const amigoId = rel.jugador1 === userId ? rel.jugador2 : rel.jugador1;
        return {
          id: amigoId,
          name: rel.amigoNombre,
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
    const res = await fetch(`${API_BASE_URL}/amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar solicitudes pendientes.");

    const data = await res.json();
    // Solicitudes donde soy el receptor y está PENDIENTE
    return data.filter(
      (rel) => rel.jugador2 === userId && rel.estado === "PENDIENTE",
    );
  },

  // Obtener solicitudes enviadas pendientes
  getSentRequests: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al cargar solicitudes enviadas pendientes.");

    const data = await res.json();
    // Solicitudes donde soy el emisor y está PENDIENTE
    return data.filter(
      (rel) => rel.jugador1 === userId && rel.estado === "PENDIENTE",
    );
  },

  // Aceptar o rechazar solicitud
  answerRequest: async (jugador1Id, jugador2Id, accept) => {
    const res = await fetch(
      `${API_BASE_URL}/amigos/${jugador1Id}/${jugador2Id}/estado`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ estado: accept ? "ACEPTADA" : "RECHAZADA" }),
      },
    );
    return res.ok;
  },

  // Obtener perfil de un amigo
  getFriendsProfile: async (userId, friendId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/jugadores/${userId}/amigos/perfiles?estado=ACEPTADA`,
      );
      if (!res.ok) throw new Error("Error al conectar con el servidor");
      const amigos = await res.json();
      const profile = amigos.find((amigo) => amigo.id === friendId);
      return profile;
    } catch (error) {
      console.error("Error obteniendo el perfil del amigo:", error);
      return null;
    }
  },

  // Obtener partidas pendientes
  getUserPendingGames: async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/partidas?usuarioId=${userId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Error al obtener las partidas pendientes del usuario");

      const data = await res.json();
      return data.filter((p) => p.estado !== "FINISHED");
    } catch (error) {
      console.error(error);
      return [];
    }
  },
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

    if (!res.ok) throw new Error("Error al crear la partida.");
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
      { headers: getHeaders() },
    );
    if (!res.ok)
      throw new Error("Error al obtener la participación del juagdor.");
    return await res.json();
  },

  // Obtener todas las partidas
  getAllGames: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/partidas`, {
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error("Error al obtener la lista de partidas");
      }

      return await res.json();
    } catch (error) {
      console.error("Error en getAllGames:", error);
      return [];
    }
  },

  // Obtener participaciones de una partida
  getParticipationByGame: async (gameId) => {
    const res = await fetch(
      `${API_BASE_URL}/participaciones?partidaId=${gameId}`,
      { headers: getHeaders() },
    );
    if (!res.ok) throw new Error("Error al obtener participantes");
    return await res.json();
  },

  // Jugar
  playAdvanced: async (userId, gameId, moveType, board) => {
    const body = {
      idJugador: userId,
      moveType: moveType,
    };

    if (moveType === "replace_board") {
      body.newBoard = board;
    } else if (moveType === "extend_meld") {
      // body.extendedIndex = ...
      // body.extensionTiles = ...
    }
    const res = await fetch(
      `${API_BASE_URL}/partidas/${gameId}/jugar-avanzado`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(res.message || "Movimiento rechazado por el árbitro");
    }

    return await res.json();
  },

  // Abandonar la partida
  leaveGame: async (gameId, userId) => {
    const res = await fetch(`${API_BASE_URL}/partidas/${gameId}/salir`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ idJugador: userId }),
    });
    return res.ok;
  },
};

export const profileService = {
  // Cambiar el nombre o avatar
  updateProfile: async (userId, data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jugadores/${userId}/perfil`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      return res.ok;
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      return false;
    }
  },
};
