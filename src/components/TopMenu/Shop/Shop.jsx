import { sileo, Toaster } from "sileo";
import "./Shop.css";
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

    let updatedOwned = [...(ownedList || [])];

    if (!updatedOwned.includes(item.id)) {
      if (coins >= item.price) {
        updatedOwned.push(item.id);
      } else {
        sileo.error({
          title: "Fondos insuficientes",
          description: "No tienes suficientes monedas.",
        });
        return;
      }
    }

    const formatted = updatedOwned.map((id) =>
      id === item.id ? `*${id}` : id,
    );

    try {
      const isNewPurchase = !ownedList.includes(item.id);
      const newCoins = isNewPurchase ? coins - item.price : coins;

      const purchaseData = {
        monedas: newCoins,
        [isBg ? "skinTablero" : "skinFichas"]: formattedForBackend,
      };

      const success = await profileService.updateProfile(userId, purchaseData);

      if (success) {
        if (isNewPurchase) {
          setCoins(newCoins);
          addXp(50);
          sileo.success({
            title: "¡Compra realizada!",
            description: `Has desbloqueado ${item.name}`,
          });
        }

        setOwnedList(updatedOwned);
        setCurrent(item.value);
      }
    } catch (error) {
      sileo.error({
        title: "Error",
        description: "No se pudo conectar con el servidor.",
      });
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-card">
        <Toaster
          position="top-center"
          options={{
            roundness: 12,
            styles: {
              title: "color: #4fe940 !important; font-weight: 800;",
              description: "color: #1c1a1a !important;",
            },
          }}
        />

        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2 className="shop-title">Tienda</h2>

        <div className="shop-scroll-area">
          <section className="shop-section">
            <h3 className="section-title">Tableros</h3>
            <div className="items-grid">
              {BACKGROUNDS.map((bg) => {
                const isEquipped = currentBackground === bg.value;
                const isOwned = ownedBgs.includes(bg.id);
                return (
                  <div
                    key={bg.id}
                    className={`item-card ${isEquipped ? "active" : ""}`}
                  >
                    <div
                      className="item-preview color-box"
                      style={{ background: bg.value }}
                    />
                    <span className="item-name">{bg.name}</span>
                    <button
                      className={`shop-btn ${isOwned ? "owned" : "buy"}`}
                      onClick={() => handlePurchase(bg, "bg")}
                      disabled={isEquipped}
                    >
                      {isOwned
                        ? isEquipped
                          ? "Equipado"
                          : "Equipar"
                        : `${bg.price} 💰`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="shop-section">
            <h3 className="section-title">Skins de Fichas</h3>
            <div className="items-grid">
              {TILE_SKINS.map((skin) => {
                const isEquipped = currentSkin === skin.value;
                const isOwned = ownedSkins?.includes(skin.id);
                return (
                  <div
                    key={skin.id}
                    className={`item-card ${isEquipped ? "active" : ""}`}
                  >
                    <div
                      className={`item-preview tile-box`}
                      style={{ background: skin.value }}
                    >
                      7
                    </div>
                    <span className="item-name">{skin.name}</span>
                    <button
                      className={`shop-btn ${isOwned ? "owned" : "buy"}`}
                      onClick={() => handlePurchase(skin, "skin")}
                      disabled={isEquipped}
                    >
                      {isOwned
                        ? isEquipped
                          ? "Equipado"
                          : "Equipar"
                        : `${skin.price} 💰`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="shop-section">
            <h3 className="section-title">Créditos</h3>
            <div className="money-packs">
              <div className="pack-card">
                <span className="pack-label">Bolsa de Monedas (5000)</span>
                <button
                  className="pay-btn"
                  onClick={() => setCoins(coins + 5000)}
                >
                  4.99€
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Shop;
