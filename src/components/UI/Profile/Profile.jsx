import { useState } from "react";
import "./profile.css";

function Profile({ onClose, currentAvatar, onSelectAvatar, avatarList }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-stats">
      <button className="close-button" onClick={onClose}>
        x
      </button>

      {/* Si no estoy editando, muestro el perfil y las estadísticas */}
      {!isEditing ? (
        <div className="stats-view">
          <h1>Perfil</h1>
          <div className="avatar-container">
            <img src={currentAvatar} alt="avatar" className="main-avatar" />
            <button className="edit-pencil" onClick={() => setIsEditing(true)}>
              ✎
            </button>
          </div>

          {/* Estadísticas: Nivel, Victorias, etc. */}
          <div className="user-info">
            <h3 className="level">Nivel 15</h3>
            <p className="wins">Partidas ganadas: 24</p>
          </div>
        </div>
      ) : (
        /* Si estoy editando, muestro la galería de avatares */
        <div className="avatar-selector">
          <div className="selector-header">
            <h3>Elige tu avatar</h3>
            <button className="back-button" onClick={() => setIsEditing(false)}>
              ← Volver
            </button>
          </div>

          <div className="avatar-grid">
            {avatarList.map((avatar) => (
              <img
                key={avatar.id}
                src={avatar.url}
                alt={avatar.name}
                className={
                  currentAvatar === avatar.url
                    ? "avatar-item active"
                    : "avatar-item"
                }
                onClick={() => {
                  onSelectAvatar(avatar.url);
                  setIsEditing(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
