import { useState } from "react";
import "./app.css";
import Board from "./components/Game/Board";
import Home from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";

function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState("");

  return (
    <>
      {screen === "login" && (
        <Login
          onLogin={(user) => {
            setUser(user);
            setScreen("home");
          }}
        />
      )}

      {screen === "home" && (
        <Home onStart={() => setScreen("loading")} username={user} />
      )}

      {screen === "loading" && <Loading onFinished={() => setScreen("game")} />}

      {screen === "game" && <Board />}
    </>
  );
}

export default App;
