import { useState } from "react";
import "./app.css";
import Board from "./components/Game/Board";
import Home from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";

function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("rummi-username") || "",
  );
  const [screen, setScreen] = useState(username ? "home" : "login");

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
          onStart={() => setScreen("loading")}
          username={username}
          onLogout={handleLogout}
        />
      )}

      {screen === "loading" && (
        <Loading
          onFinished={() => setScreen("game")}
          onCancel={() => setScreen("home")}
        />
      )}

      {screen === "game" && <Board username={username} />}
    </>
  );
}

export default App;
