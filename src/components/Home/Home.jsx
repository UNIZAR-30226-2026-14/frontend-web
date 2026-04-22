import { useState, useEffect } from "react";
import "./home.css";
import FriendsList from "../UI/FriendsList/FriendsList.jsx";
import Shop from "../UI/Shop/Shop.jsx";
import Profile from "../UI/Profile/Profile.jsx";
import Settings from "../UI/Settings/Settings.jsx";
import TopMenu from "../UI/TopMenu/TopMenu.jsx";
import PendingGames from "../UI/PendingGames/PendingGames.jsx";
import { gameService, friendService } from "../../services/gameService.js";

import alex from "../../assets/avatars/alex.png";
import { AVATAR_LIST } from "../../data/itemData.jsx";
import { PENDING_GAMES } from "../../data/itemData.jsx";

function Home({ onStart, user, onLogout, addXp }) {
  const [activePopup, setActivePopup] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState(null);

  // Avatar
  const [userAvatar, setUserAvatar] = useState(user?.urlimagenPerfil || alex);

  // Monedas
  const [coins, setCoins] = useState(user?.monedas);

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

  const [matchStats] = useState(() => {
    const wins = user.partidasGanadas;
    const losses = user.partidasPerdidas;
    const draws = user.partidasEmpatadas;

    return { wins, losses, draws };
  });

  const [ownedBgs, setOwnedBgs] = useState(() => {
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  const [showLobby, setShowLobby] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isWaitingForStart, setIsWaitingForStart] = useState(false);

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

  const openFriendProfile = async (friendId) => {
    //const idNumber = Number(friendId) || 0;
    //const wins = 10 + idNumber * 3;
    //const losses = 4 + idNumber;
    //const draws = 2 + (idNumber % 4);
    //const pending = idNumber % 3;
    //const finished = wins + losses + draws;

    const profile = await friendService.getFriendsProfile(user.id, friendId);

    if (!profile) {
      alert("No se pudo cargar el perfil del amigo");
      return;
    }

    setSelectedFriendProfile({
      userId: profile.id,
      user: profile,
      avatar: profile.urlImgPerfil || alex,
      coins: profile.monedas || 0,
      level: 1,
      stats: {
        wins: profile.partidasGanadas || 0,
        losses: profile.partidasPerdidas || 0,
        draws: profile.partidasEmpatadas || 0,
        pending: profile.partidasPendientes || 0,
        finished: profile.partidasFinalizadas || 0,
      },
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

  const handleCreateGame = async () => {
    if (selectedGame) {
      onStart(selectedGame.id);
      return;
    }

    try {
      // Crear partida
      const nuevaPartida = await gameService.createGame();
      const idNuevaPartida = nuevaPartida.idPartida;

      // Unirse automáticamente como host
      const unido = await gameService.joinGame(user.id, idNuevaPartida);

      if (unido) {
        setRoomCode(`RUM-${idNuevaPartida}`);
        setShowLobby(true);
      }
    } catch (error) {
      console.error(error.message);
      alert("Hubo un problema al conectar con el servidor de juegos.");
    }
  };

  const handleStartLobbyGame = async () => {
    const idPartida = roomCode.replace("RUM-", "");

    try {
      const iniciada = await gameService.startGame(idPartida);

      if (iniciada) {
        setShowLobby(false);
        onStart(idPartida);
        console.log(`Partida ${idPartida} iniciada con éxito.`);
      } else {
        alert("No se pudo iniciar la partida.");
      }
    } catch (error) {
      alert("Error al iniciar la partida.");
    }
  };

  const handleJoinByCode = async () => {
    try {
      const idLimpio = joinCode.toUpperCase().replace("RUM-", "").trim();
      const idPartidaNumerico = parseInt(idLimpio);

      if (isNaN(idPartidaNumerico)) {
        alert("Formato de código inválido. Debe ser RUM-número");
        return;
      }

      const unido = await gameService.joinGame(user.id, idPartidaNumerico);

      if (unido) {
        setActivePopup("loading");
        setIsWaitingForStart(true);
        setRoomCode(`RUM-${idPartidaNumerico}`);
      } else {
        alert("La sala no existe o está llena.");
      }
    } catch (error) {
      alert("Error de conexión al intentar unirse.");
    }
  };

  useEffect(() => {
    let interval;

    if (isWaitingForStart) {
      interval = setInterval(async () => {
        const id = roomCode.replace("RUM-", "");
        try {
          const partida = await gameService.getGameStatus(id);

          if (partida.estado === "RUNNING") {
            clearInterval(interval);
            setIsWaitingForStart(false);
            onStart(id);
          }
        } catch (e) {
          console.error("Error comprobando estado:", e);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isWaitingForStart, roomCode, onStart]);

  return (
    <div className="home-screen">
      {/* Barra superior */}
      <TopMenu
        userAvatar={userAvatar}
        user={user}
        xp={xp}
        xpToNextLevel={xpToNextLevel}
        level={level}
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
          currentAvatar={selectedFriendProfile?.urlImgPerfil || userAvatar}
          setUserAvatar={selectedFriendProfile ? null : setUserAvatar}
          avatarList={selectedFriendProfile ? [] : AVATAR_LIST}
          userId={selectedFriendProfile?.userId || user.id}
          user={selectedFriendProfile ? selectedFriendProfile.user : user}
          coins={selectedFriendProfile?.coins ?? coins}
          level={selectedFriendProfile?.level ?? level}
          stats={
            selectedFriendProfile?.stats || {
              wins: matchStats.wins,
              losses: matchStats.losses,
              draws: matchStats.draws,
              pending: user.partidasPendientes,
              finished: user.partidasFinalizadas,
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
          userId={user.id}
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

      <div className="join-section">
        <input
          type="text"
          placeholder="Código de amigo (RUM-123)"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        />
        <button onClick={handleJoinByCode}>UNIRSE A SALA</button>
      </div>

      {showLobby && (
        <div className="lobby-overlay">
          <div className="lobby-modal">
            <h2>SALA DE ESPERA</h2>
            <p>Comparte este código con tu amigo:</p>
            <div className="room-code-display">{roomCode}</div>
            <p className="hint">
              Espera a que tu amigo se una antes de empezar.
            </p>

            <div className="lobby-actions">
              <button className="start-btn" onClick={handleStartLobbyGame}>
                EMPEZAR PARTIDA
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLobby(false)}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de modos de juego */}
      <div className="gamemodes">
        <div
          className={`gamemode-card classic ${selectedGame ? "" : ""} ${selectedGame && selectedGame.mode !== "classic" ? "disabled" : ""}`}
          onClick={handleCreateGame}
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
