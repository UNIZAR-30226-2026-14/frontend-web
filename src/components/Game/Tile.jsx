import './tile.css'
import rojo from '../../assets/j-rojo.svg'
import negro from '../../assets/j-negro.svg'

function sign(number, color) {
  if (number != 'J') {
    return(
      <h3>
      { 
        {
          'red' : '♡',
          'blue': '♢',
          'orange': '♧',
          'black': '♤'
        }[color]
      }
    </h3>);
    }

  else
    return (<h3></h3>);
}

function comodin(number, color) {
  if (number === 'J') {
    if (color === 'red') {
      return(<img src={rojo}/>);
    }
    else {
      return(<img src={negro}/>);
    }
    
    }
  else 
    return (number);
}

const Tile = ({ number, color }) => (
  <div className='tile' style={{color: color}}>
    {comodin(number,color)}
    {sign(number,color)}
    
  </div>
);

export default Tile;