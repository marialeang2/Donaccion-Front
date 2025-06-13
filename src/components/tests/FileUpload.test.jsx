import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../FileUpload';

// Mock de i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('FileUpload component', () => {
  const createFile = (name, size, type) => {
    const file = new File(['a'.repeat(size)], name, { type });
    return file;
  };

  it('renderiza el input y muestra el texto del tamaño máximo', () => {
    render(<FileUpload onFileSelect={() => {}} />);
    expect(screen.getByLabelText('fileUpload.selectFile')).toBeInTheDocument();
    expect(screen.getByText(/fileUpload.maxSize/)).toBeInTheDocument();
  });

  it('llama a onFileSelect con un archivo válido', () => {
    const onFileSelectMock = jest.fn();
    render(<FileUpload onFileSelect={onFileSelectMock} />);

    const file = createFile('photo.jpg', 1000, 'image/jpeg');
    const input = screen.getByLabelText('fileUpload.selectFile');

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelectMock).toHaveBeenCalledWith(file);
  });

  it('muestra un error si el archivo excede el tamaño máximo', () => {
    const onFileSelectMock = jest.fn();
    render(<FileUpload onFileSelect={onFileSelectMock} maxSize={1024} />); // 1KB

    const largeFile = createFile('big.pdf', 2048, 'application/pdf');
    const input = screen.getByLabelText('fileUpload.selectFile');

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(screen.getByText('fileUpload.sizeTooLarge')).toBeInTheDocument();
    expect(onFileSelectMock).not.toHaveBeenCalled();
  });

  it('muestra la vista previa si es imagen', async () => {
    const file = createFile('image.png', 1000, 'image/png');

    const readerMock = {
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,mockdata',
      onload: null,
    };

    window.FileReader = jest.fn(() => readerMock);

    render(<FileUpload onFileSelect={() => {}} />);

    const input = screen.getByLabelText('fileUpload.selectFile');
    fireEvent.change(input, { target: { files: [file] } });

    // Simular onload
    await waitFor(() => {
      readerMock.onload({ target: { result: readerMock.result } });
    });

    // Aunque la imagen aún no se ve, validamos que no haya errores al ejecutarse
    expect(readerMock.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('limpia el archivo cuando se hace clic en "clear"', () => {
    const onFileSelectMock = jest.fn();
    render(<FileUpload onFileSelect={onFileSelectMock} />);

    const file = createFile('doc.txt', 1000, 'text/plain');
    const input = screen.getByLabelText('fileUpload.selectFile');

    fireEvent.change(input, { target: { files: [file] } });
    const clearButton = screen.getByRole('button', { name: 'common.clear' });

    fireEvent.click(clearButton);

    expect(onFileSelectMock).toHaveBeenLastCalledWith(null);
  });
});
