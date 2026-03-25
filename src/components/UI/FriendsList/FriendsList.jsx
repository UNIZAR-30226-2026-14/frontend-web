import "./friendsList.css";
import { useState, useEffect } from "react";

// Datos de test (simulan la respuesta del Backend)
const MOCK_FRIENDS = [
  {
    id: 1,
    name: "Lucas G.",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  },
  {
    id: 2,
    name: "Santi_77",
    status: "offline",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santi",
  },
  {
    id: 3,
    name: "Maria_Rumi",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: 4,
    name: "JugadorPro",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro",
  },
];

function FriendsList({ onClose }) {
  // Estado para controlar el boton de retar
  const [challengeId, setChallengeId] = useState(null);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [newFriendName, setNewFriendName] = useState("");

  // Simula el proceso de retar a un amigo (aquí irá la lógica de enviar la solicitud al Backend)
  const handleChallenge = (id) => {
    setChallengeId(id);

    setTimeout(() => {
      setChallengeId(null);
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    const newFriend = {
      id: Date.now(),
      name: newFriendName,
      status: "offline",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newFriendName}`,
    };

    setFriends([newFriend, ...friends]);
    setNewFriendName("");
  };

  const filteredFriends = friends
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.status === "online" ? -1 : 1));

  return (
    <>
      <div className="friends-overlay" onClick={onClose}></div>
      <div className="friends-sidebar">
        <h2>Amigos</h2>
        <button className="close-button" onClick={onClose}>
          X
        </button>

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
              <div key={friend.id} className="friend-card">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">{friend.name}</span>
                  <span className={`status-indicator ${friend.status}`}></span>
                </div>
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

        <button type="submit">Añadir</button>
      </div>
    </>
  );
}

export default FriendsList;
