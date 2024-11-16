import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock API response if needed
jest.mock('./api', () => ({
  fetchData: jest.fn(() =>
    Promise.resolve({ title: 'Book Catalogue' })
  ),
}));

test('renders loading text initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders the app title after loading', async () => {
  render(<App />);

  // Wait for the app to finish loading
  const titleElement = await screen.findByText(/book catalogue/i);
  expect(titleElement).toBeInTheDocument();
});