import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading text initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders the app title', async () => {
  render(<App />);
  const titleElement = await screen.findByText(/Book Catalogue/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders error message on fetch failure', async () => {
  render(<App />);
  const errorElement = await screen.findByText(/error loading data/i); // Simulated error state
  expect(errorElement).toBeInTheDocument();
});