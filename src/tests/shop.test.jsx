import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Shop from "../components/UI/Shop/Shop";
import { BACKGROUNDS } from "../data/itemData";

const { mocks } = vi.hoisted(() => ({
  mocks: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sileo", () => ({
  sileo: {
    success: mocks.success,
    error: mocks.error,
  },
  Toaster: () => <div data-testid="toaster" />,
}));

describe("Componente Shop", () => {
  const defaultProps = {
    onClose: vi.fn(),
    coins: 1000,
    setCoins: vi.fn(),
    currentBackground: "#2e7d32",
    setCurrentBackground: vi.fn(),
    addXp: vi.fn(),
    ownedBgs: "", // El ID 1 es Verde Clásico
    setOwnedBgs: vi.fn(),
    currentSkin: "default",
    setCurrentSkin: vi.fn(),
    ownedSkins: "",
    setOwnedSkins: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Título de la tienda", () => {
    render(<Shop {...defaultProps} />);
    expect(screen.getByText("Tienda")).toBeDefined();
  });

  it("Botón del ítem poseído con su precio", () => {
    render(<Shop {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    const ownedButton = buttons.find((b) => b.textContent === "0");
    expect(ownedButton).toBeDefined();
  });

  it("Intentar comprar un ítem al pulsar sobre su precio", () => {
    render(<Shop {...defaultProps} />);

    const priceButton = screen.getByText("500");
    fireEvent.click(priceButton);
    expect(defaultProps.setCoins).toHaveBeenCalled();
  });

  it("Error si los fondos son insuficientes", () => {
    render(<Shop {...defaultProps} coins={0} />);
    const expensiveButton = screen.getByText("1000");
    fireEvent.click(expensiveButton);

    expect(mocks.error).toHaveBeenCalled();
  });

  it("Cerrar la tienda al pulsar X", () => {
    render(<Shop {...defaultProps} />);
    const closeBtn = screen.getByText("X");
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("Equipar un ítem si ya está en ownedList", async () => {
    const props = {
      ...defaultProps,
      ownedBgs: "", // Ya lo tiene
      currentBackground: "#2e7d32",
    };
    render(<Shop {...props} />);

    const button500 = screen.getByText("500");
    fireEvent.click(button500);

    expect(props.setCurrentBackground).toHaveBeenCalled();

    expect(props.setCoins).not.toHaveBeenCalled();
  });

  it("Añadir 5000 monedas al usar el fake-pay", async () => {
    render(<Shop {...defaultProps} />);

    const payButton = screen.getByText("4.99€");
    fireEvent.click(payButton);

    expect(defaultProps.setCoins).toHaveBeenCalledWith(6000);

    await vi.waitFor(() => {
      expect(mocks.success).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Compra realizada" }),
      );
    });
  });

  it("Error en la transacción", async () => {
    // Simulamos que setCoins lanza un error inesperado
    const props = {
      ...defaultProps,
      setCoins: vi.fn().mockImplementation(() => {
        throw new Error("DB Error");
      }),
    };
    render(<Shop {...props} />);

    const buyButton = screen.getByText("500");
    fireEvent.click(buyButton);

    expect(mocks.error).toHaveBeenCalled();
  });

  describe("Skins de Fichas", () => {
    it("Mostrar las skins disponibles", () => {
      render(<Shop {...defaultProps} />);
      expect(screen.getByText("Original")).toBeDefined();
      expect(screen.getByText("Cibernético")).toBeDefined();
    });

    it("Equipar una skin que ya posee", () => {
      // Simulamos que posee la skin 2 (Cibernético) pero tiene la 1 activa
      const props = {
        ...defaultProps,
        ownedSkins: "",
        currentSkin: "default",
      };
      render(<Shop {...props} />);

      const skinButtons = screen.getAllByRole("button");
      const ciberneticoButton = skinButtons.find(
        (b) => b.textContent === "800",
      );
      fireEvent.click(ciberneticoButton);

      expect(props.setCurrentSkin).toHaveBeenCalled();
    });

    it("Error al intentar comprar una skin sin monedas suficientes", () => {
      render(<Shop {...defaultProps} coins={0} />);

      const expensiveSkin = screen.getByText("2000");
      fireEvent.click(expensiveSkin);

      expect(mocks.error).toHaveBeenCalled();
      expect(defaultProps.setCoins).not.toHaveBeenCalled();
    });
  });
});
