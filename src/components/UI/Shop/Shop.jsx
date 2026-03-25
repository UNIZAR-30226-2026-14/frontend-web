import { sileo, Toaster } from "sileo";
import "./shop.css";

// Datos de test (simulan la respuesta del Backend)
const BACKGROUNDS = [
  {
    id: "classic",
    name: "Verde Clásico",
    price: 0,
    value: "#2e7d32",
    owned: true,
  },
  {
    id: "midnight",
    name: "Azul Nocturno",
    price: 500,
    value: "#1a237e",
    owned: false,
  },
  {
    id: "lava",
    name: "Rojo Condente",
    price: 1000,
    value: "#d32f2f",
    owned: false,
  },
  {
    id: "gold",
    name: 'Oro, "Pa que aiga lujo"',
    price: 5000,
    value: "gold",
    owned: false,
  },
];

function Shop({
  onClose,
  coins,
  setCoins,
  currentBackground,
  setCurrentBackground,
  addXp,
  ownedBgs,
  setOwnedBgs,
}) {
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
        localStorage.setItem("rummi-bgs", JSON.stringify(updatedOwned));
        setCurrentBackground(bg.value);
        sileo.success({
          title: "¡Compra realizada!",
          description: `Has desbloqueado ${bg.name}`,
        });
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
      {/* Toaster para las notificaciones */}
      <Toaster position="top-center" />
      <h2 className="shop-title">Tienda</h2>
      <button className="close-button" onClick={onClose}>
        X
      </button>
      {/* Sección de tableros */}
      <div className="shop-sections">
        <h3 className="bg-title">Tableros</h3>
        <div className="backgrounds-list">
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

        {/* Skins para las fichas */}
        <div className="shop-sections">
          <h3 className="tile-title">Skins de Fichas</h3>
          <div className="skins-list">
            <p className="coming-soon">Próximamente...</p>
          </div>
        </div>

        {/* Sección de monedas */}
        <div className="shop-sections real-money">
          <h3 className="coins-title">Obtener Monedas</h3>
          <div className="money-packs">
            <div className="pack-card">
              <span>5000 💰</span>
              <button
                className="fake-pay"
                onClick={() => setCoins(coins + 5000)}
              >
                4.99€
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
