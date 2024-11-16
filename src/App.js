import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import axios from 'axios';
import GoogleBooksSearch from './GoogleBookSearch'; // Import the GoogleBooksSearch component

// Define the base URL for API calls
const API_URL = 'http://ec2-98-84-73-133.compute-1.amazonaws.com/books';

// Functions to interact with the API
export const getBooks = () => axios.get(API_URL); // Fetch all books
export const addBook = async (bookData) => {
  try {
    const response = await axios.post(API_URL, bookData); // Add a new book
    return response.data;
  } catch (error) {
    throw new Error('Error adding book');
  }
};
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book); // Update an existing book
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`); // Delete a book by ID
export const getBook = (id) => axios.get(`${API_URL}/${id}`); // Fetch a specific book by ID

function App() {
  // State variables to manage application data and UI
  const [books, setBooks] = useState([]); // List of all books
  const [book, setBook] = useState({ // State for the book form
    title: '',
    author: '',
    description: '',
    genre: '',
    pages: '',
    rating: '',
    price: ''
  });
  const [view, setView] = useState('list'); // Current view ('list', 'form', 'details', 'search')
  const [editingBookId, setEditingBookId] = useState(null); // ID of the book being edited
  const [selectedBook, setSelectedBook] = useState(null); // Book selected for details view
  const [loading, setLoading] = useState(false); // Loading state for asynchronous operations
  const [error, setError] = useState(''); // Error message state

  // Fetch books from the API when the component mounts
  useEffect(() => {
    if (view === 'list') {
      fetchBooks();
    }
  }, [view]);

  // Function to fetch all books and update state
  const fetchBooks = async () => {
    setLoading(true); // Show loading indicator
    setError(''); // Clear any previous errors
    try {
      const response = await getBooks();
      console.log(response.data); // Log the fetched data for debugging
      setBooks(response.data); // Update books state with fetched data
    } catch (error) {
      setError('Error fetching books'); // Show error message on failure
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value }); // Update the relevant field
  };

  // Handle form submission for adding or updating a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error

    // Form validation logic
    if (!book.title) {
      setError('Title is required');
      return;
    }
    if (!book.author) {
      setError('Author is required');
      return;
    }
    if (!book.genre) {
      setError('Genre is required');
      return;
    }
    if (book.pages < 1 || isNaN(book.pages)) {
      setError('Pages must be a positive number');
      return;
    }
    if (book.rating < 0 || book.rating > 5 || isNaN(book.rating)) {
      setError('Rating must be between 0 and 5');
      return;
    }
    if (book.price < 0 || isNaN(book.price)) {
      setError('Price must be a non-negative number');
      return;
    }

    try {
      if (editingBookId) {
        // If editing, update the book
        await updateBook(editingBookId, book);
        alert('Book updated successfully');
      } else {
        // If adding, create a new book
        await addBook(book);
        alert('Book added successfully');
      }
      fetchBooks(); // Refresh the book list
      resetForm(); // Clear the form
      setView('list'); // Switch back to list view
    } catch (error) {
      setError('Error saving book'); // Show error message
    }
  };

  // Reset the form and clear the current editing book ID
  const resetForm = () => {
    setBook({
      title: '',
      author: '',
      description: '',
      genre: '',
      pages: '',
      rating: '',
      price: ''
    });
    setEditingBookId(null);
  };

  // Handle editing of a book (populate the form with existing data)
  const handleEdit = async (bookToEdit) => {
    setEditingBookId(bookToEdit.id);
    setBook(bookToEdit); // Populate the form with book data
    setView('form'); // Switch to form view
  };

  // Handle deleting a book
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id); // Call API to delete the book
        alert('Book deleted successfully');
        fetchBooks(); // Refresh the book list
      } catch (error) {
        setError('Error deleting book'); // Show error message
      }
    }
  };

  // Show details of the selected book
  const handleShowDetails = (bookToShow) => {
    setSelectedBook({
      formatted_title: bookToShow.title || "No Title",
      formatted_author: bookToShow.author || "Unknown Author",
      formatted_description: bookToShow.description || "No Description",
      formatted_genre: bookToShow.genre || "N/A",
      formatted_pages: bookToShow.pages || "N/A",
      formatted_rating: bookToShow.rating || "N/A",
      formatted_price: bookToShow.price || "N/A"
    });
    setView('details');
  };  

  // Handle navigation and switching views
  const handleNavLinkClick = (viewName) => {
    setView(viewName);
    if (viewName !== 'search') {
      setSelectedBook(null); // Clear selected book when switching views
    }
  };

  // Render the book form
  const renderForm = () => (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      {error && <p className="text-danger">{error}</p>} {/* Show error message */}
      {Object.keys(book).map((key) => (
        <Form.Group className="mb-3" controlId={`form${key}`} key={key}>
          <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
          <Form.Control
            type={key === 'pages' || key === 'rating' || key === 'price' ? 'number' : 'text'}
            name={key}
            value={book[key]}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
            required
          />
        </Form.Group>
      ))}
      <Button variant="primary" type="submit">
        {editingBookId ? 'Update Book' : 'Add Book'}
      </Button>
    </Form>
  );

  // Render the details view
  const renderDetails = () => (
    <Card className="detail-card m-3 p-3 shadow-sm">
      <Card.Header as="h3" className="text-center text-primary">
        {selectedBook.formatted_title}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Author:</strong> {selectedBook.formatted_author}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Description:</strong> {selectedBook.formatted_description}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Genre:</strong> {selectedBook.formatted_genre}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Pages:</strong> {selectedBook.formatted_pages}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Rating:</strong> {selectedBook.formatted_rating}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Price:</strong> ${selectedBook.formatted_price}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer className="text-center">
        <Button variant="primary" onClick={() => setView('list')}>
          Back to List
        </Button>
      </Card.Footer>
    </Card>
  );

  // Render the list of books
  const renderList = () => (
    <Table striped bordered hover>
      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan="4">No books found</td>
          </tr>
        ) : (
          books.map((book) => (
            <tr key={book.id}>
              <td>{book.formatted_title}</td>
              <td>{book.formatted_author}</td>
              <td>{book.formatted_genre}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleShowDetails(book)}>Show</button>
                <button className="btn btn-warning" onClick={() => handleEdit(book)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <div>
      {/* Navigation bar */}
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Book Catalogue</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavLinkClick('list')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('form')}>Add New Book</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('search')}>Search Google Books</Nav.Link> {/* New tab */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Loading and error messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Render different views based on the current state */}
      {view === 'form' && renderForm()}
      {view === 'details' && selectedBook && renderDetails()}
      {view === 'list' && renderList()}
      {view === 'search' && <GoogleBooksSearch />} {/* Render GoogleBooksSearch when the tab is selected */}
    </div>
  );
}

export default App;