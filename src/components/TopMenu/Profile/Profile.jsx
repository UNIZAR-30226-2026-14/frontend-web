import { useState, useEffect } from "react";
import "./Profile.css";
import { getAvatarDisplay } from "../../../data/itemData";
import { profileService } from "../../../services/gameService";
import { sileo } from "sileo";
import { LogOut } from "lucide-react";

function Profile({
  onClose,
  onLogout,
  currentAvatar,
  setUserAvatar,
  avatarList,
  myId,
  userId,
  user,
  onNameChange,
  coins,
  stats,
  onRemoveFriend,
}) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.nombre || "");
  const [displayName, setDisplayName] = useState(user.nombre || "Invitado");

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
      setIsEditingAvatar(false);
    };

    reader.readAsDataURL(file);
  };

  const handleChangeAvatar = async (avatarId) => {
    const succes = await profileService.updateProfile(userId, {
      urlImgPerfil: avatarId,
    });

    if (succes) {
      setUserAvatar(getAvatarDisplay(avatarId));
      setIsEditingAvatar(false);
    } else {
      sileo.error({
        title: "Error de conexión.",
        description: "No se pudo actualizar el avatar en el servidor.",
      });
    }
  };

  useEffect(() => {
    setDisplayName(user.nombre);
  }, [user.nombre]);

  const handleChangeUsername = async (newUsername) => {
    if (myId !== userId) return;

    if (!newUsername || newUsername === user.nombre) {
      setIsEditingName(false);
      return;
    }

    const success = await profileService.updateProfile(userId, {
      nombre: newUsername,
    });

    if (success) {
      onNameChange(newUsername);
      setIsEditingName(false);

      sileo.success({ title: "Nombre actualizado" });
    } else {
      setTempName(user.nombre);
      alert("El nombre ya existe o no se pudo actualizar.");
    }
  };

  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");

  const handlePasswordChange = async () => {
    if (myId !== userId) return;

    if (newPass.length < 6) {
      sileo.error({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    const success = await profileService.updatePassword(
      userId,
      oldPass,
      newPass,
    );

    if (success) {
      sileo.success({ title: "Contraseña actualizada" });
      setIsChangingPass(false);
      setOldPass("");
      setNewPass("");
    } else {
      sileo.error({
        title: "Error",
        description:
          "La contraseña actual es incorrecta o hubo un error de red.",
      });
    }
  };

  return (
    <div className="profile-stats">
      <button className="close-button" onClick={onClose}>
        X
      </button>

      {!isEditingAvatar ? (
        <div className="profile-card">
          <div className="profile-header">
            <h1>Perfil de jugador</h1>

            <button
              className="logout-button"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              {myId === userId && <LogOut size={25} color="#ff4444" />}
            </button>
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
              src={getAvatarDisplay(currentAvatar)}
              alt="Avatar de perfil"
              className="main-avatar"
            />
            {canEditAvatar && (
              <button
                className="edit-pencil"
                onClick={() => setIsEditingAvatar(true)}
                title="Cambiar avatar"
              >
                ✎
              </button>
            )}
          </div>

          <div className="profile-main-data">
            <div className="data-row">
              <span className="data-label">Nombre</span>
              <div className="name-edit-container">
                {isEditingName ? (
                  <input
                    className="name-input"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => {
                      handleChangeUsername(tempName);
                      setIsEditingName(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleChangeUsername(tempName);
                        setIsEditingName(false);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="value-with-pencil"
                    onClick={() => {
                      if (myId === userId) {
                        setIsEditingName(true);
                      }
                    }}
                    style={{ cursor: myId === userId ? "pointer" : "default" }}
                  >
                    <div />
                    <span className="data-value">{displayName}</span>{" "}
                    {canEditAvatar ? (
                      <span className="edit-pencil-small">✎</span>
                    ) : (
                      <div />
                    )}
                  </div>
                )}
              </div>
            </div>

            {myId === userId && (
              <div className="data-row">
                <span className="data-label">Contraseña</span>
                <div className="password-edit-container">
                  {isChangingPass ? (
                    <div className="pass-input-group stack">
                      <input
                        type="password"
                        className="name-input"
                        placeholder="Contraseña actual"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        autoFocus
                      />
                      <input
                        type="password"
                        className="name-input"
                        placeholder="Nueva contraseña"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                      <div className="pass-actions">
                        <button
                          className="btn-save-small"
                          onClick={handlePasswordChange}
                        >
                          OK
                        </button>
                        <button
                          className="btn-cancel-small"
                          onClick={() => {
                            setIsChangingPass(false);
                            setOldPass("");
                            setNewPass("");
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="change-pass-link"
                      onClick={() => setIsChangingPass(true)}
                    >
                      <div />
                      <span className="data-value">********</span>
                      <span className="edit-pencil-small">✎</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="data-row">
              <span className="data-label">ID</span>
              <span className="data-value">#{userId}</span>
            </div>

            <div className="data-row">
              <span className="data-label">Monedas</span>
              <span className="data-value">{coins}</span>
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
            <button
              className="back-button"
              onClick={() => setIsEditingAvatar(false)}
            >
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
                  currentAvatar === avatar.name
                    ? "avatar-item active"
                    : "avatar-item"
                }
                onClick={() => handleChangeAvatar(avatar.id)}
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
