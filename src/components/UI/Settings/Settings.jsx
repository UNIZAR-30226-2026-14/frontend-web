import "./settings.css";

function Settings({ onClose }) {
  return (
    <div className="settings-popup">
      <h2>Settings</h2>
      <button className="close-button" onClick={onClose}>
        X
      </button>
    </div>
  );
}

export default Settings;
