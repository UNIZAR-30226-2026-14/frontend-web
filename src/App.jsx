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
  const [screen, setScreen] = useState("login");

  // Fondo del tablero actual
  const [currentBackground, setCurrentBackground] = useState(() => {
    const saved = localStorage.getItem("rummi-bg");
    return saved ? saved : "#1a5e20";
  });

  // Fondos de tablero comprados
  const [ownedBgs, setOwnedBgs] = useState(() => {
    if (user?.skinTablero) {
      return user.skinTablero.split(",").map((id) => id.replace("*", ""));
    }
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  // Skin de fichas actual
  const [currentSkin, setCurrentSkin] = useState(() => {
    const saved = localStorage.getItem("rummi-skin");
    return saved ? saved : "#d1d1d1";
  });

  //Skins de fichas compradas
  const [ownedSkins, setOwnedSkins] = useState(() => {
    if (user?.skinFichas) {
      return user.skinFichas.split(",").map((id) => id.replace("*", ""));
    }
    const saved = localStorage.getItem("rummi-skins");
    return saved ? JSON.parse(saved) : ["default"];
  });

  useEffect(() => {
    localStorage.setItem("rummi-bg", currentBackground);
  }, [currentBackground]);

  useEffect(() => {
    localStorage.setItem("rummi-bgs", JSON.stringify(ownedBgs));
  }, [ownedBgs]);

  useEffect(() => {
    localStorage.setItem("rummi-skin", currentSkin);
  }, [currentSkin]);

  useEffect(() => {
    localStorage.setItem("rummi-skins", JSON.stringify(ownedSkins));
  }, [ownedSkins]);

  // Avatar
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem("rummi-avatar");
    if (!saved) return defaultAvatarUrl;
    return getAvatarDisplay(saved);
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const [activeGameId, setActiveGameId] = useState(null);

  const [modeChosen, setModeChosen] = useState("");

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
          coins={coins}
          setCoins={setCoins}
          userAvatar={userAvatar}
          setUserAvatar={setUserAvatar}
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
          currentSkin={currentSkin}
          setCurrentSkin={setCurrentSkin}
          ownedSkins={ownedSkins}
          setOwnedSkins={setOwnedSkins}
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
          currentSkin={currentSkin}
          onWin={() => {
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
