import {useDroppable} from '@dnd-kit/core';
//import {CollisionPriority} from '@dnd-kit/abstract';

function Hand({children, id}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="hand-container" ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Hand;