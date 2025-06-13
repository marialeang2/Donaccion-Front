import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OpportunityCard from "../OpportunityCard";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock components
jest.mock("../FavoriteButton", () => () => (
  <button data-testid="favorite-button">Favorite</button>
));
jest.mock("../RatingStars", () => ({ rating }) => (
  <div data-testid="rating-stars">Rating: {rating}</div>
));
jest.mock("../../utils/ImageUtils", () => ({
  getConsistentImage: (type, id) => `/mock-image/${type}/${id}`,
}));

describe("Componente OpportunityCard", () => {
  const baseOpportunity = {
    id: 1,
    title: "Oportunidad de Voluntariado",
    description: "Ayuda a la comunidad local con actividades sociales.",
    start_date: new Date(Date.now() - 86400000).toISOString(),
    end_date: new Date(Date.now() + 86400000).toISOString(),
    location: "Bogotá",
    averageRating: 4.5,
    image: null,
    foundation: {
      legal_name: "Fundación Esperanza",
      address: "Calle 123",
    },
  };

  const user = { id: 42, name: "María", user_type: "user" };

  it("muestra el título, descripción y fundación", () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("Oportunidad de Voluntariado")).toBeInTheDocument();
    expect(screen.getByText("Fundación Esperanza")).toBeInTheDocument();
    expect(screen.getByText(/Ayuda a la comunidad/)).toBeInTheDocument();
  });

  it("muestra el badge de estado correcto", () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("opportunities.active")).toBeInTheDocument();
  });

  it("muestra el botón de favoritos si el usuario está autenticado", () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("favorite-button")).toBeInTheDocument();
  });

  it("muestra la calificación", () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("rating-stars")).toHaveTextContent("Rating: 4.5");
  });

  it('muestra botón para aplicar si el usuario es tipo "user"', () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("opportunities.apply")).toBeInTheDocument();
  });

  it("no muestra el botón para aplicar si el usuario no está logueado", () => {
    render(
      <MemoryRouter>
        <OpportunityCard opportunity={baseOpportunity} user={null} />
      </MemoryRouter>
    );

    expect(screen.queryByText("opportunities.apply")).not.toBeInTheDocument();
  });
});
