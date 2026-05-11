/**
 * Base de la URL para todas las llamadas a la API REST.
 *
 * PRODUCCIÓN (Render, etc.)
 *   El backend Spring Boot sirve la SPA y la API desde el mismo origen, por lo que
 *   no se necesita ningún host: todas las rutas empiezan por "/api/...".
 *   API_BASE_URL = "/api"
 *
 * DESARROLLO LOCAL
 *   Si el front corre en un puerto distinto al backend (p. ej. Vite en :5173
 *   y Spring Boot en :8443 con SSL), crea el fichero .env.development en la
 *   raíz del proyecto con el siguiente contenido:
 *
 *     VITE_API_BASE_URL=https://localhost:8443
 *
 *   La variable NO debe llevar barra final.
 *   Vite la inyecta en tiempo de compilación vía import.meta.env.VITE_API_BASE_URL.
 *   Si la variable no está definida, se sigue usando el mismo origen (útil cuando
 *   el front se sirve directamente desde el backend en local).
 */

const base = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_BASE_URL = `${base}/api`;
