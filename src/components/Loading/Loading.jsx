import { useEffect } from "react";
import "./loading.css";

function Loading({ onFinished, onCancel }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinished();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onFinished]);

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
