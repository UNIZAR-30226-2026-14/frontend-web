import { useState } from 'react'
import './App.css'
import Board from './components/Game/Board.jsx'
import Home from './components/Home/Home.jsx'
import Loading from './components/Loading/Loading.jsx'

function App() {
  const [isHome, setIsHome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const startGame = () => {
    setIsHome(false);
    setIsLoading(true);
  }

  return (
    <>
      {isHome && <Home onStart={startGame}/>}

      {!isHome && isLoading && (<Loading onFinished={() => setIsLoading(false)}/>)}
      
      {!isHome && !isLoading && <Board/>}
    </>
  )
}

export default App