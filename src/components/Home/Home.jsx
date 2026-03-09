import { useState } from 'react';
import './Home.css'
import '../Game/Tile.jsx'
import FriendsList from '../UI/FriendsList/FriendsList.jsx'
import Shop from '../UI/Shop/Shop.jsx'
import Profile from '../UI/Profile/Profile.jsx'
import Settings from '../UI/Settings/Settings.jsx'
import settings_icon from '../../assets/settings-icon.svg'
import alex from '../../assets/avatars/Alex.png'
import dani from '../../assets/avatars/Dani.png'
import dian from '../../assets/avatars/Dian.png'
import fernando from '../../assets/avatars/Fernando.png'
import gonzalo from '../../assets/avatars/Gonzalo.png'
import miguel from '../../assets/avatars/Miguel.png'

const AVATAR_LIST = [
  { id: 1, url: alex, name: 'Alex' },
  { id: 2, url: dani, name: 'Dani' },
  { id: 3, url: dian, name: 'Dian' },
  { id: 4, url: fernando, name: 'Fernando' },
  { id: 5, url: gonzalo, name: 'Gonzalo' },
  { id: 6, url: miguel, name: 'Miguel' },
];

function Home({onStart, username}) {
    const [activePopup, setActivePopup] = useState(null);
    const [userAvatar, setUserAvatar] = useState(alex);
    
    const togglePopup = (popupName) => {
        setActivePopup(activePopup === popupName ? null : popupName)
    }

    return (
        <div className='home-screen'>

            {/* Menú de arriba */}
            <div className='top-menu'>

                {/* Perfil */}
                <div className='profile-name'>
                    <svg width={100} height={100} viewBox='-50 -50 100 100'>
                        <defs>
                            {/* Definimos el patrón con la imagen del estado */}
                            <pattern id={`userPhoto-${userAvatar}`} x="0" y="0" width="1" height="1" viewBox="0 0 100 100">
                                <image x="0" y="0" width="100" height="100" href={userAvatar} preserveAspectRatio="xMidYMid slice" />
                            </pattern>
                        </defs>
                        <circle key={userAvatar} className='profile' cx={0} cy={-5} r={40} fill='url(#userPhoto)' onClick={() => togglePopup('profile')}/>
                        <circle className='level' cx={35} cy={-30} r={15}/>
                    </svg>
                    <h1>{username || 'Invitado'}</h1>
                </div>
                {/*  */}

                {/* Título */}
                <h1 className='title'>RUMMIPLUS</h1>

                <div className='top-menu-right'>
                    {/* Amigos */}
                    <div className='friends' onClick={() => togglePopup('friends')}>
                        <svg width={100} height={100} viewBox='-50 -50 100 100'>
                            <circle className='friends-background' cx={0} cy={-5} r={40}/>
                            <g className='friends-icon'>
                                <circle cy="-25" r="15"/>
                                <path d="M -25 25 C -25 -17 25 -17 25 25 Z"/>
                            </g>
                        </svg>
                    </div>

                    {/* Tienda */}
                    <div className='shop' onClick={() => togglePopup('shop')}>
                        <svg width={150} height={100} viewBox='0 0 200 50'>
                            <rect x={0} y={-15} width={200} height={50} rx={12}/>
                            <path className='shop-add' d="M 157 11 L 183 11 M 170 -2 L 170 24"/>
                        </svg>
                    </div>

                    {/* Ajustes */}
                    <div className='settings' onClick={() => togglePopup('settings')}>
                        <img src={settings_icon} alt='settings_icon'/>
                    </div>
                </div>
            </div>

            {/* Pop-up del perfil */}
            {activePopup === 'profile' && (
                <Profile onClose={() => togglePopup('profile')} currentAvatar={userAvatar} onSelectAvatar={setUserAvatar} opciones={AVATAR_LIST}/>
            )}

            {/* Pop-up de los amigos */}
            {activePopup === 'friends' && (
                <FriendsList onClose={() => togglePopup('friends')}/>
            )}

            {/* Pop-up de la tienda */}
            {activePopup === 'shop' && (
                <Shop onClose={() => togglePopup('shop')}/>
            )}

            {/* Pop-up de los ajustes */}
            {activePopup === 'settings' && (
                <Settings onClose={() => togglePopup('settings')}/>
            )}

            {/* Modos de juego */}
            <div className='gamemodes'>

                {/* Modo normal */}
                <div className='gamemode-card' onClick={onStart}>
                    <svg width={300} height={450}>
                        <g>
                            <rect className='regular-background' x={50} y={25} width={250} height={400} rx={10}/>
                            <text className='gamemode-title' x={100} y={75}>Modo Clásico</text>
                            <rect className='tile-bottom' x={120} y={125} width={150} height={200} rx={8}/>
                            <rect className='tile-top' x={120} y={125} width={150} height={200} rx={8}/>
                        </g>
                    </svg>
                </div>

                {/* Modo con power-ups */}
                <div className='gamemode-card'>
                    <svg width={300} height={450}>
                        <g>
                            <rect className='enhanced-background' x={50} y={25} width={250} height={400} rx={10}/>
                            <text className='gamemode-title' x={100} y={75}>Modo Arcade</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Home;