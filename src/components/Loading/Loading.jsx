import { useEffect } from "react";
import "./loading.css";
import { gameService } from "../../services/gameService";

function Loading({ gameId, onFinished, onCancel }) {
  useEffect(() => {
    if (!gameId) return;

    const interval = setInterval(async () => {
      try {
        const status = await gameService.getGameStatus(gameId);

        if (status.estado === "RUNNING") {
          clearInterval(interval);
          onFinished();
        }
      } catch (error) {
        console.error("Error comprobando inicio de partida:", error);
      }
    }, 2000); // Comprueba cada 2 segundos

    return () => clearInterval(interval);
  }, [gameId, onFinished]);

  return (
    <div className="loading-screen">
      <h2 className="loading-text">Buscando oponentes</h2>
      <div className="spinner"></div>
      <button className="cancel-button" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
}

export default Loading;
