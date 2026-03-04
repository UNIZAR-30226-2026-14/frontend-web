import './Profile.css'

function Profile({onClose}) {
  return (
    <div className="profile-stats">
      <h2>Perfil</h2>
      <button className='close-button' onClick={onClose}>X</button>
    </div>
  );
}

export default Profile;