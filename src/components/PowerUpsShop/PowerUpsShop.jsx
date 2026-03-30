import { sileo, Toaster } from "sileo";
import "./shop.css";

function PowerUpsShop() {
  // Maneja la accion de comprar o equipar un fondo
  const handleAction = (bg) => {
    if (ownedBgs.includes(bg.id)) {
      setCurrentBackground(bg.value);
    } else {
      if (coins >= bg.price) {
        setCoins(coins - bg.price);
        addXp(50);
        const updatedOwned = [...ownedBgs, bg.id];
        setOwnedBgs(updatedOwned);
        localStorage.setItem("rummi-bgs", JSON.stringify(updatedOwned))
        setCurrentBackground(bg.value);
        sileo.success({
          title: "¡Compra realizada!",
          description: `Has desbloqueado ${bg.name}`
        })
      } else {
        sileo.error({
          title: "Fondos insuficientes",
          description: (
            <span className="insufficent-founds">
              No tienes suficientes monedas para comprar este fondo. ¡Sigue
              jugando para ganar más!
            </span>
          ),
        });
      }
    }
  };

  return (
    <div className="shop-popup">
      <h2 className="shop-title">Tienda de Power-ups</h2>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      {/* Sección de tableros */}
      <div className="shop-sections">
        <div className="power-ups-list">
          {BACKGROUNDS.map((bg) => (
            <div
              key={bg.id}
              className={`background-card ${currentBackground === bg.value ? "active" : ""}`}
            >
              <div className="color-preview" style={{ background: bg.value }} />
              <span className="background-name">{bg.name}</span>
              <button onClick={() => handleAction(bg)}>
                {ownedBgs.includes(bg.id)
                  ? currentBackground === bg.value
                    ? "Equipado"
                    : "Equipar"
                  : `${bg.price}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PowerUpsShop;
