import { useState } from "react";

function PowerUpSlots({ inventory, onActivate }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const displaySlots = [...inventory];
  // Rellenamos con null para mostrar siempre 3 slots
  while (displaySlots.length < 3) displaySlots.push(null);

  return (
    <div className="powerup-inventory">
      <div className="slots-grid">
        {displaySlots.map((item, index) => {
          return (
            <div
              key={index}
              className={
                selectedSlot?.index === index ? "slot-selected" : "slot"
              }
              onClick={() => {
                if (item) setSelectedSlot({ ...item, index });
              }}
            >
              {item ? (
                <img src={item.icon} alt={item.name} className="slot-icon" />
              ) : (
                <div className="empty-slot">+</div>
              )}
            </div>
          );
        })}
      </div>
      {selectedSlot && (
        <div className="confirmation-popup">
          <label>{selectedSlot.name}</label>
          <button
            className="confirm-button"
            onClick={() => {
              onActivate(selectedSlot);
              setSelectedSlot(null);
            }}
          >
            Confirmar
          </button>
          <button
            className="cancel-button"
            onClick={() => setSelectedSlot(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default PowerUpSlots;
