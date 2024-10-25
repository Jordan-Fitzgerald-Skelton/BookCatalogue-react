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
  
  // Wait for the app to finish loading data
  const titleElement = await screen.findByText(/book catalogue/i); // Adjust if the title is different
  expect(titleElement).toBeInTheDocument();
});
