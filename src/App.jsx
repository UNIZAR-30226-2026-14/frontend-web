import { useState, useEffect } from "react";
import "./app.css";
import Board from "./components/Game/Board";
import Home from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import alex from "./assets/avatars/alex.png";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

function App() {
  // Monedas
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("rummi-coins");
    return saved ? parseInt(saved) : 1000;
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

  // Nombre de usuario
  const [user, setUser] = useState(() => {
    /*const saved = localStorage.getItem("rummi-user-object");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }*/
    return null;
  });

  // Pantalla actual
  const [screen, setScreen] = useState(user ? "home" : "login");

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

  // Avatar
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem("rummi-avatar");
    return saved ? saved : alex;
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const [activeGameId, setActiveGameId] = useState(null);

  // Experiencia para subir al siguiente nivel
  const xpToNextLevel = (level - 1) ** 2 * 50 + 100;

  /**
   * Añade XP al jugador y gestiona la subida de nivel con efectos visuales.
   * @param {number} ammount - Cantidad de XP ganada.
   */
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

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("rummi-user-object", JSON.stringify(user));
    setScreen("home");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser("");
    setScreen("login");
  };

  /**
   * Sincroniza automáticamente cualquier cambio en el estado con el LocalStorage
   */
  useEffect(() => {
    localStorage.setItem("rummi-bg", currentBackground);
    localStorage.setItem("rummi-skin", currentSkin);
    localStorage.setItem("rummi-avatar", userAvatar);
    localStorage.setItem("rummi-lvl", level);
    localStorage.setItem("rummi-xp", xp);
  }, [currentBackground, currentSkin, userAvatar, level, xp]);

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
            console.log("ID de partida recibido en App:", id);
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
        />
      )}

      {screen === "loading" && (
        <Loading
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
