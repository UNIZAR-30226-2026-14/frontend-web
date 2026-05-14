import { useState } from "react"; // Añadido
import "./powerUpsShop.css";
import { POWER_UPS } from "../../../data/itemData";

function PowerUpsShop({ matchPoints, setMatchPoints, inventory, setInventory, onClose }) {
  // Retoque: Estado para manejar la selección visual
  const [selectedItem, setSelectedItem] = useState(POWER_UPS[0] || null);

  const handleBuyPowerUp = (item) => {
    if (!item) return; // Seguridad

    if (inventory.length >= 3) {
      return;
    }

    if (matchPoints >= item.price) {
      setMatchPoints((prev) => prev - item.price);
      const newItem = { ...item, id: Date.now() }; 
      setInventory([...inventory, newItem]);

      
    } 
  };

  return (
    <div className="shop-popup">
      <button className="close-button" onClick={onClose}>×</button>
      
      {/* Retoque: Grid simplificado para los iconos superiores */}
      <div className="power-ups-grid">
        {POWER_UPS.map((item) => (
          <div 
            key={item.id} 
            className={`item-card ${selectedItem?.id === item.id ? "active" : ""}`}
            onClick={() => setSelectedItem(item)}
          >
            <div className="item-icon">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Retoque: Footer con descripción y botón lateral según image_9469d8.png */}
      <div className="shop-footer">
        <div className="item-description">
          {selectedItem ? selectedItem.description : "Selecciona un objeto"}
        </div>
        
        {selectedItem && (
          <button className="buy-button" onClick={() => handleBuyPowerUp(selectedItem)}>
            <span className="price">{selectedItem.price}</span>
            <span className="coin-emoji">🪙</span>
          </button>
        )}
      </div>
      
    </div>
  );
}

export default PowerUpsShop;
