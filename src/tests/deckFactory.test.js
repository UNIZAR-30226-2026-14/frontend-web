import { describe, expect, it } from "vitest";
import {
  createDeck,
  isValidSameNumberGroup,
  isValidLadderGroup,
  groupValue,
  canPlayerOpen,
} from "../hooks/deckFactory";

// Helper para crear fichas
const tile = (n, c) => ({ number: n, color: c });

describe("Reglas de Rummikub", () => {
  describe("Grupos del mismo número", () => {
    it("Trío de distintos colores", () => {
      const group = [tile(5, "red"), tile(5, "blue"), tile(5, "black")];
      expect(isValidSameNumberGroup(group)).toBe(true);
    });

    it("Cuarteto de distintos colores", () => {
      const group = [
        tile(5, "red"),
        tile(5, "blue"),
        tile(5, "black"),
        tile(5, "orange"),
      ];
      expect(isValidSameNumberGroup(group)).toBe(true);
    });

    it("Más de 4 fichas", () => {
      const group = [
        tile(5, "red"),
        tile(5, "blue"),
        tile(5, "black"),
        tile(5, "orange"),
        tile("J", "red"),
      ];
      expect(isValidSameNumberGroup(group)).toBe(false);
    });

    it("Joker con colores únicos", () => {
      const group = [tile(10, "red"), tile(10, "blue"), tile("J", "black")];
      expect(isValidSameNumberGroup(group)).toBe(true);
    });
  });

  describe("Escaleras", () => {
    it("Escalera simple", () => {
      const group = [tile(10, "red"), tile(11, "red"), tile(12, "red")];
      expect(isValidLadderGroup(group)).toBe(true);
    });

    it("Escalera con Joker en medio o extremos", () => {
      expect(
        isValidLadderGroup([
          tile("J", "black"),
          tile(2, "red"),
          tile(3, "red"),
        ]),
      ).toBe(true);
      expect(
        isValidLadderGroup([
          tile(11, "blue"),
          tile("J", "black"),
          tile(13, "blue"),
        ]),
      ).toBe(true);
      expect(
        isValidLadderGroup([
          tile(2, "red"),
          tile(3, "red"),
          tile("J", "black"),
        ]),
      ).toBe(true);
    });

    it("Escalera que superaría el 13", () => {
      const group = [tile(12, "red"), tile(13, "red"), tile("J", "red")];
      expect(isValidLadderGroup(group)).toBe(false);
    });

    it("Escalera que baja por debajo de 1", () => {
      const group = [tile("J", "red"), tile(1, "red"), tile(2, "red")];
      expect(isValidLadderGroup(group)).toBe(false);
    });

    it("Longitud supera las 13 fichas", () => {
      const tooLong = Array.from({ length: 13 }, (_, i) => tile(i + 1, "red"));
      tooLong.push(tile("J", "red"));
      expect(isValidLadderGroup(tooLong)).toBe(false);
    });
  });

  describe("Puntos para apertura", () => {
    it("Calcular número * cantidad en tríos con Joker", () => {
      const group = [tile(10, "red"), tile("J", "blue"), tile(10, "black")];
      expect(groupValue(group)).toBe(30);
    });

    it("Escaleras con Joker", () => {
      const group = [tile("J", "red"), tile(10, "red"), tile(11, "red")];
      expect(groupValue(group)).toBe(30);

      const groupEnd = [tile(11, "blue"), tile(12, "blue"), tile("J", "black")];
      expect(groupValue(groupEnd)).toBe(36);
    });
  });

  describe("Regla de los 30 puntos", () => {
    it("Múltiples grupos que suman exactamente 30", () => {
      const groups = [
        [tile(1, "red"), tile(2, "red"), tile(3, "red")],
        [tile(8, "red"), tile(8, "blue"), tile(8, "black")],
      ];
      expect(canPlayerOpen(groups)).toBe(true);
    });

    it("", () => {
      const groups = [[tile(9, "red"), tile(10, "red"), tile("J", "red")]];
      expect(canPlayerOpen(groups)).toBe(true);

      const lowGroup = [[tile(9, "red"), tile(10, "red"), tile(10, "red")]];
      expect(
        canPlayerOpen([[tile(9, "red"), tile(9, "blue"), tile(9, "black")]]),
      ).toBe(false);
    });
  });
});
