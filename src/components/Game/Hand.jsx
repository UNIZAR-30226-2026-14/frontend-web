import {useDroppable} from '@dnd-kit/core';
//import {CollisionPriority} from '@dnd-kit/abstract';

function Hand({children, id, className, style}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`hand-container ${className || ''}`}
    ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default Hand;