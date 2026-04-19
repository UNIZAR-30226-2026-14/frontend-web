import { describe, expect, it } from "vitest";
import {
  createDeck,
  isValidSameNumberGroup,
  isValidLadderGroup,
  groupValue,
  canPlayerOpen,
  areCompatible,
  isValidSameNumber,
  isValidLadder,
} from "../hooks/deckFactory";

// Helper para crear fichas
const tile = (n, c) => ({ number: n, color: c });

describe("Creación del mazo", () => {
  it("El mazo tiene que ser de 106 fichas", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(106);
  });

  it("Tiene que tener 2 comodines", () => {
    const deck = createDeck();
    const jokers = deck.filter((t) => t.number === "J");
    expect(jokers).toHaveLength(2);
  });

  it("No son iguales", () => {
    const deck1 = createDeck();
    const deck2 = createDeck();
    expect(deck1).not.toEqual(deck2);
  });
});

describe("Reglas de Rummikub", () => {
  describe("Grupos del mismo número", () => {
    it("Menos de 3 fichas", () => {
      const group = [tile(5, "red"), tile(5, "blue")];
      expect(isValidSameNumberGroup(group)).toBe(false);
    });

    it("Trío con joker", () => {
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
  });

  describe("Escaleras", () => {
    it("Menos de 3 fichas", () => {
      const group = [tile(1, "red"), tile(2, "red")];
      expect(isValidLadderGroup(group)).toBe(false);
    });

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
    it("Trío con Joker", () => {
      const group = [tile(10, "red"), tile("J", "blue"), tile(10, "black")];
      expect(groupValue(group)).toBe(30);
    });

    it("Escaleras con Joker al incio y al final", () => {
      const group = [tile("J", "red"), tile(10, "red"), tile(11, "red")];
      expect(groupValue(group)).toBe(30);

      const groupEnd = [tile(11, "blue"), tile(12, "blue"), tile("J", "black")];
      expect(groupValue(groupEnd)).toBe(36);
    });
  });

  describe("Regla de los 30 puntos", () => {
    it("Múltiples grupos que suman 30 puntos", () => {
      const groups = [
        [tile(1, "red"), tile(2, "red"), tile(3, "red")],
        [tile(8, "red"), tile(8, "blue"), tile(8, "black")],
      ];
      expect(canPlayerOpen(groups)).toBe(true);
    });

    it("Un grupo que suma 30 puntos", () => {
      expect(
        canPlayerOpen([[tile(9, "red"), tile(10, "red"), tile("J", "red")]]),
      ).toBe(true);
    });

    it("Un grupo que no llega a sumar 30 puntos", () => {
      expect(
        canPlayerOpen([[tile(9, "red"), tile(9, "blue"), tile(9, "black")]]),
      ).toBe(false);
    });

    it("Los grupos suman 30 pero uno no es válido", () => {
      const groups = [
        [tile(10, "red"), tile(10, "red"), tile(10, "blue")],
        [tile(1, "red"), tile(2, "red"), tile(3, "red")],
      ];
      expect(canPlayerOpen(groups)).toBe(false);
    });
  });
});

describe("Compatibilidad de fichas (uniones)", () => {
  it("Dos fichas del mismo número y distinto color", () => {
    const pair = [tile(5, "red"), tile(5, "blue")];
    expect(areCompatible(pair)).toBe(true);
  });

  it("Dos fichas consecutivas del mismo color", () => {
    const sequence = [tile(5, "red"), tile(6, "red")];
    expect(areCompatible(sequence)).toBe(true);
  });
});

describe("Validación de límites", () => {
  it("Una sola ficha", () => {
    expect(isValidLadder([tile(5, "red")])).toBe(false);
  });

  it("Escalera que empezaría por debajo de 1", () => {
    expect(isValidLadder([tile("J", "red"), tile(1, "red")])).toBe(false);
  });

  it("Una sola ficha", () => {
    expect(isValidSameNumber([tile(10, "blue")])).toBe(false);
  });

  it("Números no consecutivos", () => {
    expect(isValidLadder([tile(5, "red"), tile(7, "red")])).toBe(false);
  });
});
