import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { MemoryRouter } from 'react-router-dom';

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Simula traducciones devolviendo la clave
  }),
}));

describe('Footer component', () => {
  it('renderiza el título Don Acción', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Don Acción')).toBeInTheDocument();
  });

  it('renderiza textos traducidos', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('footer.description')).toBeInTheDocument();
    expect(screen.getByText('footer.explore')).toBeInTheDocument();
    expect(screen.getByText('footer.company')).toBeInTheDocument();

    // Usamos funciones flexibles para textos combinados
    expect(
      screen.getByText((text) => text.includes('footer.allRights'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes('footer.madeWith'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((text) => text.includes('footer.inColombia'))
    ).toBeInTheDocument();
  });

  it('renderiza los enlaces de navegación correctamente', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'footer.foundations' })).toHaveAttribute('href', '/foundations');
    expect(screen.getByRole('link', { name: 'footer.opportunities' })).toHaveAttribute('href', '/opportunities');
    expect(screen.getByRole('link', { name: 'footer.about' })).toHaveAttribute('href', '/about');
  });

  it('muestra el año actual', () => {
    const currentYear = new Date().getFullYear();
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });


});
