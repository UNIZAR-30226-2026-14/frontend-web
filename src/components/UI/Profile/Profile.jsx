import { useState } from 'react';
import './Profile.css'

function Profile({onClose, currentAvatar, onSelectAvatar, opciones}){
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-stats">
      <button className='close-button' onClick={onClose}>x</button>

      {/* SI NO ESTOY EDITANDO: Muestro Perfil y Stats */}
      {!isEditing ? (
        <div className="stats-view">
          <h2>Perfil</h2>
          <div className="avatar-container">
            <img src={currentAvatar} alt='avatar' className="main-avatar"/>
            <button className="edit-pencil" onClick={() => setIsEditing(true)}>✎</button>
          </div>
          {/* Aquí irían tus estadísticas: Nivel, Victorias, etc. */}
          <div className="user-info">
            <h3>Nivel 15</h3>
            <p>Partidas ganadas: 24</p>
          </div>
        </div>
      ) : (
        /* SI ESTOY EDITANDO: Muestro la Galería */
        <div className="avatar-selector">
          <div className="selector-header">
            <button className="back-button" onClick={() => setIsEditing(false)}>← Volver</button>
            <h3>Elige tu avatar</h3>
          </div>
          
          <div className="avatar-grid">
            {opciones.map((avatar) => (
              <img 
                key={avatar.id} 
                src={avatar.url} 
                alt={avatar.name}
                className={currentAvatar === avatar.url ? 'avatar-item active' : 'avatar-item'}
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