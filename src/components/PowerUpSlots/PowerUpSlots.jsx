import { useState } from "react";

function PowerUpSlots({ inventory, onActivate }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  return (
    <div className="powerup-inventory">
      <div className="slots-grid">
        {inventory.map((item, index) => {
          return (
            <div
              key={index}
              className={selectedSlot?.index === index ? "slot-selected" : "slot"}
              onClick={() => {
                item ? setSelectedSlot({ ...item, index }) : null;
              }}
            >
              {item ? item.name : "+"}
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
