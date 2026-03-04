import {useDroppable} from '@dnd-kit/core';
import {CollisionPriority} from '@dnd-kit/abstract';

function Hand({children, id}) {
  const {isDropTarget, ref} = useDroppable({
    id,
    type: 'hand-container',
    accept: 'tile',
    collisionPriority: CollisionPriority.Low,
  });
  const style = isDropTarget ? {background: '#ff0000'} : undefined;

  return (
    <div className="hand-container" ref={ref} style={style}>
      {children}
    </div>
  );
}

export default Hand;