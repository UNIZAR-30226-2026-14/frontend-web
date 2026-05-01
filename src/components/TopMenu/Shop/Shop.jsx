import { sileo, Toaster } from "sileo";
import "./shop.css";
import { BACKGROUNDS, TILE_SKINS } from "../../../data/itemData";
import { profileService } from "../../../services/gameService";

function Shop({
  userId,
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
  const handlePurchase = async (item, type) => {
    const isBg = type === "bg";
    const ownedList = isBg ? ownedBgs : ownedSkins;
    const setOwnedList = isBg ? setOwnedBgs : setOwnedSkins;
    const setCurrent = isBg ? setCurrentBackground : setCurrentSkin;

    if (ownedList?.includes(item.id)) {
      setCurrent(item.value);
      return;
    }

    if (coins >= item.price) {
      try {
        const newCoins = coins - item.price;
        const updatedOwned = [...(ownedList || []), item.id];

        const purchase = {
          monedas: newCoins,
          [isBg ? "skinTablero" : "skinFichas"]: updatedOwned.join(","),
        };

        const success = await profileService.updateProfile(userId, purchase);

        if (success) {
          setCoins(newCoins);
          setOwnedList(updatedOwned);
          setCurrent(item.value);
          addXp(50);
          sileo.success({
            title: "¡Compra realizada!",
            description: `Has desbloqueado ${item.name}`,
          });
        } else {
          throw new Error("Error en el servidor.");
        }
      } catch (error) {
        sileo.error({
          title: "Error en la transacción",
          description: "No se pudo conectar con el servidor.",
        });
      }
    } else {
      sileo.error({
        title: "Fondos insuficientes",
        description: (
          <span className="insufficent-founds">
            No tienes suficientes monedas para comprar este ${type}.
          </span>
        ),
      });
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
                const isOwned = ownedSkins?.includes(skin.id);
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
