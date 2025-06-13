import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Devuelve la clave para simplificar
  }),
}));

describe('ErrorMessage component', () => {
  const errorText = 'Algo salió mal';

  it('renderiza el título y el mensaje de error', () => {
    render(<ErrorMessage error={errorText} />);

    expect(screen.getByText('common.error')).toBeInTheDocument();
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it('muestra el botón de reintentar si se pasa onRetry', () => {
    const onRetryMock = jest.fn();

    render(<ErrorMessage error={errorText} onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: 'common.retry' });
    expect(button).toBeInTheDocument();
  });

  it('no muestra el botón si onRetry no está definido', () => {
    render(<ErrorMessage error={errorText} />);

    const button = screen.queryByRole('button', { name: 'common.retry' });
    expect(button).not.toBeInTheDocument();
  });

  it('llama a onRetry cuando se hace clic en el botón', () => {
    const onRetryMock = jest.fn();

    render(<ErrorMessage error={errorText} onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: 'common.retry' });
    fireEvent.click(button);

    expect(onRetryMock).toHaveBeenCalled();
  });
});
