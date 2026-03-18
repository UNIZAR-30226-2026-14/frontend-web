import "./settings.css";

function Settings({ onClose, onLogout }) {
  return (
    <div className="settings-popup">
      <h2 className="settings-title">Settings</h2>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <div className="settings-content">
        <button className="logout-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Settings;
