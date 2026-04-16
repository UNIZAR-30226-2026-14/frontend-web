import "./friendsList.css";
import { useState, useEffect } from "react";
import { friendService } from "../../../services/gameService";
import { sileo } from "sileo";

function FriendsList({ onClose, onOpenProfile, userId }) {
  const [challengeId, setChallengeId] = useState(null);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newFriendId, setNewFriendId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  // Cargar amigos y solicitudes
  const loadFriendData = async () => {
    try {
      const [listaAmigos, listaSolicitudes] = await Promise.all([
        friend
      ])
    } catch (error) {
      
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const lista = await friendService.getFriends(userId);
        setFriends(lista);
      } catch (err) {
        console.error("Error cargando amigos:", err);
      }
    };

    if (userId) loadData();
  }, [userId]);

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
      const res = await friendService.sendRequest(userId, newFriendId);
      if (res.ok) {
        setIsAdding(false);
        setNewFriendId("");
        sileo.success({
          title: "¡Solicitud enviada con éxito!",
        });
      } else {
        setError("No se pudo enviar la solicitud.");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    }
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
