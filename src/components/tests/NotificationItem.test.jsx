import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationItem from "../NotificationItem";

// Mock de i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Componente NotificationItem", () => {
  const baseNotification = {
    id: 1,
    message: "You received a donation",
    notification_date: new Date().toISOString(),
    read: false,
  };

  const mockOnMarkAsRead = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnMarkAsRead.mockClear();
    mockOnDelete.mockClear();
  });

  it("renderiza el mensaje y la fecha", () => {
    render(
      <NotificationItem
        notification={baseNotification}
        onMarkAsRead={mockOnMarkAsRead}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(baseNotification.message)).toBeInTheDocument();
    expect(screen.getByText("notifications.new")).toBeInTheDocument();
  });

  it('llama a onMarkAsRead cuando se hace clic en "Marcar como leída"', () => {
    render(
      <NotificationItem
        notification={baseNotification}
        onMarkAsRead={mockOnMarkAsRead}
        onDelete={mockOnDelete}
      />
    );

    const markButton = screen.getByRole("button", {
      name: "notifications.markAsRead",
    });
    fireEvent.click(markButton);
    expect(mockOnMarkAsRead).toHaveBeenCalledWith(baseNotification.id);
  });

  it("llama a onDelete cuando se hace clic en el botón de eliminar", () => {
    render(
      <NotificationItem
        notification={baseNotification}
        onMarkAsRead={mockOnMarkAsRead}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: "" });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(baseNotification.id);
  });

  it('no muestra "Marcar como leída" si la notificación ya está leída', () => {
    render(
      <NotificationItem
        notification={{ ...baseNotification, read: true }}
        onMarkAsRead={mockOnMarkAsRead}
        onDelete={mockOnDelete}
      />
    );

    expect(
      screen.queryByText("notifications.markAsRead")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("notifications.new")).not.toBeInTheDocument();
  });
});
