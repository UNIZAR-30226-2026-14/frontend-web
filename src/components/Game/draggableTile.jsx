import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Tile from "./Tile.jsx";

function DraggableTile({ tile }) {
  // Versión de ficha ya draggeable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: tile.id, // El ID único que ya tienes
  });

  // Estilo para que el componente se desplace visualmente
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: "none",
    opacity: isDragging ? 0.5 : 1, // La ficha original se vuelve traslúcida
    cursor: "grab",
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Tile
        key={tile.id}
        number={tile.number}
        color={tile.color}
        placed={tile.placed}
      />
    </div>
  );
}


export default DraggableTile;