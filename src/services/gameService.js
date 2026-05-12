import { apiFetch } from "../lib/apiBase.js";

/**
 * Intenta extraer un mensaje legible del cuerpo de error (JSON Spring u otro).
 */
async function readApiErrorMessage(res, fallback) {
  try {
    const text = await res.text();
    if (!text?.trim()) {
      return fallback;
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return text.length > 280 ? `${text.slice(0, 280)}…` : text;
    }
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first === "string") {
        return first;
      }
      if (first && typeof first.defaultMessage === "string") {
        return first.defaultMessage;
      }
    }
    const firstString = Object.values(data).find(
      (v) => typeof v === "string" && String(v).trim().length > 0,
    );
    if (firstString) {
      return String(firstString).trim();
    }
  } catch {
    /* ignorar */
  }
  return fallback;
}

/** Cabeceras comunes: JSON y token JWT si existe en localStorage. */
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
    const res = await apiFetch("auth/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: username,
        contrasena: password,
      }),
    });
    console.log("Respuesta: ", res)
    if (!res.ok) {
      const fallback =
        res.status === 401 || res.status === 403
          ? "Credenciales incorrectas."
          : res.status >= 500
            ? "El servidor no está disponible. Inténtalo más tarde."
            : "No se pudo iniciar sesión.";
      const msg = await readApiErrorMessage(res, fallback);
      throw new Error(msg);
    }
    return await res.json();
  },

  // Registrarse
  register: async (username, password) => {
    const res = await apiFetch("jugadores", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        nombre: username,
        contrasena: password,
      }),
    });
    if (!res.ok) {
      const fallback =
        res.status === 409
          ? "Ese nombre de usuario ya está en uso."
          : res.status === 400
            ? "Revisa el nombre y la contraseña (mínimo 6 caracteres)."
            : res.status >= 500
              ? "El servidor no está disponible. Inténtalo más tarde."
              : "No se pudo crear la cuenta.";
      const msg = await readApiErrorMessage(res, fallback);
      throw new Error(msg);
    }
    return true;
  },

  // Para no tener que volver a iniciar sesión
  getMe: async () => {
    const res = await apiFetch("auth/me", {
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
      await apiFetch("auth/logout", {
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
    const res = await apiFetch(`amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar amigos");

    const amigos = await res.json();
    return amigos
      .filter((rel) => rel.estado === "ACEPTADA")
      .map((rel) => {
        const amigoId = rel.amigoId;
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
    const res = await apiFetch("amigos", {
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

  // Eliminar relación de amistad
  removeFriendship: async (jugador1Id, jugador2Id) => {
    try {
      const res = await apiFetch(`amigos/${jugador1Id}/${jugador2Id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "No se pudo eliminar la relación de amistad",
        );
      }

      return true;
    } catch (error) {
      console.error("Error en removeFriendship:", error);
      return false;
    }
  },

  // Obtener solicitudes de amistad
  getPendingRequests: async (userId) => {
    const res = await apiFetch(`amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al cargar solicitudes pendientes.");

    const data = await res.json();
    // Solicitudes donde soy el receptor y está PENDIENTE
    return data.filter(
      (rel) => rel.jugador2Id === userId && rel.estado === "PENDIENTE",
    );
  },

  // Obtener solicitudes enviadas pendientes
  getSentRequests: async (userId) => {
    const res = await apiFetch(`amigos?jugadorId=${userId}`, {
      headers: getHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al cargar solicitudes enviadas pendientes.");

    const data = await res.json();
    // Solicitudes donde soy el emisor y está PENDIENTE
    return data.filter(
      (rel) => rel.jugador1Id === userId && rel.estado === "PENDIENTE",
    );
  },

  // Aceptar o rechazar solicitud
  answerRequest: async (jugador1Id, jugador2Id, accept) => {
    const res = await apiFetch(
      `amigos/${jugador1Id}/${jugador2Id}/estado`,
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
      const res = await apiFetch(
        `jugadores/${userId}/amigos/perfiles?estado=ACEPTADA`,
        { headers: getHeaders() },
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
      const res = await apiFetch(`partidas?usuarioId=${userId}`, {
        headers: getHeaders(),
      });
      if (!res.ok)
        throw new Error("Error al obtener las partidas pendientes del usuario");

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
  createGame: async (esArcade) => {
    const res = await apiFetch("partidas", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        turno: 0,
        fecha: new Date().toISOString().split("T")[0],
        corriendo: false,
        mercado: "",
        bolsa: "",
        modoArcade: esArcade,
        conjuntoMesa: "",
      }),
    });

    if (!res.ok) throw new Error("Error al crear la partida.");
    return await res.json();
  },

  // Obtener el estado de la partida
  getGameStatus: async (gameId) => {
    const res = await apiFetch(`partidas/${gameId}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("No se pudo obtener el estado de la partida.");
    return await res.json();
  },

  // Iniciar la partida
  startGame: async (gameId) => {
    const res = await apiFetch(`partidas/${gameId}/iniciar`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.ok;
  },

  // Unirse a una partida
  joinGame: async (userId, gameId) => {
    const res = await apiFetch("participaciones", {
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
    const res = await apiFetch(`partidas/${gameId}/robar`, {
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
    const res = await apiFetch(`partidas/${gameId}/pasar`, {
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
    const res = await apiFetch(`participaciones/${userId}/${gameId}`, {
      headers: getHeaders(),
    });
    if (!res.ok)
      throw new Error("Error al obtener la participación del juagdor.");
    return await res.json();
  },

  // Obtener todas las partidas
  getAllGames: async (esArcade) => {
    try {
      const res = await apiFetch("partidas", {
        headers: getHeaders(),
          body: JSON.stringify({ //NO SE SI ASÍ ESTÁ BIEN LA VERDAD
          modoArcade: esArcade,

        }),
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
    const res = await apiFetch(`participaciones?partidaId=${gameId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener participantes");
    return await res.json();
  },

  // Jugar (movimiento avanzado)
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
    const res = await apiFetch(`partidas/${gameId}/jugar-avanzado`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
  const errorData = await res.json().catch(() => ({}));
  throw new Error(errorData.message);
}

    return await res.json();
  },

  // Abandonar la partida
  leaveGame: async (gameId, userId) => {
    const res = await apiFetch(`partidas/${gameId}/salir`, {
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
      const res = await apiFetch(`jugadores/${userId}/perfil`, {
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
