import { useState } from "react";
import "./home.css";
import FriendsList from "../UI/FriendsList/FriendsList.jsx";
import Shop from "../UI/Shop/Shop.jsx";
import Profile from "../UI/Profile/Profile.jsx";
import Settings from "../UI/Settings/Settings.jsx";
import settings_icon from "../../assets/settings-icon.svg";

import alex from "../../assets/avatars/alex.png";
import dani from "../../assets/avatars/dani.png";
import dian from "../../assets/avatars/dian.png";
import fernando from "../../assets/avatars/fernando.png";
import gonzalo from "../../assets/avatars/gonzalo.png";
import miguel from "../../assets/avatars/miguel.png";

// Lista de avatares disponibles para el perfil
const AVATAR_LIST = [
  { id: 1, url: alex, name: "Alex" },
  { id: 2, url: dani, name: "Dani" },
  { id: 3, url: dian, name: "Dian" },
  { id: 4, url: fernando, name: "Fernando" },
  { id: 5, url: gonzalo, name: "Gonzalo" },
  { id: 6, url: miguel, name: "Miguel" },
];

function Home({
  onStart,
  username,
  onLogout,
  setCurrentBackground,
  currentBackground,
  coins,
  setCoins,
  level,
  xp,
  addXp,
  xpToNextLevel,
  userAvatar,
  setUserAvatar,
  ownedBgs,
  setOwnedBgs,
  currentSkin,
  setCurrentSkin,
  ownedSkins,
  setOwnedSkins,
  showConfetti,
  setShowConfetti,
}) {
  // Estado para controlar qué popup está abierto actualmente.
  const [activePopup, setActivePopup] = useState(null);

  /**
   * Alterna la visibilidad de los popups. Si el popup ya está abierto,
   * lo cierra.
   * @param {string} popupName - Nombre del popup a mostrar ("profile", "friends", "shop", "settings").
   */
  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  return (
    <div className="home-screen">
      {/* Barra superior */}
      <div className="top-menu">
        <div className="top-left">
          {/* Perfil */}
          <div className="profile-name">
            <svg viewBox="-50 -50 100 100">
              <defs>
                {/* Patrón para mostrar el avatar en el círculo designado para ello. */}
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
                cy={-5}
                r={40}
                fill="url(#userProfilePattern)"
                onClick={() => togglePopup("profile")}
              />

              {/* Nivel */}
              <g>
                <circle className="level-bg" cx={35} cy={-30} r={15} />
                <text
                  className="level"
                  x={35}
                  y={-30}
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {level}
                </text>
              </g>
            </svg>

            {/* Nombre de usuario */}
            <h1>{username || "Invitado"}</h1>
          </div>

          {/* Barra de experiencia */}
          <div className="experience">
            <div className="xp-bar-container">
              <div
                className="xp-fill"
                style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
              />
            </div>
            <span className="xp">
              {xp} / {xpToNextLevel} XP
            </span>
          </div>
        </div>

        <div className="top-middle">
          {/* Título */}
          <h1 className="title">RUMMIPLUS</h1>
        </div>

        {/* Menú arriba derecha */}
        <div className="top-right">
          {/* Amigos */}
          <div className="friends" onClick={() => togglePopup("friends")}>
            <svg viewBox="-50 -50 100 100">
              <circle className="friends-background" cx={0} cy={-5} r={40} />
              <g className="friends-icon">
                <circle cy="-25" r="15" />
                <path d="M -25 25 C -25 -17 25 -17 25 25 Z" />
              </g>
            </svg>
          </div>

          {/* Tienda */}
          <div className="shop" onClick={() => togglePopup("shop")}>
            <svg viewBox="0 0 200 50">
              <rect x={0} y={5} width={200} height={50} rx={12} />
              <text x={40} y={37} className="coins">
                {coins}💰
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
        </div>
      </div>

      {/* Pop-up del perfil */}
      {activePopup === "profile" && (
        <Profile
          onClose={() => togglePopup("profile")}
          currentAvatar={userAvatar}
          setUserAvatar={setUserAvatar}
          avatarList={AVATAR_LIST}
        />
      )}

      {/* Pop-up de los amigos */}
      {activePopup === "friends" && (
        <FriendsList onClose={() => togglePopup("friends")} />
      )}

      {/* Pop-up de la tienda */}
      {activePopup === "shop" && (
        <Shop
          onClose={() => togglePopup("shop")}
          coins={coins}
          setCoins={setCoins}
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          addXp={addXp}
          ownedBgs={ownedBgs}
          setOwnedBgs={setOwnedBgs}
          currentSkin={currentSkin}
          setCurrentSkin={setCurrentSkin}
          ownedSkins={ownedSkins}
          setOwnedSkins={setOwnedSkins}
        />
      )}

      {/* Pop-up de los ajustes */}
      {activePopup === "settings" && (
        <Settings onClose={() => togglePopup("settings")} onLogout={onLogout} />
      )}

      {/* Selector de modos de juego */}
      <div className="gamemodes">
        {/* Modo normal */}
        <div className="gamemode-card" onClick={onStart}>
          <svg viewBox="0 0 300 450">
            <g>
              <rect
                className="regular-background"
                x={25}
                y={25}
                width={250}
                height={400}
                rx={10}
              />
              <text className="gamemode-title" x={75} y={75}>
                Modo Clásico
              </text>
              <rect
                className="tile-bottom"
                x={95}
                y={125}
                width={150}
                height={200}
                rx={8}
              />
              <rect
                className="tile-top"
                x={95}
                y={125}
                width={150}
                height={200}
                rx={8}
              />
            </g>
          </svg>
        </div>

        {/* Modo con power-ups */}
        <div className="gamemode-card">
          <svg viewBox="0 0 300 450">
            <g>
              <rect
                className="enhanced-background"
                x={25}
                y={25}
                width={250}
                height={400}
                rx={10}
              />
              <text className="gamemode-title" x={75} y={75}>
                Modo Arcade
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Home;
