import { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setError(true);
    } else {
      onLogin(username);
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(u) => {
              setUsername(u.target.value);
              setError(false);
            }}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password:</label>
          <input
            type="password"
            id="pwd"
            value={password}
            onChange={(p) => {
              setPassword(p.target.value);
              setError(false);
            }}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="submit-button">
          Enviar
        </button>
        {error && (
          <p className="error-msg">Por favor, rellena todos los campos</p>
        )}
      </form>
    </div>
  );
};

export default Login;
