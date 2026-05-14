import { useState } from "react";
import "./PowerUpSlots.css";
import ItemIcon from "../../UI/ItemIcon.jsx";

function PowerUpSlots({ inventory, onActivate, shop, disabled }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Creamos el array de 3 posiciones de forma más limpia
  const displaySlots = Array.from({ length: 3 }, (_, i) => inventory[i] || null);

  return (
    <div className="powerup-inventory">
      <div className="slots-grid">
        {displaySlots.map((item, index) => (
          <button
            disabled = {disabled}
            key={`slot-${index}`} 
            // Si quieres que el botón se vea gris/bloqueado cuando no hay item, 
            // pero que aun así abra la tienda, NO uses disabled={!item}.
            // Mejor controla el estilo con clases.
            className={selectedSlot?.index === index ? "slot-selected" : "slot"}
            onClick={() => {
              if (item) {
                setSelectedSlot({ ...item, index });
              } else {
                shop(); // Llama a la tienda si el slot está vacío
              }
            }}
            // Opcional: Si por alguna razón quieres deshabilitar totalmente el click
            // disabled={algunCondicionalExtra} 
          >
            {item ? (
              <ItemIcon id={item.id} color={item.color} size={item.size} />
            ) : (
              <span className="empty-slot">+</span>
            )}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <div className="confirmation-popup">
          <label>{selectedSlot.name}</label>
          <div className="popup-actions">
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
        </div>
      )}
    </div>
  );
}

export default PowerUpSlots;