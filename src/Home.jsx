import { useState } from 'react';
import './Home.css'
import './Tile'
import './FriendsList'
import FriendsList from './FriendsList';

function Home({onStart}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isFriendsOpen, setIsFriendsOpen] = useState(false);

    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const toggleFriends = () => setIsFriendsOpen(!isFriendsOpen);

    return (
        <div className='home-screen'>
            <div className='top-menu'>
                <svg width={100} height={100} viewBox='-50 -50 100 100'>
                    <circle className='profile' cx={0} cy={-5} r={40} onClick={toggleProfile}/>
                    <circle className='level' cx={35} cy={-30} r={15}/>
                </svg>

                <h1 className='title'>RUMMIPLUS</h1>

                <svg width={100} height={100} viewBox='-50 -50 100 100'>
                    <circle className='friends' cx={0} cy={-5} r={40} onClick={toggleFriends}/>
                    <g className='friends-icon' onClick={toggleFriends}>
                        <circle cy="-25" r="15"/>
                        <path d="M -25 25 C -25 -17 25 -17 25 25 Z"/>
                    </g>
                </svg>

                <svg width={150} height={100} viewBox='0 0 200 50'>
                    <rect className='shop' x={0} y={-15} width={200} height={50} rx={12}/>
                    <path className d="M 0 0 L 0 25"/>
                </svg>
            </div>

            {isProfileOpen && (
                <div className="profile-overlay">
                    <button className='close-button' onClick={toggleProfile}>X</button>
                </div>
            )}

            {isFriendsOpen && (
                <div>
                    <FriendsList onClose={toggleFriends}/>
                </div>
            )}

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