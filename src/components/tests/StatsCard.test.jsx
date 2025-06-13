import React from "react";
import { render, screen } from "@testing-library/react";
import StatsCard from "../StatsCard";

describe("Componente StatsCard", () => {
  it("renderiza el título y el valor correctamente", () => {
    render(
      <StatsCard title="Total Usuarios" value={120} icon="fas fa-users" />
    );
    expect(screen.getByText("Total Usuarios")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("muestra el ícono proporcionado", () => {
    render(<StatsCard title="Activos" value={10} icon="fas fa-check" />);
    expect(screen.getByTestId("main-icon")).toHaveClass("fas", "fa-check");
  });

  it("aplica la variante de color correspondiente", () => {
    render(
      <StatsCard
        title="Usuarios"
        value={99}
        icon="fas fa-user"
        variant="success"
      />
    );
    expect(screen.getByTestId("icon-wrapper")).toHaveClass("text-success");
  });

  it('muestra la tendencia si se proporciona (tipo "up")', () => {
    render(
      <StatsCard
        title="Crecimiento"
        value={50}
        icon="fas fa-chart-line"
        trend={{ type: "up", value: 12 }}
      />
    );
    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByTestId("trend")).toHaveClass("text-success");
    expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
  });

  it('muestra la tendencia si se proporciona (tipo "down")', () => {
    render(
      <StatsCard
        title="Disminución"
        value={30}
        icon="fas fa-chart-line"
        trend={{ type: "down", value: 8 }}
      />
    );
    expect(screen.getByText(/8%/)).toBeInTheDocument();
    expect(screen.getByTestId("trend")).toHaveClass("text-danger");
    expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
  });

  it('usa "primary" como variante por defecto si no se especifica', () => {
    render(<StatsCard title="Default" value={0} icon="fas fa-bug" />);
    expect(screen.getByTestId("icon-wrapper")).toHaveClass("text-primary");
  });
});
