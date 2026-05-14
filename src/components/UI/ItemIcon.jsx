import { icons } from "../../data/itemData";

const ItemIcon = ({ id, size = 50 }) => {
  // Buscamos el contenido del icono usando el ID
  const iconContent = icons[id];

  // Determinamos el viewBox: la oreja usa uno grande, el resto 100x100
  const viewBox = (id === "earDetail") ? "0 0 1361 1284" : "0 0 100 100";

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={`icon-${id}`}
    >
      {iconContent ? (
        iconContent
      ) : (
        /* Si sale el ?, es que 'id' no existe en el objeto 'icons' */
        <text y="60" x="25" fontSize="40" fill="currentColor">
          ?
        </text>
      )}
    </svg>
  );
};

export default ItemIcon;