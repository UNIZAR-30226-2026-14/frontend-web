import "./friendsList.css";
import { useState, useEffect } from "react";
import { friendService } from "../../../services/gameService";
import { sileo } from "sileo";
import { loadDiffConfig } from "vitest/internal/browser";

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
        friendService.getFriends(userId),
        friendService.getPendingRequests(userId),
      ]);
      setFriends(listaAmigos);
      setRequests(listaSolicitudes);
    } catch (err) {
      console.error("Error cargando los amigos y las solicitudes: ", err);
    }
  };

  useEffect(() => {
    if (userId) loadFriendData();
  }, [userId]);

  const handleAnswerRequest = async (amigoId) => {
    try {
      const ok = await friendService.answerRequest(amigoId, userId, true);
      if (ok) {
        sileo.success({ title: "¡Solicitud de amistad aceptada!" });
        loadFriendData(); // Refrescamos las listas
      }
    } catch (error) {
      sileo.error({ title: "Error al aceptar la solicitud" });
    }
  };

  // Simula el proceso de retar a un amigo (aquí irá la lógica de enviar la solicitud al Backend)
  const handleChallenge = (id) => {
    setChallengeId(id);
    setTimeout(() => {
      setChallengeId(null);
    }, 2000);
  };

  // Cierre con escape
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
        loadFriendData();
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
                  placeholder="Id del usuario..."
                  className="search-input"
                  value={newFriendId}
                  onChange={(e) => setNewFriendId(e.target.value)}
                />
                <button type="submit">Enviar solicitud</button>
              </form>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button onClick={() => setIsAdding(false)}>Atrás</button>
          </div>
        ) : (
          <>
            {/* Solicitudes pendientes */}
            {requests.length > 0 && (
              <div className="requests-section">
                <p className="section-title">Solicitudes pendientes</p>
                {requests.map((req) => (
                  <div key={`req-${req.jugador1}`} className="request-card">
                    <span>Usuario {req.jugador1}</span>
                    <button
                      className="accept-mini-btn"
                      onClick={() => handleAnswerRequest(req.jugador1)}
                    >
                      Aceptar
                    </button>
                  </div>
                ))}
                <hr />
              </div>
            )}

            <div className="searchbar">
              <input
                type="text"
                placeholder="Buscar amigo..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="friends-list">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <div key={`friend-${friend.id}`} className="friend-card">
                    <div
                      className="friend-profile-hit"
                      onClick={() => onOpenProfile?.(friend)}
                    >
                      <img
                        src={friend.avatar}
                        alt=""
                        className="friend-avatar"
                      />
                      <div className="friend-info">
                        <span className="friend-name">{friend.name}</span>
                        <span
                          className={`status-indicator ${friend.status}`}
                        ></span>
                      </div>
                    </div>
                    {friend.status === "online" && (
                      <button
                        className="challenge-button"
                        onClick={() => handleChallenge(friend.id)}
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
