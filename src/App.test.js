import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios'); // Mock axios to avoid real API calls

beforeEach(() => {
  axios.get.mockResolvedValue({ data: [] }); // Mock an empty list response for API call
});

test('renders loading text initially', async () => {
  await act(async () => {
    render(<App />);
  });
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders the app title', async () => {
  await act(async () => {
    render(<App />);
  });

  // Wait for the app to finish loading data
  const titleElement = await screen.findByText(/book catalogue/i); // Adjust if the title is different
  expect(titleElement).toBeInTheDocument();
});