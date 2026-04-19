import { describe, expect, it } from "vitest";
import { parsearFichas, enviarConjuntos } from "../services/gameUtils";

describe("Parser de Fichas", () => {
  describe("parsearFichas (String a Objeto)", () => {
    it("String nulo y vacío", () => {
      expect(parsearFichas(null)).toEqual([]);
      expect(parsearFichas("")).toEqual([]);
    });

    it("Ficha normal", () => {
      const result = parsearFichas("R05D");
      expect(result[0]).toMatchObject({
        color: "red",
        number: 5,
        habilidad: "dorada",
      });
    });

    it("Joker", () => {
      const result = parsearFichas("J*");
      expect(result[0]).toMatchObject({
        number: "J",
        habilidad: "joker",
        color: "black",
      });
    });

    it("Múltiples fichas separadas por comas", () => {
      const result = parsearFichas("R01,B13A,K02N");
      expect(result).toHaveLength(3);
      expect(result[0].habilidad).toBeNull();
      expect(result[1].habilidad).toBe("arcoiris");
      expect(result[2].habilidad).toBe("negativa");
    });

    it("", () => {
        const result = parsearFichas("Z04");
        expect(result[0].color).toBe("black")
    })
  });

  describe("enviarConjuntos", () => {
    // Helper para simular ficha del board
    const mockTile = (n, c, h = null) => ({
      number: n,
      color: c,
      habilidad: h,
    });

    it("Objetos de ficha al formato del servidor", () => {
      const board = {
        pos1: mockTile(10, "orange", "dorada"),
        pos2: "", // Espacio vacío en el tablero
      };
      const result = enviarConjuntos(board);
      expect(result).toContain("O10D");
    });

    it("Joker", () => {
      const board = { pos1: mockTile("J", "black", "joker") };
      const result = enviarConjuntos(board);
      expect(result).toContain("J*");
    });

    it("Ficha sin habilidad y con un color desconocido", () => {
        const board = {pos1: mockTile("8", "grey", null)}
        const result = enviarConjuntos(board);
        expect(result).toContain("K08")
    })
  });
});
