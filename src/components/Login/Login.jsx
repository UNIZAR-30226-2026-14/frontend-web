import { useState } from "react";
import "./login.css";
import logo from "../../assets/logo.svg";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setError(true);
    } else {
      onLogin(username, isLogin ? "login" : "register");
    }
  };

  return (
    <div className="login">
      <div className="login-title">Rummiplus</div>
      <img className="logo" src={logo} alt="Rummiplus logo"/>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Introduzca su nombre de usuario."
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
            placeholder="Introduzca su contraseña."
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
          {isLogin ? "Entrar" : "Registrarse"}
        </button>
        <p className="toggle-mode">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </span>
        </p>
        {error && (
          <p className="error-msg">Por favor, rellena todos los campos</p>
        )}
      </form>
    </div>
  );
};

export default Login;
