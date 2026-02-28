import { useState } from 'react';
import './Home.css'
import './Tile'

function Home({onStart}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    return (
        <div className='home-screen'>
            <div className='top-menu'>
                <svg width={100} height={100} viewBox='-50 -50 100 100'>
                    <circle className='profile' cx={0} cy={-5} r={40} onClick={toggleProfile}/>
                    <circle className='level' cx={35} cy={-30} r={15}/>
                </svg>
                <h1 className='title'>RUMMIPLUS</h1>
                <svg width={150} height={100} viewBox='0 0 200 50'>
                    <rect className='shop' x={0} y={-15} width={200} height={50} rx={12}/>
                </svg>
            </div>
            {isProfileOpen && (
                <div className="profile-overlay">
                    <button className='close-button' onClick={toggleProfile}>X</button>
                </div>
            )}
            <svg width={800} height={2000}>
                <rect className='regular-match' x={0} y={20} width={200} height={400}/>
            </svg>
            <button onClick={onStart}>Jugar</button>
        </div>
    )
}

export default Home;