import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CommentSection from '../CommentSection';

// Mock para i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, 
  }),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CommentSection component', () => {
  const baseProps = {
    itemId: 1,
    itemType: 'foundation',
    user: { id: 123, name: 'Juan' },
  };

  it('renderiza correctamente el título y el mensaje de "no hay comentarios"', async () => {
    render(<CommentSection {...baseProps} />);

  await waitFor(() => {
  expect(screen.getByText('comments.title')).toBeInTheDocument();
});

expect(screen.getByText('comments.noComments')).toBeInTheDocument();

  });

  it('muestra el formulario si hay usuario autenticado', async () => {
    render(<CommentSection {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('comments.placeholder')).toBeInTheDocument();
    });
  });

  it('no muestra el formulario si no hay usuario', async () => {
    render(<CommentSection itemId={1} itemType="foundation" user={null} />);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('comments.placeholder')).not.toBeInTheDocument();
    });
  });

  it('hace una petición fetch al cargar los comentarios (foundation)', async () => {
    render(<CommentSection {...baseProps} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/comments/foundation/1'
      );
    });
  });

  it('hace una petición fetch diferente si itemType es "opportunity"', async () => {
    render(
      <CommentSection itemId={2} itemType="opportunity" user={{ id: 1, name: 'Test' }} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/comments/opportunity/2'
      );
    });
  });
});
