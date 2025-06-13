// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main navigation brand', () => {
  render(<App />);
  // Use getByRole to target the link with the accessible name "Don Acción"
  const brandLink = screen.getByRole('link', { name: /Don Acción/i });
  expect(brandLink).toBeInTheDocument();
});
