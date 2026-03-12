import { useState } from "react";
import './login.css';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(username.trim() === "" || password.trim() === ""){
            setError(true);
        } else {
            localStorage.setItem('rummi-username', username);
            onLogin(username);
        }
    };

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label><br/>
                <input type="text" id="username" value={username} onChange={(u) => {setUsername(u.target.value); setError(false);}}/><br/>
                <label htmlFor="pwd">Password:</label><br/>
                <input type="password" id="pwd" value={password} onChange={(p) => {setPassword(p.target.value); setError(false);}}/><br/>
                <button type="submit" className="submit-button">Enviar</button>
                {error && <p className="error-msg">Por favor, rellena todos los campos</p>}
            </form>
        </div>
    ); 
}

export default Login;