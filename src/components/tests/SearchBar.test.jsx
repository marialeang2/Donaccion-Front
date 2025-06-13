import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

// Mock de i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Componente SearchBar", () => {
  it("renderiza el input con el placeholder por defecto", () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(
      screen.getByPlaceholderText("search.placeholder")
    ).toBeInTheDocument();
  });

  it("permite escribir en el input", () => {
    render(<SearchBar onSearch={jest.fn()} />);
    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "donación" } });
    expect(input.value).toBe("donación");
  });

  it("llama a onSearch al enviar el formulario", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "voluntariado" } });
    fireEvent.submit(input);

    expect(mockOnSearch).toHaveBeenCalledWith("voluntariado");
  });

  it("desactiva el botón cuando está en estado loading", () => {
    render(<SearchBar onSearch={jest.fn()} loading />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("spinner-icon")).toBeInTheDocument();
  });

  it("usa el placeholder personalizado si se proporciona", () => {
    render(
      <SearchBar onSearch={jest.fn()} placeholder="Buscar oportunidades..." />
    );
    expect(
      screen.getByPlaceholderText("Buscar oportunidades...")
    ).toBeInTheDocument();
  });
});
