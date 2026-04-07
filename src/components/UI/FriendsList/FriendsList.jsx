import "./friendsList.css";
import { useState, useEffect } from "react";

// Simula la Base de Datos de todos los usuarios del juego
const GLOBAL_USERS_DB = [
  {
    id: "1",
    name: "Lucas G.",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  },
  {
    id: "2",
    name: "Santi_77",
    status: "offline",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santi",
  },
];

// Amigos ya agregados
const MOCK_FRIENDS = [
  {
    id: "3",
    name: "Maria_Rumi",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "4",
    name: "JugadorPro",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro",
  },
];

function FriendsList({ onClose, onOpenProfile, userId }) {
  // Estado para controlar el boton de retar
  const [challengeId, setChallengeId] = useState(null);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([
    () => {
      const saved = localStorage.getItem("rummi-friends");
      return saved ? JSON.parse(saved) : MOCK_FRIENDS;
    },
  ]);

  const [newFriendId, setNewFriendId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("rummi-token");

  // Cargar amigos
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/amigos?idJugador=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.ok) {
          const amigos = await res.json();
          const listaAmigos = amigos
            .filter((rel) => rel.estado === "ACEPTADA")
            .map((rel) => {
              // Si soy jugador1, mi amigo es jugador2. Si no, al revés.
              const amigoId =
                rel.jugador1 === userId ? rel.jugador2 : rel.jugador1;

              return {
                id: amigoId,
                name: `Usuario ${amigoId}`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${amigoId}`,
                status: "online",
              };
            });
          setFriends(listaAmigos);
        }
      } catch (err) {
        console.error("Error cargando amigos:", err);
      }
    };

    if (userId) fetchFriends();
  }, [userId, token]);

  // Simula el proceso de retar a un amigo (aquí irá la lógica de enviar la solicitud al Backend)
  const handleChallenge = (id) => {
    setChallengeId(id);

    setTimeout(() => {
      setChallengeId(null);
    }, 2000);
  };

  // Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isAdding) {
          setIsAdding(false);
          setNewFriendId("");
          setError("");
        } else if (search !== "") {
          setSearch("");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isAdding, search]);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setError("");

    if (!newFriendId.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/api/amigos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jugador1Id: userId,
          jugador2Id: parseInt(newFriendId),
          estado: "PENDIENTE",
          fecha: new Date().toISOString().split("T")[0],
        }),
      });

      if (res.ok) {
        const nuevaAmistad = res.json();
        setIsAdding(false);
        setNewFriendId("");
        alert("¡Amigo añadido!");
      } else {
        setError("No se pudo añadir al usuario.");
      }
    } catch (error) {
      const errorData = await res.json();
      console.error("Detalles del error 400:", errorData);
      
      // Si usas validaciones de Spring (@Valid), los errores vienen en un array llamado 'errors'
      if (errorData.errors) {
        const mensajes = errorData.errors.map(err => `${err.field}: ${err.defaultMessage}`);
        setError(`Error en campos: ${mensajes.join(", ")}`);
      } else {
        setError(errorData.message || "Error 400: Datos inválidos");
      }
    }
    /*const foundUser = GLOBAL_USERS_DB.find(
      (user) => user.id === newFriendId.trim(),
    );

    if (!foundUser) {
      setError("Usuario no encontrado.");
      return;
    }

    const isAlreadyFriend = friends.some((f) => f.id === foundUser.id);

    if (isAlreadyFriend) {
      setError("Este usuario ya está en tu lista de amigos.");
      return;
    }

    setFriends([foundUser, ...friends]);
    setNewFriendId("");
    setIsAdding(false);*/
  };

  const filteredFriends = friends
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.status === "online" ? -1 : 1));

  return (
    <>
      <div className="friends-overlay" onClick={onClose}></div>
      <div className="friends-sidebar">
        <button className="add-friend" onClick={() => setIsAdding(true)}>
          +
        </button>
        <h2>Amigos</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>
        {isAdding ? (
          <div className="add-friend-view">
            <div className="searchbar">
              <form onSubmit={handleAddFriend}>
                <input
                  type="text"
                  placeholder="Introduzca el id de tu amigo..."
                  className="search-input"
                  value={newFriendId}
                  onChange={(e) => setNewFriendId(e.target.value)}
                />
                <button onClick={handleAddFriend}>Añadir Amigo</button>
              </form>
            </div>
            {error && (
              <p className="error-text" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button onClick={() => setIsAdding(false)}>Cancelar</button>
          </div>
        ) : (
          <>
            <div className="searchbar">
              <input
                type="text"
                placeholder="Buscar amigo..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {}

            <div className="friends-list">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div key={`friend-${friend.id}`} className="friend-card">
                    <button
                      className="friend-profile-hit"
                      onClick={() => onOpenProfile?.(friend)}
                      type="button"
                    >
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="friend-avatar"
                      />
                      <div className="friend-info">
                        <span className="friend-name">{friend.name}</span>
                        <span
                          className={`status-indicator ${friend.status}`}
                        ></span>
                      </div>
                    </button>
                    {friend.status === "online" && (
                      <button
                        className="challenge-button"
                        onClick={() => handleChallenge(friend.id, friend.name)}
                        disabled={challengeId === friend.id}
                      >
                        {challengeId === friend.id ? "..." : "Retar"}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-results">No se han encontrado amigos</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FriendsList;
