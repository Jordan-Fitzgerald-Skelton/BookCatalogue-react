import axios from 'axios';

const API_URL = 'http://localhost:4000/books';

// Fetch all books
export const getBooks = () => {
  return axios.get(API_URL);
};

// Function to add a book
export const addBook = async (bookData) => {
  try {
    const response = await axios.post(API_URL, bookData); // Use API_URL here
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

// Update a book
export const updateBook = (id, book) => {
  return axios.put(`${API_URL}/${id}`, book);
};

// Delete a book
export const deleteBook = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Get a single book
export const getBook = (id) => {
  return axios.get(`${API_URL}/${id}`);
};
