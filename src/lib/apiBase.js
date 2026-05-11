const PRODUCTION_HOST = "rummiplus.onrender.com";

/**
 * Origen del backend sin sufijo `/api` (cadena vacía = mismo origen del documento).
 *
 * - Producción: `import.meta.env.PROD` o hostname de Render → siempre mismo origen,
 *   ignorando `VITE_API_BASE_URL` para que el bundle nunca apunte a localhost.
 * - Desarrollo: si existe `VITE_API_BASE_URL` (sin barra final), p. ej.
 *   `https://localhost:8443` cuando Vite corre en otro puerto.
 *
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
export function getApiOrigin() {
  if (import.meta.env.PROD) {
    return "";
  }
  if (
    typeof window !== "undefined" &&
    window.location?.hostname === PRODUCTION_HOST
  ) {
    return "";
  }
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string") {
    const t = fromEnv.trim();
    if (t !== "") {
      return t.replace(/\/+$/, "");
    }
  }
  return "";
}

/** Base de la API REST: `/api` o `https://localhost:8443/api`. */
export const API_BASE_URL = `${getApiOrigin()}/api`;

/**
 * URL completa de un recurso bajo `/api`.
 *
 * @param {string} path - Ruta relativa a `/api`, p. ej. `auth/login` o `partidas/1`.
 */
export function getApiUrl(path) {
  const normalized = String(path).replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalized}`;
}

/**
 * `fetch` contra la API usando la misma resolución de base que el resto de la app.
 *
 * @param {string} path - Relativo a `/api` (sin prefijo `api/`).
 * @param {RequestInit} [init]
 */
export function apiFetch(path, init) {
  return fetch(getApiUrl(path), init);
}
