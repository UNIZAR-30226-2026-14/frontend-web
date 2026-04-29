import "./tile.css";
import rojo from "../../assets/j-rojo.svg";
import negro from "../../assets/j-negro.svg";

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

const Tile = ({ number, color, placed, habilidad }) => {
  const isRainbow = habilidad === "arcoiris";
  const isNegative = habilidad === "negativa";

  console.log(`Pintando ficha: ${number} ${color}`);
  return (
    <div
      className={`tile ${placed ? "tile-placed" : ""} ${habilidad ? `tile-${habilidad}` : ""}`}
      style={{ color: isRainbow ? "transparent" : color }}
    >
      <span>{comodin(number, color)}</span>
      {sign(number, color)}
      {isNegative && <div className="negative-sign">-</div>}
    </div>
  );
};

export default Tile;
