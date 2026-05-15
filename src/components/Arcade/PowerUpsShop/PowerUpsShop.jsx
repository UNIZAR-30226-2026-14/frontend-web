import { useState, useMemo } from "react";
import "./powerUpsShop.css";
import { POWER_UPS } from "../../../data/itemData";
import { gameService } from "../../../services/gameService.js";

function PowerUpsShop({ gallery, matchPoints, setMatchPoints, inventory, setInventory, onClose, gameId, discount }) {
  
  // 1. Filtramos los POWER_UPS para que solo aparezcan los que están en gallery
  // Usamos useMemo para que no se recalcule en cada render si no cambia gallery
  const itemsInShop = useMemo(() => {
    return POWER_UPS.filter(item => gallery.includes(item.id));
  }, [gallery]);

  // 2. Estado inicial: Seleccionamos el primer objeto de la galería filtrada
  const [selectedItem, setSelectedItem] = useState(itemsInShop[0] || null);

  const handleBuyPowerUp = (item) => {
    if (!item) return;

    if (inventory.length >= 3) {
      alert("Inventario lleno"); // Opcional: feedback visual
      return;
    }

    console.log(item.id);
    //(gameService.buyItem(gameId, item.id) && (matchPoints >= item.price))
    if (gameService.buyItem(gameId, item.id) && (matchPoints >= item.price)) {
      setMatchPoints((prev) => prev - item.price);
      
      const newItem = { 
        ...item, 
        instanceId: Date.now() // Usamos instanceId para la key de React si es necesario
      }; 

      setInventory([...inventory, newItem]); onClose();
    } 
  };

  return (
    <div className="shop-popup">
      <button className="close-button" onClick={onClose}>×</button>
      
      <div className="power-ups-grid">
        {/* Renderizamos solo los items filtrados */}
        {itemsInShop.map((item) => (
          <div 
            key={item.id} 
            className={`item-card ${selectedItem?.id === item.id ? "active" : ""}`}
            onClick={() => setSelectedItem(item)}
          >
            <div className="item-icon">{item.icon}</div>
            <div className="item-name-mini">{item.name}</div>
          </div>
        ))}
      </div>

      <div className="shop-footer">
        <div className="item-description">
          {selectedItem ? (
            <>
              <strong>{selectedItem.name}</strong>
              <p>{selectedItem.description}</p>
            </>
          ) : (
            "Selecciona un objeto"
          )}
        </div>
        
        {selectedItem && (
          <button className="buy-button" onClick={() => handleBuyPowerUp(selectedItem)}>
            <span className="price">{discount ? (Math.floor(selectedItem.price/2)) : (selectedItem.price)}</span>
            <span className="coin-emoji">🪙</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default PowerUpsShop;