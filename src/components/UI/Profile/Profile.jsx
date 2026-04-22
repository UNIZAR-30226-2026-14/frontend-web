import { useState } from "react";
import "./profile.css";
import { AVATAR_LIST } from "../../../data/itemData";
import alex from "../../../assets/avatars/alex.png";

function Profile({
  onClose,
  currentAvatar,
  setUserAvatar,
  avatarList,
  userId,
  user,
  coins,
  level,
  stats,
  onRemoveFriend,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHoveringRemove, setIsHoveringRemove] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const canEditAvatar = Boolean(setUserAvatar) && avatarList.length > 0;
  const isFriendProfile = !canEditAvatar;

  const porcentajeVictorias =
    stats.finished > 0 ? Math.round((stats.wins / stats.finished) * 100) : 0;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setUserAvatar(imageUrl);
      setIsEditing(false);
    };

    reader.readAsDataURL(file);
  };

  const avatarSeleccionado =
    AVATAR_LIST.find((a) => a.id === currentAvatar) || alex;

  return (
    <div className="profile-stats">
      <button className="close-button" onClick={onClose}>
        X
      </button>

      {!isEditing ? (
        <div className="profile-card">
          <div className="profile-header">
            <h1>Perfil de jugador</h1>
          </div>

          {isFriendProfile && (
            <div className="friend-action-row">
              <button
                className={`friend-action-button ${isHoveringRemove ? "danger" : ""}`}
                onMouseEnter={() => setIsHoveringRemove(true)}
                onMouseLeave={() => setIsHoveringRemove(false)}
                onClick={() => setShowRemoveConfirm(true)}
                type="button"
              >
                {isHoveringRemove ? "Eliminar" : "Amigos"}
              </button>
            </div>
          )}

          <div className="avatar-container">
            <img
              src={currentAvatar}
              alt="Avatar de perfil"
              className="main-avatar"
            />
            {canEditAvatar && (
              <button
                className="edit-pencil"
                onClick={() => setIsEditing(true)}
                title="Cambiar avatar"
              >
                ✎
              </button>
            )}
          </div>

          <div className="profile-main-data">
            <div className="data-row">
              <span className="data-label">ID</span>
              <span className="data-value">#{userId}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Nombre</span>
              <span className="data-value">{user.nombre || "Invitado"}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Monedas</span>
              <span className="data-value">{coins}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Nivel</span>
              <span className="data-value">{level}</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-label">Partidas ganadas</p>
              <p className="stat-value">{stats.wins}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Partidas perdidas</p>
              <p className="stat-value">{stats.losses}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Partidas empatadas</p>
              <p className="stat-value">{stats.draws}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Partidas pendientes</p>
              <p className="stat-value">{stats.pending}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Partidas finalizadas</p>
              <p className="stat-value">{stats.finished}</p>
            </div>
            <div className="stat-box highlight">
              <p className="stat-label">% de victoria</p>
              <p className="stat-value">{porcentajeVictorias}%</p>
            </div>
          </div>

          {showRemoveConfirm && (
            <div className="confirm-remove-overlay">
              <div className="confirm-remove-card">
                <p>Seguro que quieres eliminar a este amigo?</p>
                <div className="confirm-remove-actions">
                  <button
                    type="button"
                    className="confirm-cancel"
                    onClick={() => setShowRemoveConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="confirm-delete"
                    onClick={() => {
                      onRemoveFriend?.(userId);
                      setShowRemoveConfirm(false);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : canEditAvatar ? (
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
                  setUserAvatar(avatar.url);
                  setIsEditing(false);
                }}
              />
            ))}

            <label className="avatar-item upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
              <span className="upload-icon">+</span>
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
