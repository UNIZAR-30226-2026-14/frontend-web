import "./Tile.css";
import rojo from "../../assets/J-ROJO.svg";
import negro from "../../assets/J-NEGRO.svg";

function sign(number, color) {
  if (number != "J") {
    return (
      <h3>
        {
          {
            red: "♡",
            blue: "♢",
            orange: "♧",
            black: "♤",
          }[color]
        }
      </h3>
    );
  } else return <h3></h3>;
}

function comodin(number, color) {
  if (number === "J") {
    return <img src={color === "black" ? negro : rojo} alt="joker" />;
  }
  return number;
}

const Tile = ({ number, color, placed, habilidad, skinColor }) => {
  const isRainbow = habilidad === "arcoiris";
  const isGold = habilidad === "dorada";

  // Si tiene una habilidad especial o está colocada, manda el CSS.
  // Si es una ficha normal, usamos skinColor.
  const dynamicBackgroundColor = (isGold || isRainbow || placed) 
    ? null : skinColor;

  return (
    <div
      className={`tile ${placed ? "tile-placed" : ""} ${habilidad ? `tile-${habilidad}` : ""}`}
      style={{ 
        color: isRainbow ? "transparent" : color,
        backgroundColor: dynamicBackgroundColor,
      }}
    >
      <span>{comodin(number, color)}</span>
      {sign(number, color)}
    </div>
  );
};

export default Tile;
