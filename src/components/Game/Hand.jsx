import {useDroppable} from '@dnd-kit/core';
//import {CollisionPriority} from '@dnd-kit/abstract';

function Hand({children, id, className}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`hand-container ${className || ''}`}
    ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Hand;