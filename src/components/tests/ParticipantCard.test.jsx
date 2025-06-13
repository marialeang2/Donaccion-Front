import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ParticipantCard from "../ParticipantCard";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Componente ParticipantCard", () => {
  const mockParticipant = {
    id: 1,
    status: "pending",
    request_date: new Date().toISOString(),
    user: { name: "Carlos Pérez", email: "carlos@example.com" },
    message: "Me encantaría participar en esta oportunidad.",
  };

  const onStatusChangeMock = jest.fn(() => Promise.resolve());
  const onGenerateCertificateMock = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra la información básica del participante", () => {
    render(
      <ParticipantCard
        participant={mockParticipant}
        onStatusChange={onStatusChangeMock}
        onGenerateCertificate={onGenerateCertificateMock}
      />
    );

    expect(screen.getByText("Carlos Pérez")).toBeInTheDocument();
    expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
    expect(screen.getByText(/participants.appliedOn/)).toBeInTheDocument();
    expect(
      screen.getByText("Me encantaría participar en esta oportunidad.")
    ).toBeInTheDocument();
  });

  it("muestra botones para aceptar o rechazar si el estado es pendiente", () => {
    render(
      <ParticipantCard
        participant={mockParticipant}
        onStatusChange={onStatusChangeMock}
        onGenerateCertificate={onGenerateCertificateMock}
      />
    );

    expect(screen.getByText("participants.accept")).toBeInTheDocument();
    expect(screen.getByText("participants.reject")).toBeInTheDocument();
  });

  it("llama a onStatusChange al hacer clic en aceptar", async () => {
    render(
      <ParticipantCard
        participant={mockParticipant}
        onStatusChange={onStatusChangeMock}
        onGenerateCertificate={onGenerateCertificateMock}
      />
    );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByText("participants.accept"));
    });

    expect(onStatusChangeMock).toHaveBeenCalledWith(1, "accepted");
  });

  it("muestra botón de certificado si el estado es aceptado", () => {
    const acceptedParticipant = { ...mockParticipant, status: "accepted" };

    render(
      <ParticipantCard
        participant={acceptedParticipant}
        onStatusChange={onStatusChangeMock}
        onGenerateCertificate={onGenerateCertificateMock}
      />
    );

    expect(
      screen.getByText("participants.generateCertificate")
    ).toBeInTheDocument();
  });

  it("llama a onGenerateCertificate al hacer clic en el botón correspondiente", async () => {
    const acceptedParticipant = { ...mockParticipant, status: "accepted" };

    render(
      <ParticipantCard
        participant={acceptedParticipant}
        onStatusChange={onStatusChangeMock}
        onGenerateCertificate={onGenerateCertificateMock}
      />
    );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(screen.getByText("participants.generateCertificate"));
    });

    expect(onGenerateCertificateMock).toHaveBeenCalledWith(acceptedParticipant);
  });
});
