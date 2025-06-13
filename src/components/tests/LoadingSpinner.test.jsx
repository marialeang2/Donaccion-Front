import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

// Mock de i18n para evitar problemas con traducciones
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Componente LoadingSpinner", () => {
  it("renderiza el spinner y el mensaje por defecto", () => {
    render(<LoadingSpinner />);

    // Verifica que el spinner esté presente
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Verifica que el texto por defecto esté presente
    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });

  it("muestra un mensaje personalizado si se proporciona", () => {
    const customMessage = "Cargando datos...";
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});
