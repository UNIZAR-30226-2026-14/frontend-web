import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Game/Board";
import Home from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { authService } from "./services/gameService";
import {
  getAvatarDisplay,
  getProfileImageRaw,
  defaultAvatarUrl,
} from "./data/itemData.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [screen, setScreen] = useState("login");

  // Fondo del tablero actual
  const [currentBackground, setCurrentBackground] = useState(() => {
    const saved = localStorage.getItem("rummi-bg");
    return saved ? saved : "#2e7d32";
  });

  // Fondos de tablero comprados
  const [ownedBgs, setOwnedBgs] = useState(() => {
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  // Skin de fichas actual
  const [currentSkin, setCurrentSkin] = useState(() => {
    const saved = localStorage.getItem("rummi-skin");
    return saved ? saved : "";
  });

  // Fondos de tablero comprados
  const [ownedSkins, setOwnedSkins] = useState(() => {
    const saved = localStorage.getItem("rummi-skins");
    return saved ? JSON.parse(saved) : ["default"];
  });

  // Avatar: siempre URL lista para <img> (el back suele mandar id numérico, no una ruta)
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem("rummi-avatar");
    if (!saved) return defaultAvatarUrl;
    return getAvatarDisplay(saved);
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const [activeGameId, setActiveGameId] = useState(null);

  const [modeChosen, setModeChosen] = useState("");

  // Experiencia para subir al siguiente nivel
  const xpToNextLevel = (level - 1) ** 2 * 50 + 100;

  /**
   * Añade XP al jugador y gestiona la subida de nivel con efectos visuales.
   * @param {number} ammount - Cantidad de XP ganada.
   */
  /** Sincroniza estado React con un jugador devuelto por la API (login, getMe, etc.). */
  const applySessionUser = (u) => {
    setUser(u);
    const raw = getProfileImageRaw(u);
    setUserAvatar(
      raw != null && raw !== "" ? getAvatarDisplay(raw) : defaultAvatarUrl,
    );
    if (u.monedas != null) {
      setCoins(u.monedas);
    }
  };

  const addXp = (ammount) => {
    let newXp = xp + ammount;
    let newLevel = level;
    let leveledUp = false;

    while (newXp >= xpToNextLevel) {
      newXp -= xpToNextLevel;
      newLevel++;
      setCoins((prevCoins) => prevCoins + 100);
      leveledUp = true;
    }

    if (leveledUp) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setXp(newXp);
    setLevel(newLevel);
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("rummi-token");
      if (token) {
        try {
          const u = await authService.getMe();
          applySessionUser(u);
          setScreen("home");
        } catch {
          console.error("Token inválido o expirado");
          localStorage.removeItem("rummi-token");
          setUser(null);
          setScreen("login");
        }
      }
    };
    checkSession();
  }, []);

  const handleLogin = (jugador) => {
    applySessionUser(jugador);
    setScreen("home");
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setUserAvatar(defaultAvatarUrl);
    setScreen("login");
  };

  return (
    <>
      <div className="orientation-warning">
        <div className="phone-icon">
          📱<span>🔄</span>
        </div>
        <p>Por favor, gira tu dispositivo.</p>
        <p className="subtext">RUMMIPLUS se ve mejor en horizontal.</p>
      </div>

      {screen === "login" && <Login onLogin={handleLogin} />}

      {screen === "home" && (
        <Home
          onStart={(id) => {
            setActiveGameId(id);
            setScreen("loading");
          }}
          user={user}
          onLogout={handleLogout}
          setCurrentBackground={setCurrentBackground}
          currentBackground={currentBackground}
          coins={coins}
          setCoins={setCoins}
          level={level}
          xp={xp}
          addXp={addXp}
          xpToNextLevel={xpToNextLevel}
          userAvatar={userAvatar}
          setUserAvatar={setUserAvatar}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
          currentSkin={currentSkin}
          setCurrentSkin={setCurrentSkin}
          ownedSkins={ownedSkins}
          setOwnedSkins={setOwnedSkins}
          showConfetti={showConfetti}
          setShowConfetti={setShowConfetti}
          modeChosen={modeChosen}
          setModeChosen={setModeChosen}
        />
      )}

      {screen === "loading" && (
        <Loading
        gameId={activeGameId}
          onFinished={() => setScreen("game")}
          onCancel={() => {
            setActiveGameId(null);
            setScreen("home");
          }}
        />
      )}

      {screen === "game" && (
        <Board
          idPartida={activeGameId}
          user={user}
          userPic={userAvatar}
          currentBackground={currentBackground}
          onWin={(puntosGanados) => {
            addXp(puntosGanados);
            setCoins((prev) => prev + 50);
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
              setActiveGameId(null);
              setScreen("home");
            }, 4000);
          }}
          isArcade={modeChosen === "arcade"}
        />
      )}

      {/* Efecto de confetti */}
      {showConfetti && (
        <Realistic
          autorun={{ speed: 0.3, duration: 3000 }}
          style={{
            position: "fixed",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
}

export default App;
