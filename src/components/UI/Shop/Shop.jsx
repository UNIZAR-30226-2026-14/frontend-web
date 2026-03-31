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
    name: "Rojo Candente",
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

const TILE_SKINS = [
  { id: "default", name: "Original", price: 0, value: "skin-default" },
  { id: "neon", name: "Cibernético", price: 800, value: "skin-neon" },
  { id: "marble", name: "Mármol Real", price: 2000, value: "skin-marble" },
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
  currentSkin,
  setCurrentSkin,
  ownedSkins,
  setOwnedSkins,
}) {
  //
  const handlePurchase = (item, type) => {
    const isOwned =
      type === "bg" ? ownedBgs.includes(item.id) : ownedSkins.includes(item.id);

    if (isOwned) {
      type === "bg"
        ? setCurrentBackground(item.value)
        : setCurrentSkin(item.value);
    } else {
      if (coins >= item.price) {
        setCoins(coins - item.price);
        addXp(50);

        let updatedOwned;
        if (type === "bg") {
          updatedOwned = [...ownedBgs, item.id];
          setOwnedBgs(updatedOwned);
          localStorage.setItem("rummi-bgs", JSON.stringify(updatedOwned));
          setCurrentBackground(item.value);
        } else {
          updatedOwned = [...ownedSkins, item.id];
          setOwnedSkins(updatedOwned);
          localStorage.setItem("rummi-skins", JSON.stringify(updatedOwned));
          setCurrentSkin(item.value);
        }

        sileo.success({
          title: "¡Compra realizada!",
          description: `Has desbloqueado ${item.name}`,
        });
      } else {
        sileo.error({
          title: "Fondos insuficientes",
          description: (
            <span className="insufficent-founds">
              No tienes suficientes monedas para comprar este ${type}. ¡Sigue
              jugando para ganar más!
            </span>
          ),
        });
      }
    }
  };

  return (
    <div className="shop-bg">
      <div className="shop-popup">
        <div className="shop-content">
          {/* Toaster para las notificaciones */}
          <Toaster position="top-center" />
          <h2 className="shop-title">Tienda</h2>
          <button className="close-button" onClick={onClose}>
            X
          </button>

          <div className="shop-sections">
            {/* SECCIÓN TABLEROS */}
            <h3 className="bg-title">Tableros</h3>
            <div className="backgrounds-list">
              {BACKGROUNDS.map((bg) => {
                const isEquipped = currentBackground === bg.value;
                const isOwned = ownedBgs.includes(bg.id);
                return (
                  <div
                    key={bg.id}
                    className={`background-card ${isEquipped ? "active" : ""}`}
                  >
                    <div
                      className="color-preview"
                      style={{ background: bg.value }}
                    />
                    <span className="background-name">{bg.name}</span>
                    <button
                      onClick={() => handlePurchase(bg, "bg")}
                      disabled={isEquipped}
                    >
                      {isOwned
                        ? isEquipped
                          ? "Equipado"
                          : "Equipar"
                        : bg.price}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* SECCIÓN SKINS DE FICHAS */}
            <h3 className="tile-title">Skins de Fichas</h3>
            <div className="skins-list">
              {TILE_SKINS.map((skin) => {
                const isEquipped = currentSkin === skin.value;
                const isOwned = ownedSkins.includes(skin.id);
                return (
                  <div
                    key={skin.id}
                    className={`skin-card ${isEquipped ? "active" : ""}`}
                  >
                    <div className={`skin-preview ${skin.value}`}>7</div>
                    <span className="skin-name">{skin.name}</span>
                    <button
                      onClick={() => handlePurchase(skin, "skin")}
                      disabled={isEquipped}
                    >
                      {isOwned
                        ? isEquipped
                          ? "Equipado"
                          : "Equipar"
                        : skin.price}
                    </button>
                  </div>
                );
              })}
            </div>

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
    </div>
  );
}

export default Shop;
