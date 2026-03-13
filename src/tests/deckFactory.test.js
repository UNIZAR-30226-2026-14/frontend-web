import { describe, expect, it } from "vitest";
import {
  createDeck,
  isValidSameNumberGroup,
  isValidLadderGroup,
  groupValue,
  canPlayerOpen,
  isMoveValid,
} from "../hooks/deckFactory";

// Helper para crear fichas rápidas en los tests
const tile = (n, c) => ({ number: n, color: c });

describe("Rummikub Engine - Full Suite", () => {
  describe("Mazo y Utilidades (Cobertura de createDeck y shuffle)", () => {
    it("Tiene que crear un mazo completo de 106 fichas con 2 jokers", () => {
      const deck = createDeck();
      expect(deck).toHaveLength(106);

      const jokers = deck.filter((t) => t.number === "J");
      expect(jokers).toHaveLength(2);

      // Verifica que las fichas tengan la estructura correcta
      expect(deck[0]).toHaveProperty("id");
      expect(deck[0]).toHaveProperty("color");
      expect(deck[0]).toHaveProperty("number");
    });
  });

  describe("isValidSameNumberGroup()", () => {
    it("Tiene que validar un trío de distintos colores", () => {
      const group = [tile(5, "red"), tile(5, "blue"), tile(5, "black")];
      expect(isValidSameNumberGroup(group)).toBe(true);
    });

    it("Tiene que invalidar si hay menos de 3 fichas", () => {
      expect(isValidSameNumberGroup([tile(5, "red"), tile(5, "blue")])).toBe(
        false,
      );
    });

    it("Tiene que invalidar si se repite un color", () => {
      const group = [tile(5, "red"), tile(5, "red"), tile(5, "black")];
      expect(isValidSameNumberGroup(group)).toBe(false);
    });

    it("Tiene que validar con un Joker si el color es único", () => {
      const group = [tile(10, "red"), tile(10, "blue"), tile("J", "black")];
      expect(isValidSameNumberGroup(group)).toBe(true);
    });
  });

  describe("isValidLadderGroup()", () => {
    it("Tiene que validar una escalera simple", () => {
      const group = [tile(10, "red"), tile(11, "red"), tile(12, "red")];
      expect(isValidLadderGroup(group)).toBe(true);
    });

    it("Tiene que validar una escalera con Joker al inicio", () => {
      const group = [tile("J", "red"), tile(2, "red"), tile(3, "red")];
      expect(isValidLadderGroup(group)).toBe(true);
    });

    it("Tiene que invalidar si la escalera superaría el 13", () => {
      const group = [tile(12, "red"), tile(13, "red"), tile("J", "red")];
      expect(isValidLadderGroup(group)).toBe(false);
    });

    it("Tiene que invalidar si el valor inicial calculado es menor a 1", () => {
      // J, J, 1 -> J sería 0 y -1. Inválido.
      const group = [tile("J", "red"), tile("J", "red"), tile(1, "red")];
      expect(isValidLadderGroup(group)).toBe(false);
    });

    it("Tiene que invalidar si hay menos de 3 fichas", () => {
      expect(isValidLadderGroup([tile(1, "red"), tile(2, "red")])).toBe(false);
    });
  });

  describe("groupValue()", () => {
    it("Tiene que calcular valor de grupos (número * cantidad)", () => {
      const group = [tile(10, "red"), tile("J", "blue"), tile(10, "black")];
      expect(groupValue(group)).toBe(30);
    });

    it("Tiene que calcular valor de escaleras con Joker", () => {
      const group = [tile("J", "red"), tile(10, "red"), tile(11, "red")];
      expect(groupValue(group)).toBe(30);
    });
  });

  describe("canPlayerOpen()", () => {
    it("Tiene que permitir abrir con 30 puntos exactos", () => {
      const groups = [[tile(10, "red"), tile(10, "blue"), tile(10, "black")]];
      expect(canPlayerOpen(groups)).toBe(true);
    });

    it("Tiene que denegar si la suma es < 30", () => {
      const groups = [[tile(5, "red"), tile(5, "blue"), tile(5, "black")]];
      expect(canPlayerOpen(groups)).toBe(false);
    });

    it("Tiene que denegar si algún grupo es inválido aunque sume > 30", () => {
      const groups = [
        [tile(13, "red"), tile(13, "blue"), tile(13, "black")], // 39 pts
        [tile(1, "red"), tile(1, "red"), tile(1, "blue")], // Inválido
      ];
      expect(canPlayerOpen(groups)).toBe(false);
    });
  });
});
