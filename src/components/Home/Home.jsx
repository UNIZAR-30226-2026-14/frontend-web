import { useState } from 'react';
import './Home.css'
import '../Game/Tile.jsx'
import FriendsList from '../UI/FriendsList/FriendsList.jsx'
import Shop from '../UI/Shop/Shop.jsx'
import Profile from '../UI/Profile/Profile.jsx'
import Settings from '../UI/Settings/Settings.jsx'
import settings from '../../assets/settings-icon.svg'

function Home({onStart, username}) {
    const [activePopup, setActivePopup] = useState(null);
    
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
                        <circle className='profile' cx={0} cy={-5} r={40} onClick={() => togglePopup('profile')}/>
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
                        <img src={settings} alt='settings'/>
                    </div>
                </div>
            </div>

            {/* Pop-up del perfil */}
            {activePopup === 'profile' && (
                <Profile onClose={() => togglePopup('profile')}/>
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