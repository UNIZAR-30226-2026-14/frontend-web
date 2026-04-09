import { icons } from "../../data/itemData";

const ItemIcon = ({ id, color = "currentColor", size = 50 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      className={`icon-${id}`}
    >
      {icons[id] || (
        <text y="60" x="35" fontSize="40">
          ?
        </text>
      )}
    </svg>
  );
};

export default ItemIcon;
