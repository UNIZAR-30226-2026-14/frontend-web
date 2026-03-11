import { sileo, Toaster } from 'sileo';
import './Shop.css'

// Datos de test (simulan la respuesta del Backend)
const BACKGROUNDS = [
  { id: 'classic', name: 'Verde Clásico', price: 0, value: '#2e7d32', owned: true },
  { id: 'midnight', name: 'Azul Nocturno', price: 500, value: '#1a237e', owned: false },
  { id: 'lava', name: 'Rojo Condente', price: 1000, value: '#d32f2f', owned: false },
  { id: 'gold', name: 'Oro, "Pa que aiga lujo"', price: 5000, value: 'gold', owned: false },
];

function Shop({onClose, coins, setCoins, currentBackground, setCurrentBackground, addXp}){

  const handleAction = (item) => {
    if(item.owned){
      setCurrentBackground(item.value);
    } else {
      if(coins >= item.price){
        setCoins(coins - item.price);
        item.owned = true;
        setCurrentBackground(item.value);
        addXp(50);
      } else {
        sileo.error({
          title: "Fondos insuficientes",
          description: (
            <span className='insufficent-founds'>No tienes suficientes monedas para comprar este fondo. ¡Sigue jugando para ganar más!</span>
          ),
        });
      }
    }
  };

  return (
    <div className="shop-popup">
      <Toaster position='top-center'/>
      <div className='shop-header'>
        <h2>Tienda</h2>
        <button className='close-button' onClick={onClose}>X</button>
      </div>
      
      <div className='shop-sections'>
        <h3>Tableros</h3>
        <div className='backgrounds-list'>
          {BACKGROUNDS.map((bg) => (
            <div key={bg.id} className={`background-card ${currentBackground === bg.value ? 'active' : ''}`}>
              <div className='color-preview' style={{background: bg.value}}/>
              <span className='background-name'>{bg.name}</span>
              <button onClick={() => handleAction(bg)}>{bg.owned ? (currentBackground === bg.value ? 'Equipado' : 'Equipar') : `${bg.price}`}</button>
            </div>
          ))}
        </div>

        {/* Añade esto debajo de la lista de tableros */}
        <div className='shop-sections'>
          <h3>Skins de Fichas</h3>
          <div className='skins-list'>
            <p className="coming-soon">Próximamente...</p>
          </div>
        </div>

        <div className='shop-sections real-money'>
          <h3>Obtener Monedas</h3>
          <div className='money-packs'>
            <div className='pack-card'>
              <span>5000 💰</span>
              <button className='fake-pay' onClick={() => setCoins(coins + 5000)}>4.99€</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;