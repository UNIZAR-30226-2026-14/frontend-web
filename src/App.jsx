import { useState } from 'react'
import './App.css'
import Board from './Board.jsx'
import Home from './Home.jsx'
import Loading from './Loading.jsx'

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