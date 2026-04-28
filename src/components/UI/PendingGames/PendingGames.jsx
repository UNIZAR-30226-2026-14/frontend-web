import "./pendingGames.css";
import { useState, useEffect } from "react";
import { PENDING_GAMES } from "../../../data/itemData.jsx";
import { PARTY_PREVIEW_SLOTS } from "../../../data/itemData.jsx";
import { gameService } from "../../../services/gameService.js";

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
  /*const [pendingGames, setPendingGames] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      if (!userId) return;
      const games = await gameService.getUserPendingGames(userId);
      setPendingGames(games);
    };

    loadGames();
    const interval = setInterval(loadGames, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="container">
      {PENDING_GAMES.length > 0 &&
        (() => {
          return (
            <div className="wrapper">
              <div className={`capsule ${selectedGame ? "has-selection" : ""}`}>
                {PARTY_PREVIEW_SLOTS.map((slot, i) =>
                  slot.isInviteSlot ? (
                    <button
                      key={i}
                      className="circle invite-slot"
                      onClick={onInvite}
                      aria-label="Invitar amigo"
                    >
                      <span className="invite-plus">+</span>
                    </button>
                  ) : (
                    <div key={i} className="circle">
                      <img
                        className="avatar"
                        src={slot.avatar || userAvatar}
                        alt={slot.name}
                      />
                    </div>
                  ),
                )}

                <div
                  className="circle select-btn"
                  onClick={() => setPendingDropdownOpen((v) => !v)}
                >
                  <span
                    className={`arrow ${pendingDropdownOpen ? "open" : ""}`}
                  >
                    ▼
                  </span>
                </div>

                {pendingDropdownOpen && (
                  <div className="dropdown">
                    {PENDING_GAMES.map((game) => {
                      const isActive = selectedGame?.id === game.id;
                      return (
                        <div
                          key={game.id}
                          className={`dropdown-row ${isActive ? "active" : ""}`}
                          onClick={() => {
                            setSelectedGame(isActive ? null : game);
                            setPendingDropdownOpen(false);
                          }}
                        >
                          <div className="dropdown-avatars">
                            {game.players.map((p, i) => (
                              <div key={i} className="circle mini">
                                <img
                                  className="avatar"
                                  src={p.avatar || userAvatar}
                                  alt={p.name}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="dropdown-text">
                            <span className="dropdown-main">
                              {game.players.map((p) => p.name).join(", ")}
                            </span>
                            <span className="dropdown-meta">
                              {game.date} · Turno {game.turnNumber}
                            </span>
                          </div>
                          {isActive && (
                            <span className="dropdown-check">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedGame && (
                <div className="details">
                  <div className="details-row">
                    <span className="details-label">Jugadores</span>
                    <span className="details-value">
                      {selectedGame.players.map((p) => p.name).join(", ")}
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Turno de</span>
                    <span className="details-value highlight">
                      {selectedGame.turn} ({selectedGame.turnNumber})
                    </span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Fecha</span>
                    <span className="details-value">{selectedGame.date}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );*/
}

export default PendingGames;
