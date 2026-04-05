import "./TopMenu.css";
import settings_icon from "../../../assets/settings-icon.svg";

function TopMenu({
  userAvatar,
  user,
  xp,
  xpToNextLevel,
  level,
  togglePopup,
  openOwnProfile,
  setActivePopup,
}) {
  return (
    <div className="top-menu">
      <div className="top-left">
        <div className="profile-section">
          {/* Avatar */}
          <svg className="profile-avatar" viewBox="-50 -50 100 100">
            <defs>
              <pattern
                id="userProfilePattern"
                x="0"
                y="0"
                width="1"
                height="1"
                viewBox="0 0 100 100"
              >
                <image
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  href={userAvatar}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
            <circle
              key={userAvatar}
              className="profile"
              cx={0}
              cy={0}
              r={45}
              fill="url(#userProfilePattern)"
              onClick={openOwnProfile}
            />
          </svg>

          {/* Info: nombre + barra XP + nivel */}
          <div className="profile-info">
            <h1 className="profile-username">{user.nombre || "Invitado"}</h1>
            <div className="xp-row">
              <div className="xp-bar-container">
                <div
                  className="xp-fill"
                  style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                />
                <span className="xp-text">
                  {xp}/{xpToNextLevel}xp
                </span>
              </div>
              <span className="xp-level">Nivel {level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="top-middle">
        {/* Título */}
        <h1 className="title">RUMMIPLUS</h1>
      </div>

      {/* Menú arriba derecha */}
      <div className="top-right">
        {/* Tienda */}
        <div className="shop" onClick={() => togglePopup("shop")}>
          <svg viewBox="0 0 200 50">
            <rect x={0} y={5} width={200} height={50} rx={12} />
            <text x={40} y={37} className="coins">
              {user.monedas}💰
            </text>
            <path
              className="shop-add"
              d="M 157 30 L 183 30 M 170 17 L 170 43"
            />
          </svg>
        </div>

        {/* Ajustes */}
        <div className="settings" onClick={() => togglePopup("settings")}>
          <img src={settings_icon} alt="settings_icon" />
        </div>

        {/* Amigos */}
        <div className="friends-menu">
          <button
            className="hamburger-button"
            aria-label="Abrir lista de amigos"
            onClick={() => setActivePopup("friends")}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
