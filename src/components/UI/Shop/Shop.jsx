import './Shop.css'

// Datos de test (simulan la respuesta del Backend)
const BACKGROUNDS = [
  { id: 'classic', name: 'Verde Casino', price: 0, value: '#2e7d32', owned: true },
  { id: 'midnight', name: 'Azul Noche', price: 500, value: '#1a237e', owned: false },
  { id: 'lava', name: 'Infierno', price: 1000, value: '#d32f2f', owned: false },
  { id: 'gold', name: 'Edición Oro', price: 5000, value: 'gold', owned: false },
];

function Shop({onClose}) {
  return (
    <div className="shop-popup">
      <h2>Tienda</h2>
      <button className='close-button' onClick={onClose}>X</button>
      <div className="backgrounds-list">
        {BACKGROUNDS.map((background) => (
          <div key={background.id} className="background-card">
            <div className='color-preview' style={{background: background.value}}/>
            <span className="background-name">{background.name}</span>
            <button>{background.owned ? 'Equipar' : background.price + '€'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;