import "./powerUpsShop.css";
import { POWER_UPS } from "../../data/itemData";
import { sileo, Toaster } from "sileo";

function PowerUpsShop({
  matchPoints,
  setMatchPoints,
  inventory,
  setInventory,
  onClose,
}) {
  const handleBuyPowerUp = (item) => {
    // Verificar si hay espacio en el inventario
    if (inventory.length >= 3) {
      sileo.error({
        title: "Inventario lleno",
        description: "Solo puedes tener 3 power-ups al mismo tiempo.",
      });
      return;
    }

    // Comprobar si tienes suficientes puntos
    if (matchPoints >= item.price) {
      setMatchPoints((prev) => prev - item.price);

      // Añadimos el objeto al inventario
      const newItem = { ...item, id: Date.now() }; // ID único para cada instancia
      setInventory([...inventory, newItem]);

      sileo.success({
        title: "Power-up comprado",
        description: `Has adquirido ${item.name}`,
      });
    } else {
      sileo.error({
        title: "Puntos insuficientes",
        description: `Necesitas ${item.price - matchPoints} puntos más para comprar ${item.name}.`,
      });
    }
  };

  return (
    <div className="shop-popup">
      <h2 className="shop-title">Tienda de Power-ups</h2>
      <div className="match-points-display">{matchPoints} pts</div>

      <button className="close-button" onClick={onClose}>
        X
      </button>

      <div className="shop-sections">
        <div className="power-ups-list">
          {POWER_UPS.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-icon">{item.icon}</div>
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-desc">{item.description}</span>
              </div>
              <button
                className="buy-button"
                onClick={() => handleBuyPowerUp(item)}
              >
                {item.price} 💰
              </button>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default PowerUpsShop;
