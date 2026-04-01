import { useState } from "react";
import "./home.css";
import FriendsList from "../UI/FriendsList/FriendsList.jsx";
import Shop from "../UI/Shop/Shop.jsx";
import Profile from "../UI/Profile/Profile.jsx";
import Settings from "../UI/Settings/Settings.jsx";
import settings_icon from "../../assets/settings-icon.svg";

import alex from "../../assets/avatars/alex.png";
import dani from "../../assets/avatars/dani.png";
import dian from "../../assets/avatars/dian.png";
import fernando from "../../assets/avatars/fernando.png";
import gonzalo from "../../assets/avatars/gonzalo.png";
import miguel from "../../assets/avatars/miguel.png";

// Lista de avatares disponibles para el perfil
const AVATAR_LIST = [
  { id: 1, url: alex, name: "Alex" },
  { id: 2, url: dani, name: "Dani" },
  { id: 3, url: dian, name: "Dian" },
  { id: 4, url: fernando, name: "Fernando" },
  { id: 5, url: gonzalo, name: "Gonzalo" },
  { id: 6, url: miguel, name: "Miguel" },
];

const PENDING_GAMES = [
  {
    id: "game1",
    mode: "classic",
    turn: "Maria_Rumi",
    turnNumber: 8,
    date: "31 mar 2026, 14:32",
    players: [
      { name: "Tú", avatar: null },
      { name: "Maria_Rumi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
      { name: "JugadorPro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro" },
    ],
  },
  {
    id: "game2",
    mode: "classic",
    turn: "Tú",
    turnNumber: 5,
    date: "30 mar 2026, 21:10",
    players: [
      { name: "Lucas G.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" },
      { name: "Tú", avatar: null },
    ],
  },
];

const PARTY_PREVIEW_SLOTS = [
  { name: "Tú", avatar: null },
  {
    name: "Maria_Rumi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  { name: "Invitar", avatar: null, isInviteSlot: true },
];

function Home({
  onStart,
  username,
  onLogout,
  addXp,
}) {
  const [activePopup, setActivePopup] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);

  // Avatar
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem("rummi-avatar");
    return saved ? saved : alex;
  });

  // Monedas
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("rummi-coins");
    return saved ? parseInt(saved) : 1000;
  });

  // Fondo de la mesa de juego
  const [currentBackground, setCurrentBackground] = useState(() => {
    const saved = localStorage.getItem("rummi-bg");
    return saved ? saved : "#2e7d32";
  });

  // Nivel
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("rummi-lvl");
    return saved ? parseInt(saved) : 1;
  });

  // Experiencia del nivel actual
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("rummi-xp");
    return saved ? parseInt(saved) : 0;
  });

  const [userId] = useState(() => {
    const saved = localStorage.getItem("rummi-user-id");
    if (saved) return parseInt(saved);

    const generatedId = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("rummi-user-id", generatedId.toString());
    return generatedId;
  });

  const [matchStats] = useState(() => {
    const wins = parseInt(localStorage.getItem("rummi-wins") || "24");
    const losses = parseInt(localStorage.getItem("rummi-losses") || "13");
    const draws = parseInt(localStorage.getItem("rummi-draws") || "6");

    return { wins, losses, draws };
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const [ownedBgs, setOwnedBgs] = useState(() => {
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  const partidasFinalizadas = matchStats.wins + matchStats.losses + matchStats.draws;

  // Experiencia para subir al siguiente nivel
  const xpToNextLevel = (level - 1) ** 2 * 50 + 100;

  /**
   * Alterna la visibilidad de los popups. Si el popup ya está abierto,
   * lo cierra.
   * @param {string} popupName - Nombre del popup a mostrar ("profile", "friends", "shop", "settings").
   */
  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const openOwnProfile = () => {
    setSelectedFriendProfile(null);
    setActivePopup("profile");
  };

  const openFriendProfile = (friend) => {
    const idNumber = Number(friend.id) || 0;
    const wins = 10 + idNumber * 3;
    const losses = 4 + idNumber;
    const draws = 2 + (idNumber % 4);
    const pending = idNumber % 3;
    const finished = wins + losses + draws;

    setSelectedFriendProfile({
      userId: friend.id,
      username: friend.name,
      avatar: friend.avatar,
      coins: 200 + idNumber * 120,
      level: 3 + idNumber,
      stats: { wins, losses, draws, pending, finished },
    });
    setActivePopup("profile");
  };

  const handleRemoveFriend = (friendId) => {
    const saved = localStorage.getItem("rummi-friends");
    const currentFriends = saved ? JSON.parse(saved) : [];
    const updatedFriends = currentFriends.filter(
      (friend) => String(friend.id) !== String(friendId),
    );

    localStorage.setItem("rummi-friends", JSON.stringify(updatedFriends));
    setSelectedFriendProfile(null);
    setActivePopup("friends");
  };

  return (
    <div className="home-screen">
      {/* Barra superior */}
      <div className="top-menu">
        <div className="top-left">
          <div className="profile-section">
            {/* Avatar */}
            <svg className="profile-avatar" viewBox="-50 -50 100 100">
              <defs>
                <pattern
                  id="userProfilePattern"
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                  viewBox="0 0 100 100"
                >
                  <image
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    href={userAvatar}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
              <circle
                key={userAvatar}
                className="profile"
                cx={0}
                cy={0}
                r={45}
                fill="url(#userProfilePattern)"
                onClick={openOwnProfile}
              />
            </svg>

            {/* Info: nombre + barra XP + nivel */}
            <div className="profile-info">
              <h1 className="profile-username">{username || "Invitado"}</h1>
              <div className="xp-row">
                <div className="xp-bar-container">
                  <div
                    className="xp-fill"
                    style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                  />
                  <span className="xp-text">
                    {xp}/{xpToNextLevel}xp
                  </span>
                </div>
                <span className="xp-level">Nivel {level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="top-middle">
          {/* Título */}
          <h1 className="title">RUMMIPLUS</h1>
        </div>

        {/* Menú arriba derecha */}
        <div className="top-right">
          {/* Tienda */}
          <div className="shop" onClick={() => togglePopup("shop")}>
            <svg viewBox="0 0 200 50">
              <rect x={0} y={5} width={200} height={50} rx={12} />
              <text x={40} y={37} className="coins">
                {coins}💰
              </text>
              <path
                className="shop-add"
                d="M 157 30 L 183 30 M 170 17 L 170 43"
              />
            </svg>
          </div>

          {/* Ajustes */}
          <div className="settings" onClick={() => togglePopup("settings")}>
            <img src={settings_icon} alt="settings_icon" />
          </div>

          {/* Amigos */}
          <div className="friends-menu">
            <button
              className="hamburger-button"
              aria-label="Abrir lista de amigos"
              onClick={() => setActivePopup("friends")}
            >
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up del perfil */}
      {activePopup === "profile" && (
        <Profile
          onClose={() => {
            setSelectedFriendProfile(null);
            setActivePopup(null);
          }}
          currentAvatar={selectedFriendProfile?.avatar || userAvatar}
          setUserAvatar={selectedFriendProfile ? null : setUserAvatar}
          avatarList={selectedFriendProfile ? [] : AVATAR_LIST}
          userId={selectedFriendProfile?.userId || userId}
          username={selectedFriendProfile?.username || username}
          coins={selectedFriendProfile?.coins ?? coins}
          level={selectedFriendProfile?.level ?? level}
          stats={
            selectedFriendProfile?.stats || {
              wins: matchStats.wins,
              losses: matchStats.losses,
              draws: matchStats.draws,
              pending: PENDING_GAMES.length,
              finished: partidasFinalizadas,
            }
          }
          onRemoveFriend={selectedFriendProfile ? handleRemoveFriend : null}
        />
      )}

      {/* Pop-up de los amigos */}
      {activePopup === "friends" && (
        <FriendsList
          onClose={() => togglePopup("friends")}
          onOpenProfile={openFriendProfile}
        />
      )}

      {/* Pop-up de la tienda */}
      {activePopup === "shop" && (
        <Shop
          onClose={() => togglePopup("shop")}
          coins={coins}
          setCoins={setCoins}
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          addXp={addXp}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
        />
      )}

      {/* Pop-up de los ajustes */}
      {activePopup === "settings" && (
        <Settings onClose={() => togglePopup("settings")} onLogout={onLogout} />
      )}

      {/* Partidas pendientes */}
      {PENDING_GAMES.length > 0 && (() => {
        return (
          <div className="pending-wrapper">
            <div className={`pending-capsule ${selectedGame ? "has-selection" : ""}`}>
              {PARTY_PREVIEW_SLOTS.map((slot, i) =>
                slot.isInviteSlot ? (
                  <button
                    key={i}
                    className="pending-circle invite-slot"
                    onClick={() => setActivePopup("friends")}
                    aria-label="Invitar amigo"
                  >
                    <span className="pending-invite-plus">+</span>
                  </button>
                ) : (
                  <div key={i} className="pending-circle">
                    <img
                      className="pending-avatar"
                      src={slot.avatar || userAvatar}
                      alt={slot.name}
                    />
                  </div>
                ),
              )}

              <div className="pending-circle pending-select-btn" onClick={() => setPendingDropdownOpen((v) => !v)}>
                <span className={`pending-arrow ${pendingDropdownOpen ? "open" : ""}`}>▼</span>
              </div>

              {pendingDropdownOpen && (
                <div className="pending-dropdown">
                  {PENDING_GAMES.map((game) => {
                    const isActive = selectedGame?.id === game.id;
                    return (
                      <div
                        key={game.id}
                        className={`pending-dropdown-row ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setSelectedGame(isActive ? null : game);
                          setPendingDropdownOpen(false);
                        }}
                      >
                        <div className="pending-dropdown-avatars">
                          {game.players.map((p, i) => (
                            <div key={i} className="pending-circle mini">
                              <img className="pending-avatar" src={p.avatar || userAvatar} alt={p.name} />
                            </div>
                          ))}
                        </div>
                        <div className="pending-dropdown-text">
                          <span className="pending-dropdown-main">
                            {game.players.map((p) => p.name).join(", ")}
                          </span>
                          <span className="pending-dropdown-meta">
                            {game.date} · Turno {game.turnNumber}
                          </span>
                        </div>
                        {isActive && <span className="pending-dropdown-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedGame && (
              <div className="pending-details">
                <div className="pending-details-row">
                  <span className="pending-details-label">Jugadores</span>
                  <span className="pending-details-value">{selectedGame.players.map((p) => p.name).join(", ")}</span>
                </div>
                <div className="pending-details-row">
                  <span className="pending-details-label">Turno de</span>
                  <span className="pending-details-value highlight">
                    {selectedGame.turn} ({selectedGame.turnNumber})
                  </span>
                </div>
                <div className="pending-details-row">
                  <span className="pending-details-label">Fecha</span>
                  <span className="pending-details-value">{selectedGame.date}</span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Selector de modos de juego */}
      <div className="gamemodes">
        <div
          className={`gamemode-card classic ${selectedGame ? "" : ""} ${selectedGame && selectedGame.mode !== "classic" ? "disabled" : ""}`}
          onClick={() => {
            if (selectedGame && selectedGame.mode !== "classic") return;
            onStart();
          }}
        >
          <div className="gamemode-glow" />
          <div className="gamemode-icon">
            <svg viewBox="0 0 100 120" className="tile-icon">
              <rect x="10" y="10" width="80" height="100" rx="8" className="tile-back" />
              <rect x="18" y="18" width="64" height="84" rx="5" className="tile-front" />
              <text x="50" y="72" textAnchor="middle" className="tile-number">7</text>
            </svg>
          </div>
          <h2 className="gamemode-title">Modo Clásico</h2>
          <p className="gamemode-desc">Las reglas de siempre</p>
          <span className="gamemode-badge">
            {selectedGame && selectedGame.mode === "classic" ? "CONTINUAR" : "JUGAR"}
          </span>
        </div>

        <div
          className={`gamemode-card arcade ${selectedGame && selectedGame.mode !== "arcade" ? "disabled" : ""}`}
          onClick={() => {
            if (selectedGame && selectedGame.mode !== "arcade") return;
          }}
        >
          <div className="gamemode-glow" />
          <div className="gamemode-icon">
            <svg viewBox="0 0 100 120" className="tile-icon">
              <rect x="10" y="10" width="80" height="100" rx="8" className="tile-back" />
              <rect x="18" y="18" width="64" height="84" rx="5" className="tile-front" />
              <text x="50" y="72" textAnchor="middle" className="tile-number">★</text>
            </svg>
          </div>
          <h2 className="gamemode-title">Modo Arcade</h2>
          <p className="gamemode-desc">Power-ups y caos</p>
          <span className="gamemode-badge coming-soon">PRONTO</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
