import axios from 'axios';

// The API URL for the backend (adjust if your backend is on a different port or domain)
const API_URL = 'http://ec2-98-84-73-133.compute-1.amazonaws.com/books';

// Fetch all books
export const getBooks = async () => {
  try {
    const response = await axios.get(API_URL);  // Send GET request to fetch books
    return response.data;  // Return the list of books
  } catch (error) {
    console.error('Error fetching books:', error);  // Handle errors
  }
};

// Function to add a new book
export const addBook = async (bookData) => {
  try {
    const response = await axios.post(API_URL, bookData);  // Send POST request to create a book
    return response.data;  // Return the added book data
  } catch (error) {
    console.error('Error adding book:', error);  // Handle errors
  }
};

// Function to update a book by ID
export const updateBook = async (id, bookData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, bookData);  // Send PUT request to update book by ID
    return response.data;  // Return the updated book data
  } catch (error) {
    console.error('Error updating book:', error);  // Handle errors
  }
};

// Function to delete a book by ID
export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);  // Send DELETE request to remove book by ID
    return response.data;  // Return the response data, or you can just return a success message
  } catch (error) {
    console.error('Error deleting book:', error);  // Handle errors
  }
};

// Function to get a single book by ID
export const getBook = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);  // Send GET request to fetch a specific book by ID
    return response.data;  // Return the book data
  } catch (error) {
    console.error('Error fetching book:', error);  // Handle errors
  }
};