import "./playerRack.css"
import Hand from "../Hand.jsx";
import DraggableTile from "../draggableTile.jsx";

const PlayerRack = ({ handPositions, slotsNecesarios }) => {
  return (
    <div className="player-rack" style={{ "--slots": slotsNecesarios }}>
      <svg
        width={Math.floor(slotsNecesarios / 2) * 50 + 100}
        className="rack-svg"
      >
        <rect
          x="30"
          y="20"
          width={Math.floor(slotsNecesarios / 2) * 50 + 40}
          height="60"
          fill="#5d2e0a"
          stroke="#3e1f07"
          strokeWidth="2"
          rx="5"
        />
        <rect
          x="30"
          y="70"
          width={Math.floor(slotsNecesarios / 2) * 50 + 40}
          height="60"
          fill="#8B4513"
          stroke="#5d2e0a"
          strokeWidth="2"
          rx="5"
        />
      </svg>

      {/* FICHAS DINÁMICAS */}
      <div className="player-Hand">
        {Object.keys(handPositions).map((slotId) => (
          <Hand key={slotId} id={slotId}>
            {handPositions[slotId] && (
              <DraggableTile tile={handPositions[slotId]} />
            )}
          </Hand>
        ))}
      </div>
    </div>
  );
};

export default PlayerRack;