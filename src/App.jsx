import { useState } from 'react'
import './App.css'
import Board from './Board.jsx'
import Home from './Home.jsx'

function App() {
  const [isHome, setIsHome] = useState(true);
  const startGame = () => setIsHome(false);

  return (
    <>
      {isHome ? <Home onStart={startGame}/> : <Board />}
    </>
  )
}

export default App