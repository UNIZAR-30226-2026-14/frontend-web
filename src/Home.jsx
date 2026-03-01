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
            <svg width={800} height={1000}>
                <g>
                    <rect className='regular-match' x={50} y={25} width={250} height={400} rx={10} onClick={onStart}/>
                    
                    <rect className='tile' x={80} y={50} width={90} height={150}/>
                    <rect className='tile' x={80} y={150} width={90} height={150} fill='magenta'/>
                </g>
            </svg>
        </div>
    )
}

export default Home;