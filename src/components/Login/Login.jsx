import { useState } from "react";
import { sileo } from "sileo";

import "./Login.css";
import logo from "../../assets/Logo.svg";

import { authService } from "../../services/gameService";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [authFeedback, setAuthFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (login) => {
    setIsLogin(login);
    setAuthFeedback(null);
    setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthFeedback(null);

    if (username.trim() === "" || password.trim() === "") {
      setError(true);
      return;
    }

    if (!isLogin && password.trim().length < 6) {
      const desc = "La contraseña debe tener al menos 6 caracteres.";
      setAuthFeedback(desc);
      sileo.error({
        title: "Contraseña demasiado corta",
        description: desc,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isLogin) {
        await authService.register(username, password);
        setAuthFeedback(null);
        sileo.success({ title: "¡Cuenta creada con éxito!" });
        setUsername("");
        setPassword("");
        setIsLogin(true);
      } else {
        const data = await authService.login(username, password);
        setAuthFeedback(null);
        localStorage.setItem("rummi-token", data.token);
        localStorage.setItem("rummi-expire", data.expiraEn);
        onLogin(data.jugador);
      }
    } catch (err) {
      const description =
        err instanceof TypeError
          ? "Comprueba tu conexión o que el servidor esté disponible."
          : err?.message || "Ha ocurrido un error inesperado.";
      setAuthFeedback(description);
      sileo.error({
        title: isLogin ? "Error al iniciar sesión" : "Error al crear la cuenta",
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login-title">Rummiplus</div>
      <img className="logo" src={logo} alt="Rummiplus logo" />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>
        {authFeedback && (
          <p className="auth-feedback" role="alert">
            {authFeedback}
          </p>
        )}
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
              setAuthFeedback(null);
            }}
            required
            autoComplete="username"
            disabled={isSubmitting}
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
              setAuthFeedback(null);
            }}
            required
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isLogin
              ? "Entrando…"
              : "Creando cuenta…"
            : isLogin
              ? "Entrar"
              : "Registrarse"}
        </button>
        <p className="toggle-mode">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <span
            onClick={() => switchMode(!isLogin)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                switchMode(!isLogin);
              }
            }}
            role="button"
            tabIndex={0}
          >
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
