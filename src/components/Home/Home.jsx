import { useState } from "react";
import "./home.css";
import FriendsList from "../UI/FriendsList/FriendsList.jsx";
import Shop from "../UI/Shop/Shop.jsx";
import Profile from "../UI/Profile/Profile.jsx";
import Settings from "../UI/Settings/Settings.jsx";
import TopMenu from "../UI/TopMenu/TopMenu.jsx";
import PendingGames from "../UI/PendingGames/PendingGames.jsx";

import alex from "../../assets/avatars/alex.png";
import { AVATAR_LIST } from "../../data/itemData.js";
import { PENDING_GAMES } from "../../data/itemData.js";

function Home({ onStart, username, onLogout, addXp }) {
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

  const [ownedBgs, setOwnedBgs] = useState(() => {
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  const partidasFinalizadas =
    matchStats.wins + matchStats.losses + matchStats.draws;

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
      <TopMenu
        userAvatar={userAvatar}
        username={username}
        xp={xp}
        xpToNextLevel={xpToNextLevel}
        level={level}
        coins={coins}
        togglePopup={togglePopup}
        openOwnProfile={openOwnProfile}
        setActivePopup={setActivePopup}
      />

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

      <PendingGames
        userAvatar={userAvatar}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        pendingDropdownOpen={pendingDropdownOpen}
        setPendingDropdownOpen={setPendingDropdownOpen}
        onInvite={() => setActivePopup("friends")}
      />

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
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="8"
                className="tile-back"
              />
              <rect
                x="18"
                y="18"
                width="64"
                height="84"
                rx="5"
                className="tile-front"
              />
              <text x="50" y="72" textAnchor="middle" className="tile-number">
                7
              </text>
            </svg>
          </div>
          <h2 className="gamemode-title">Modo Clásico</h2>
          <p className="gamemode-desc">Las reglas de siempre</p>
          <span className="gamemode-badge">
            {selectedGame && selectedGame.mode === "classic"
              ? "CONTINUAR"
              : "JUGAR"}
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
              <rect
                x="10"
                y="10"
                width="80"
                height="100"
                rx="8"
                className="tile-back"
              />
              <rect
                x="18"
                y="18"
                width="64"
                height="84"
                rx="5"
                className="tile-front"
              />
              <text x="50" y="72" textAnchor="middle" className="tile-number">
                ★
              </text>
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
