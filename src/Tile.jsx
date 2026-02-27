import './Tile.css'

let sig


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

function comodin(number) {
  if (number === 'J') {
    return(<h1>{'🃏︎'}</h1>);
    }

  else
    return (number);
}

const Tile = ({ number, color }) => (
  <div className='tile' style={{color: color}}>
    {comodin(number)}
    {sign(number,color)}
    
  </div>
);

export default Tile;