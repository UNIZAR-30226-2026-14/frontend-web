import { sileo } from "sileo";
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
    const isNewPurchase = !ownedList.includes(item.id);

    if (isNewPurchase && coins < item.price) {
      sileo.error({ title: "Fondos insuficientes" });
      return;
    }

    const updatedOwned = isNewPurchase
      ? [...ownedList, item.id]
      : [...ownedList];
    const formattedString = updatedOwned
      .map((id) => (id === item.id ? `*${id}` : id.replace("*", "")))
      .join(",");

    const newCoins = isNewPurchase ? coins - item.price : coins;

    const purchaseData = {
      monedas: newCoins,
      [isBg ? "skinTablero" : "skinFichas"]: formattedString,
    };

    try {
      const success = await profileService.updateProfile(userId, purchaseData);

      if (success) {
        if (isNewPurchase) {
          setCoins(newCoins);
          sileo.success({ title: "¡Compra realizada!" });
        } else {
          sileo.info({
            title: `${isBg ? "Fondo de tablero " : "Skin de fichas "} ${item.name} equipado`,
          });
        }

        setOwnedList(updatedOwned);
        setCurrent(item.value);
      }
    } catch (error) {
      sileo.error({ title: "Error de conexión con el servidor" });
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-card">
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

                const isOwned = (ownedSkins ?? []).includes(skin.id);

                return (
                  <div
                    key={skin.id}
                    className={`item-card ${isEquipped ? "active" : ""}`}
                  >
                    <div
                      className="item-preview tile-box"
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
