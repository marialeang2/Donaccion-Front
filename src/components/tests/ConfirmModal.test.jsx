import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../ConfirmModal';

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ConfirmModal component', () => {
  const baseProps = {
    show: true,
    onHide: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Eliminar elemento',
    message: '¿Estás seguro de que deseas eliminar este elemento?',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el modal con título y mensaje', () => {
    render(<ConfirmModal {...baseProps} />);
    expect(screen.getByText('Eliminar elemento')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de que deseas eliminar este elemento?')).toBeInTheDocument();
  });

  it('llama a onHide al hacer clic en Cancelar', () => {
    render(<ConfirmModal {...baseProps} />);
    const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
    fireEvent.click(cancelButton);
    expect(baseProps.onHide).toHaveBeenCalled();
  });

  it('llama a onConfirm al hacer clic en Confirmar', () => {
    render(<ConfirmModal {...baseProps} />);
    const confirmButton = screen.getByRole('button', { name: 'common.confirm' });
    fireEvent.click(confirmButton);
    expect(baseProps.onConfirm).toHaveBeenCalled();
  });

  it('no renderiza nada si show es false', () => {
    render(<ConfirmModal {...baseProps} show={false} />);
    expect(screen.queryByText(baseProps.title)).not.toBeInTheDocument();
  });
});
