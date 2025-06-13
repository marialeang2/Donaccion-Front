import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoriteButton from "../FavoriteButton";

// Mock de react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Componente FavoriteButton", () => {
  const user = { id: 1 };
  const item = { id: 101 };
  const itemType = "opportunity";

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });
  beforeAll(() => {
    global.alert = jest.fn();
  });

  it("muestra el ícono de corazón sin llenar si no es favorito", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [], // no hay favoritos
    });

    render(<FavoriteButton item={item} itemType={itemType} user={user} />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  it("marca como favorito si ya está en la lista", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ item_id: 101, item_type: "opportunity" }],
    });

    render(<FavoriteButton item={item} itemType={itemType} user={user} />);

    await waitFor(() => {
      expect(screen.getByRole("button").className).toMatch(/text-danger/);
    });
  });

  it("agrega a favoritos al hacer clic si no es favorito", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    mockFetch.mockResolvedValueOnce({ ok: true }); // POST

    render(<FavoriteButton item={item} itemType={itemType} user={user} />);

    await screen.findByRole("button");
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/users/1/favorites",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("elimina de favoritos al hacer clic si ya es favorito", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ item_id: 101, item_type: "opportunity" }],
    });
    mockFetch.mockResolvedValueOnce({ ok: true }); // DELETE

    render(<FavoriteButton item={item} itemType={itemType} user={user} />);

    await screen.findByRole("button");
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/users/1/favorites/101",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("no hace nada si no hay usuario", async () => {
    render(<FavoriteButton item={item} itemType={itemType} user={null} />);
    fireEvent.click(screen.getByRole("button"));
    // No debería llamar fetch
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
