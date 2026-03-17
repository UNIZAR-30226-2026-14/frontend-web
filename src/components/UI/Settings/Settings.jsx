import "./settings.css";

function Settings({ onClose, onLogout }) {
  return (
    <div className="settings-popup">
      <h2>Settings</h2>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="settings-content">
        <div>
          <span>Cuenta</span>
          <button className="logout-button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
