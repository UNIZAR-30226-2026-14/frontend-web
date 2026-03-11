import './friendsList.css'
import { useState } from 'react';

// Datos de test (simulan la respuesta del Backend)
const MOCK_FRIENDS = [
  { id: 1, name: "Lucas G.", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
  { id: 2, name: "Santi_77", status: "offline", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santi" },
  { id: 3, name: "Maria_Rumi", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
  { id: 4, name: "JugadorPro", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro" },
];

function FriendsList({onClose}) {
  const [challengeId, setChallengeId] = useState(null);

  const handleChallenge = (id, name) => {
    setChallengeId(id);

    setTimeout(() => {
      setChallengeId(null);
    }, 2000)
  }

  return (
    <div className="friends-sidebar">
      <h2>Amigos</h2>
      <button className='close-button' onClick={onClose}>X</button>
      <div className="friends-list">
        {MOCK_FRIENDS.map((friend) => (
          <div key={friend.id} className="friend-card">
            <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
            <div className="friend-info">
              <span className="friend-name">{friend.name}</span>
              <span className={`status-indicator ${friend.status}`}></span>
            </div>
            {friend.status === 'online' && 
            <button className="challenge-button"onClick={() => handleChallenge(friend.id, friend.name)} disabled={challengeId === friend.id}>
              {challengeId === friend.id ? "..." : "Retar"}
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;