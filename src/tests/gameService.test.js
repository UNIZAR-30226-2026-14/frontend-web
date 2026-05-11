import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  friendService,
  authService,
  gameService,
} from "../services/gameService";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("friendService", () => {
  const userId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("rummi-token", "token-de-prueba");
  });

  it("Filtrar solicitudes enviadas y pendientes", async () => {
    const mockData = [
      { jugador1Id: 1, jugador2Id: 5, estado: "PENDIENTE" },
      { jugador1Id: 4, jugador2Id: 1, estado: "PENDIENTE" },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    const sent = await friendService.getSentRequests(userId);
    expect(sent).toHaveLength(1);
    expect(sent[0].jugador2Id).toBe(5);
  });

  it("Filtrar solo aceptadas y calcular el ID del amigo correctamente", async () => {
    const mockData = [
      {
        estado: "ACEPTADA",
        amigoId: 2,
        amigoNombre: "Ana",
      },
      {
        estado: "ACEPTADA",
        amigoId: 3,
        amigoNombre: "Luis",
      },
      {
        estado: "PENDIENTE",
        amigoId: 4,
        amigoNombre: "Pepe",
      },
    ];

    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    const friends = await friendService.getFriends(userId);

    expect(friends).toHaveLength(2);

    expect(friends[0].id).toBe(2);
    expect(friends[1].id).toBe(3);

    expect(friends[0]).toHaveProperty("avatar");
    expect(friends[0].status).toBe("online");
  });

  it("Filtrar solicitudes recibidas y pendientes", async () => {
    const mockData = [
      { jugador1Id: 2, jugador2Id: 1, estado: "PENDIENTE" },
      { jugador1Id: 1, jugador2Id: 3, estado: "PENDIENTE" },
      { jugador1Id: 2, jugador2Id: 1, estado: "ACEPTADA" },
    ];
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    const pending = await friendService.getPendingRequests(userId);
    expect(pending).toHaveLength(1);
    expect(pending[0].jugador1Id).toBe(2);
  });

  it("Lanza error si la respuesta no es ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(friendService.getFriends(userId)).rejects.toThrow(
      "Error al cargar amigos",
    );
  });

  it("Envia la fecha actual formateada", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });

    const targetId = "5";
    await friendService.sendRequest(userId, targetId);

    const [url, options] = mockFetch.mock.calls[0];

    expect(options).toBeDefined();
    expect(options.body).toBeDefined();

    const body = JSON.parse(options.body);

    expect(body.jugador2Id).toBe(5);
    expect(body.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(url).toContain("/api/amigos");
  });
});

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("Error si las credenciales son incorrectas", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "",
    });

    await expect(authService.login("pepe", "123")).rejects.toThrow(
      "Credenciales incorrectas.",
    );
  });

  it("Devuelve true si el registro es exitoso", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => "" });
    const result = await authService.register("nuevoUser", "pass123");
    expect(result).toBe(true);
  });

  it("Registro fallido lanza error con mensaje del servidor si viene en JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      text: async () =>
        JSON.stringify({ message: "El nombre de jugador ya existe" }),
    });
    await expect(authService.register("dup", "secret12")).rejects.toThrow(
      "El nombre de jugador ya existe",
    );
  });
});

describe("gameService", () => {
  const gameId = 99;
  const userId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("rummi-token", "token-de-prueba");
  });

  it("Envia los datos iniciales de la partida", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: gameId, turno: 0 }),
    });

    const game = await gameService.createGame();

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.corriendo).toBe(false);
    expect(game.id).toBe(99);
    expect(mockFetch.mock.calls[0][0]).toContain("/api/partidas");
  });

  it("drawTile y passTurn realizan peticiones POST correctas", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await gameService.drawTile(userId, gameId);
    await gameService.passTurn(userId, gameId);

    expect(mockFetch.mock.calls[0][0]).toContain(
      `/partidas/${gameId}/robar`,
    );
    expect(mockFetch.mock.calls[1][0]).toContain(
      `/partidas/${gameId}/pasar`,
    );
  });

  it("Obtiene los datos del jugador en la partida", async () => {
    const mockPart = { idJugador: 1, fichasActuales: 14 };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockPart });

    const res = await gameService.getParticipation(userId, gameId);
    expect(res.fichasActuales).toBe(14);
  });
});
