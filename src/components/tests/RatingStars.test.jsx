import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RatingStars from "../RatingStars";

describe("Componente RatingStars", () => {
  it("renderiza 5 estrellas vacías por defecto si rating = 0", () => {
    render(<RatingStars rating={0} />);
    const stars = screen.getAllByTestId("star-icon");
    expect(stars).toHaveLength(5);
  });

  it("muestra estrellas llenas de acuerdo al rating", () => {
    render(<RatingStars rating={3} />);
    const stars = screen.getAllByTestId("star-icon");

    // Comprobamos que los primeros 3 tengan el título "filled" (deberías agregarlos al componente)
    stars.slice(0, 3).forEach((star) => {
      expect(star).toHaveAttribute("data-state", "filled");
    });

    // Los últimos 2 deben ser "empty"
    stars.slice(3).forEach((star) => {
      expect(star).toHaveAttribute("data-state", "empty");
    });
  });

  it("muestra media estrella cuando el rating tiene .5", () => {
    render(<RatingStars rating={2.5} />);
    const stars = screen.getAllByTestId("star-icon");
    expect(stars[2]).toHaveAttribute("data-state", "half");
  });

  it("muestra el valor textual del rating si showValue está activado", () => {
    render(<RatingStars rating={4.5} />);
    expect(screen.getByText("(4.5/5)")).toBeInTheDocument();
  });

  it("no muestra el valor textual del rating si showValue es false", () => {
    render(<RatingStars rating={4.5} showValue={false} />);
    expect(screen.queryByText(/\(4\.5\/5\)/)).not.toBeInTheDocument();
  });

  it("llama a onRatingChange cuando se hace clic en una estrella", () => {
    const mockChange = jest.fn();
    render(<RatingStars rating={3} onRatingChange={mockChange} />);
    const stars = screen.getAllByTestId("star-clickable");

    fireEvent.click(stars[1]);
    expect(mockChange).toHaveBeenCalledWith(2);
  });
});
