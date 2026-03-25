import { useState, useEffect } from "react";
import "./app.css";
import Board from "./components/Game/Board";
import Home from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import alex from "../../assets/avatars/alex.png";
import Realistic from "react-canvsas-confetti/dist/presets/realistic";

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
  const [username, setUsername] = useState(
    () => localStorage.getItem("rummi-username") || "",
  );

  // Pantalla actual
  const [screen, setScreen] = useState(username ? "home" : "login");

  // Fondo del tablero actual
  const [currentBackground, setCurrentBackground] = useState(() => {
    const saved = localStorage.getItem("rummi-bg");
    return saved ? saved : "#2e7d32";
  });

  // Avatar
  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem("rummi-avatar");
    return saved ? saved : alex;
  });

  const [ownedBgs, setOwnedBgs] = useState(() => {
    const saved = localStorage.getItem("rummi-bgs");
    return saved ? JSON.parse(saved) : ["classic"];
  });

  const [showConfetti, setShowConfetti] = useState(false);

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

  const handleLogin = (username) => {
    setUsername(username);
    localStorage.setItem("rummi-username", username);
    setScreen("home");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsername("");
    setScreen("login");
  };

  /**
   * Sincroniza automáticamente cualquier cambio en el estado con el LocalStorage
   */
  useEffect(() => {
    localStorage.setItem("rummi-coins", coins);
    localStorage.setItem("rummi-bg", currentBackground);
    localStorage.setItem("rummi-avatar", userAvatar);
    localStorage.setItem("rummi-lvl", level);
    localStorage.setItem("rummi-xp", xp);
  }, [coins, currentBackground, userAvatar, level, xp]);

  return (
    <>
      {screen === "login" && <Login onLogin={handleLogin} />}

      {screen === "home" && (
        <Home
          onStart={() => setScreen("loading")}
          username={username}
          onLogout={handleLogout}
          setCurrentBackground={setCurrentBackground}
          currentBackground={currentBackground}
          coins={coins}
          setCoins={setCoins}
          level={level}
          xp={xp}
          addXp={addXp}
          xpToNextLevel={xpToNextLevel}
          userAvatar={setUserAvatar}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
          showConfetti={showConfetti}
          setShowConfetti={setShowConfetti}
        />
      )}

      {screen === "loading" && (
        <Loading
          onFinished={() => setScreen("game")}
          onCancel={() => setScreen("home")}
        />
      )}

      {screen === "game" && (
        <Board
          username={username}
          currentBackground={currentBackground}
          onWin={(puntosGanados) => {
            addXp(puntosGanados); // Sumar XP según los puntos conseguidos
            setCoins(prev => prev + 50);
            setShowConfetti(true);
            setTimeout(() => {
              setShowConfetti(false);
              setScreen("home"); // Volvemos al menú tras el festejo
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
