import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSidebar from "../FilterSidebar";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Componente FilterSidebar", () => {
  const mockOnFilterChange = jest.fn();
  const mockOnClearFilters = jest.fn();
  const defaultFilters = {
    status: "",
    location: "",
    startDate: "",
    endDate: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos los campos correctamente", () => {
    render(
      <FilterSidebar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText("filters.title")).toBeInTheDocument();
    expect(screen.getByLabelText("filters.status")).toBeInTheDocument();
    expect(screen.getByLabelText("filters.location")).toBeInTheDocument();
    expect(screen.getByLabelText("filters.startDate")).toBeInTheDocument();
    expect(screen.getByLabelText("filters.endDate")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "filters.clear" })
    ).toBeInTheDocument();
  });

  it("llama a onFilterChange cuando se cambia un filtro", () => {
    render(
      <FilterSidebar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    fireEvent.change(screen.getByLabelText("filters.status"), {
      target: { value: "active" },
    });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: "active",
    });

    fireEvent.change(screen.getByLabelText("filters.location"), {
      target: { value: "Bogotá" },
    });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      location: "Bogotá",
    });
  });

  it("llama a onClearFilters al hacer clic en el botón de limpiar", () => {
    render(
      <FilterSidebar
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "filters.clear" }));
    expect(mockOnClearFilters).toHaveBeenCalled();
  });
});
