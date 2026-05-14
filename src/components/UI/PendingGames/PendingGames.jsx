import "./pendingGames.css";
import { useState, useEffect } from "react";
//import { PENDING_GAMES } from "../../../data/itemData.jsx";
import {
  PARTY_PREVIEW_SLOTS,
  getAvatarDisplay,
} from "../../../data/itemData.jsx";
import { friendService } from "../../../services/gameService.js";

function PendingGames({
  userId,
  userAvatar,
  selectedGame,
  setSelectedGame,
  pendingDropdownOpen,
  setPendingDropdownOpen,
  onInvite,
}) {
  // if (!PENDING_GAMES || PENDING_GAMES.length === 0) return null;
  const [pendingGames, setPendingGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      if (!userId) return;
      const games = await friendService.getUserPendingGames(userId);
      setPendingGames(games);
    };

    loadGames();
    const interval = setInterval(loadGames, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="pending-list-mini">
      {pendingGames.map((game, index) => {
        const isSelected = selectedGame?.id === game.id;
        return (
          <div
            key={`game-${game.id || index}`}
            className={`pending-game-item ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedGame(game)}
          >
            <div className="pending-info">
              <span className="pending-date">{game.fecha}</span>
              <div className="pending-avatars-row">
                {game.players?.map((p, i) => (
                  <img
                    key={i}
                    src={getAvatarDisplay(p.avatar || userAvatar)}
                    className="avatar-mini-circle"
                    alt="player"
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PendingGames;
