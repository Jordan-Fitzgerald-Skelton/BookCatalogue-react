import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading text initially', () => {
  render(<App />);
  
  // Check for loading text when the app is still loading
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders the app title', async () => {
  render(<App />);
  
  // Wait for the title text after the loading finishes
  const titleElement = await screen.findByText(/book catalogue/i); // Adjust if the title is different
  expect(titleElement).toBeInTheDocument();
});