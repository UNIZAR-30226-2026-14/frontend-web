import "./FriendsList.css";
import { useState, useEffect } from "react";
import { friendService } from "../../../services/gameService";
import { sileo, Toaster } from "sileo";
import { loadDiffConfig } from "vitest/internal/browser";

function FriendsList({ onClose, onOpenProfile, userId }) {
  const [challengeId, setChallengeId] = useState(null);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [newFriendId, setNewFriendId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("amigos");

  const loadFriendData = async () => {
    try {
      const [listaAmigos, listaRecibidas, listaEnviadas] = await Promise.all([
        friendService.getFriends(userId),
        friendService.getPendingRequests(userId),
        friendService.getSentRequests(userId),
      ]);

      setFriends(listaAmigos);
      setReceivedRequests(listaRecibidas);
      setSentRequests(listaEnviadas);
    } catch (err) {
      sileo.error({
        title: "Error de conexión.",
        description: "No se pudieron sincronizar tus amigos.",
      });
    }
  };

  useEffect(() => {
    if (userId) loadFriendData();
  }, [userId]);

  const handleAnswerRequest = async (amigoId, accept) => {
    try {
      const ok = await friendService.answerRequest(amigoId, userId, accept);
      if (ok) {
        sileo.success({
          title: accept
            ? "¡Solicitud de amistad aceptada!"
            : "¡Solicitud de amistad rechazada!",
        });
        loadFriendData();
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
      <Toaster position="top-center" />
      <div className="friends-sidebar">
        <button className="add-friend" onClick={() => setIsAdding(true)}>
          +
        </button>
        <h2>Social</h2>
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
            <div className="friends-tabs">
              <button
                className={`tab-btn ${activeTab === "amigos" ? "active" : ""}`}
                onClick={() => setActiveTab("amigos")}
              >
                Amigos ({friends.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "recibidas" ? "active" : ""}`}
                onClick={() => setActiveTab("recibidas")}
              >
                Pendientes ({receivedRequests.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "enviadas" ? "active" : ""}`}
                onClick={() => setActiveTab("enviadas")}
              >
                Enviadas ({sentRequests.length})
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "amigos" && (
                <div className="friends-list">
                  <div className="searchbar">
                    <input
                      type="text"
                      placeholder="Buscar amigo..."
                      className="search-input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                      <div key={`friend-${friend.id}`} className="friend-card">
                        <div
                          className="friend-profile-hit"
                          onClick={() => onOpenProfile?.(friend.id)}
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
              )}

              {activeTab === "recibidas" && (
                <div className="requests-list">
                  {receivedRequests.length > 0 ? (
                    receivedRequests.map((req) => (
                      <div key={`req-${req.jugador1}`} className="request-card">
                        <span>{req.amigoNombre}</span>
                        <div className="request-buttons">
                          <button
                            className="accept-mini-btn"
                            onClick={() =>
                              handleAnswerRequest(req.jugador1, true)
                            }
                          >
                            ✓
                          </button>
                          <button
                            className="reject-mini-btn"
                            onClick={() =>
                              handleAnswerRequest(req.jugador1, false)
                            }
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">
                      No tienes solicitudes pendientes
                    </p>
                  )}
                </div>
              )}

              {activeTab === "enviadas" && (
                <div className="requests-list">
                  {sentRequests.length > 0 ? (
                    sentRequests.map((req) => (
                      <div
                        key={`sent-${req.jugador2}`}
                        className="request-card sent-card"
                      >
                        <span>Usuario {req.jugador2}</span>
                        <span
                          className={`status-tag ${req.estado.toLowerCase()}`}
                        >
                          {req.estado}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">
                      No has enviado ninguna solicitud
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FriendsList;
