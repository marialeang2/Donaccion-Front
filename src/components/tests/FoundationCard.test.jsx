import React from 'react';
import { render, screen } from '@testing-library/react';
import FoundationCard from '../FoundationCard';
import { MemoryRouter } from 'react-router-dom';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock del botón de favoritos para evitar su lógica interna
jest.mock('../FavoriteButton', () => (props) => (
  <button data-testid="mock-favorite-button">Favorite</button>
));

// Mock del helper de imagen
jest.mock('../../utils/ImageUtils', () => ({
  getConsistentImage: (type, id) => `/mocked-image/${type}/${id}`,
}));

describe('FoundationCard component', () => {
  const mockFoundation = {
    id: 1,
    legal_name: 'Fundación Ejemplo',
    address: 'Calle Falsa 123',
    description: 'Esta es una fundación dedicada a ayudar.',
    verified: true,
    image_url: null,
  };

  const user = { id: 99, name: 'Juan' };

  it('renderiza nombre, dirección y descripción', () => {
    render(
      <MemoryRouter>
        <FoundationCard foundation={mockFoundation} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText('Fundación Ejemplo')).toBeInTheDocument();
    expect(screen.getByText('Calle Falsa 123')).toBeInTheDocument();
    expect(screen.getByText('Esta es una fundación dedicada a ayudar.')).toBeInTheDocument();
  });

  it('muestra el badge de verificación si la fundación está verificada', () => {
    render(
      <MemoryRouter>
        <FoundationCard foundation={{ ...mockFoundation, verified: true }} user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText('foundations.verified')).toBeInTheDocument();
  });

  it('muestra el botón de favoritos si hay usuario y showFavorite es true', () => {
    render(
      <MemoryRouter>
        <FoundationCard foundation={mockFoundation} user={user} showFavorite={true} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-favorite-button')).toBeInTheDocument();
  });

  it('no muestra el botón de favoritos si no hay usuario', () => {
    render(
      <MemoryRouter>
        <FoundationCard foundation={mockFoundation} user={null} showFavorite={true} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('mock-favorite-button')).not.toBeInTheDocument();
  });

  it('renderiza los botones con los enlaces correctos', () => {
  render(
    <MemoryRouter>
      <FoundationCard foundation={mockFoundation} user={user} />
    </MemoryRouter>
  );

  expect(screen.getByText('common.viewDetails')).toHaveAttribute('href', '/foundations/1');
  expect(screen.getByText('common.donate')).toHaveAttribute('href', '/donate/1');
});

});
