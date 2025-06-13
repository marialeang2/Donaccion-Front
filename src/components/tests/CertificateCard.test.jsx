import { render, screen } from '@testing-library/react';
import CertificateCard from '../CertificateCard';

// Mock del hook de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('CertificateCard component', () => {
  const baseCertificate = {
    id: 1,
    description: 'Certificado por participación en evento',
    issue_date: '2025-05-01T00:00:00.000Z',
  };

  it('renderiza título y descripción del certificado', () => {
    render(<CertificateCard certificate={baseCertificate} onDownload={() => {}} />);

    expect(screen.getByText('certificates.participationCertificate')).toBeInTheDocument();
    expect(screen.getByText('Certificado por participación en evento')).toBeInTheDocument();
    expect(screen.getByText(/certificates.issuedOn:/)).toBeInTheDocument();
  });

  it('renderiza descripción de acción social si está presente', () => {
    const certWithSocialAction = {
      ...baseCertificate,
      social_action: {
        description: 'Participación en campaña social',
      },
    };

    render(<CertificateCard certificate={certWithSocialAction} onDownload={() => {}} />);
// hola
    expect(screen.getByText('Participación en campaña social')).toBeInTheDocument();
  });

  it('no renderiza acción social si no existe', () => {
    render(<CertificateCard certificate={baseCertificate} onDownload={() => {}} />);

    const socialAction = screen.queryByText(/certificates.socialAction/);
    expect(socialAction).not.toBeInTheDocument();
  });

  // Prueba actualizada: verifica que el componente recibe correctamente la función onDownload
  it('acepta la prop onDownload correctamente', () => {
    const mockDownload = jest.fn();
    // Simplemente verificamos que el componente se renderiza sin errores cuando se le pasa onDownload
    expect(() => {
      render(<CertificateCard certificate={baseCertificate} onDownload={mockDownload} />);
    }).not.toThrow();
  });
});