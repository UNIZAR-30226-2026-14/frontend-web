export const handleDragLogic = (event, states) => {
  const { active, over } = event;
  const { 
    handPositions, setHandPositions, 
    boardPositions, setBoardPositions, 
    setPlayerHand, setGameBoard, 
    miTurno, activeTile 
  } = states;

  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  const fromHandKey = Object.keys(handPositions).find(k => handPositions[k]?.id === activeId);
  const fromBoardKey = Object.keys(boardPositions).find(k => boardPositions[k]?.id === activeId);

  const tile = fromHandKey ? handPositions[fromHandKey] : boardPositions[fromBoardKey];
  if (!tile) return;

  // LÓGICA: SOLTAR EN TABLERO
  if (overId.startsWith("board-slot")) {
    if (!miTurno) return;
    
    // De Mano a Tablero
    if (fromHandKey) {
      if (boardPositions[overId] !== "") return;
      
      const tileMoving = handPositions[fromHandKey];

      setHandPositions((prev) => {
        const newPos = { ...prev, [fromHandKey]: "" };
        setPlayerHand(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });

      setBoardPositions((prev) => {
        const newPos = { ...prev, [overId]: tileMoving };
        setGameBoard(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });
    }

    // Movimiento interno en Tablero
    if (fromBoardKey && fromBoardKey !== overId) {
      setBoardPositions((prev) => {
        const newPos = { ...prev };
        const tileAtTarget = prev[overId];
        newPos[fromBoardKey] = tileAtTarget;
        newPos[overId] = tile;
        setGameBoard(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });
    }
  }

  // LÓGICA: SOLTAR EN MANO
  else if (overId.startsWith("hand-slot")) {
    // De Tablero a Mano
    if (fromBoardKey) {
      if (!miTurno || activeTile.placed) return;
      if (handPositions[overId] !== "") return;

      setBoardPositions((prev) => {
        const newPos = { ...prev, [fromBoardKey]: "" };
        setGameBoard(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });

      setHandPositions((prev) => {
        const newPos = { ...prev, [overId]: tile };
        setPlayerHand(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });
    }

    // Movimiento interno en Mano
    if (fromHandKey && fromHandKey !== overId) {
      setHandPositions((prev) => {
        const newPos = { ...prev };
        const tileAtTarget = prev[overId];
        newPos[fromHandKey] = tileAtTarget;
        newPos[overId] = tile;
        setPlayerHand(Object.values(newPos).filter(t => t !== ""));
        return newPos;
      });
    }
  }
};