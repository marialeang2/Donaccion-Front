import React from 'react';
import { render, screen } from '@testing-library/react';
import DonationCard from '../DonationCard';
import { MemoryRouter } from 'react-router-dom';

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('DonationCard component', () => {
  const baseDonation = {
    amount: 50000,
    is_monthly: false,
    foundation: {
      id: 42,
      legal_name: 'Fundación Esperanza',
    },
    dedication: null,
  };

  it('muestra el monto correctamente formateado', () => {
    render(
      <MemoryRouter>
        <DonationCard donation={baseDonation} />
      </MemoryRouter>
    );

    // Buscar cualquier string que contenga "50.000"
    expect(
      screen.getByText((text) => text.includes('50.000'))
    ).toBeInTheDocument();
  });

  it('muestra el badge mensual si is_monthly es true', () => {
    const monthlyDonation = { ...baseDonation, is_monthly: true };
    render(
      <MemoryRouter>
        <DonationCard donation={monthlyDonation} />
      </MemoryRouter>
    );

    expect(screen.getByText('donations.monthly')).toBeInTheDocument();
  });

  it('muestra el nombre de la fundación con link si showFoundation es true', () => {
    render(
      <MemoryRouter>
        <DonationCard donation={baseDonation} showFoundation={true} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Fundación Esperanza/i });
    expect(link).toHaveAttribute('href', '/foundations/42');
  });

  it('muestra la dedicatoria si existe', () => {
    const withDedication = { ...baseDonation, dedication: 'Para mi abuela' };
    render(
      <MemoryRouter>
        <DonationCard donation={withDedication} />
      </MemoryRouter>
    );

    // Solo verificamos la dedicatoria como contenido importante
    expect(screen.getByText(/"Para mi abuela"/i)).toBeInTheDocument();
  });

  it('no muestra dedicatoria si no existe', () => {
    render(
      <MemoryRouter>
        <DonationCard donation={baseDonation} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/"Para mi abuela"/i)).not.toBeInTheDocument();
  });
});
