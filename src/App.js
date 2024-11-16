import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { getBooks, addBook, updateBook, deleteBook } from './api/books'; // Removed getBook since it's not used

import GoogleBooksSearch from './GoogleBookSearch'; // Import the GoogleBooksSearch component

function App() {
  // State variables
  const [books, setBooks] = useState([]); // List of all books
  const [book, setBook] = useState({ // Book form state
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
  const [error, setError] = useState(''); // Error message state

  // Fetch books from the API when the component mounts
  useEffect(() => {
    if (view === 'list') {
      fetchBooks();
    }
  }, [view]);

  // Fetch books and handle loading/error
  const fetchBooks = async () => {
    setError('');
    try {
      const response = await getBooks();
      setBooks(response.data); // Set books in state
    } catch (error) {
      setError('Error fetching books');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding or updating a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!book.title || !book.author || !book.genre || book.pages < 1 || isNaN(book.pages) || book.rating < 0 || book.rating > 5 || isNaN(book.rating) || book.price < 0 || isNaN(book.price)) {
      setError('Please ensure all fields are filled correctly.');
      return;
    }

    try {
      if (editingBookId) {
        await updateBook(editingBookId, book); // Update book
        alert('Book updated successfully');
      } else {
        await addBook(book); // Add new book
        alert('Book added successfully');
      }
      fetchBooks(); // Refresh the list
      resetForm(); // Reset the form
      setView('list'); // Switch to list view
    } catch (error) {
      setError('Error saving book. Please try again.');
    }
  };

  // Reset the form and clear editing state
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

  // Handle editing a book
  const handleEdit = async (bookToEdit) => {
    setEditingBookId(bookToEdit.id);
    setBook(bookToEdit); // Populate the form with book data
    setView('form'); // Switch to form view
  };

  // Handle deleting a book
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id); // Delete book
        alert('Book deleted successfully');
        fetchBooks(); // Refresh list
      } catch (error) {
        setError('Error deleting book');
      }
    }
  };

  // Show book details
  const handleShowDetails = (bookToShow) => {
    setSelectedBook(bookToShow); // Set the selected book
    setView('details'); // Switch to details view
  };

  // Navigation handler
  const handleNavLinkClick = (viewName) => {
    setView(viewName);
    if (viewName !== 'search') {
      setSelectedBook(null); // Clear selected book when switching views
    }
  };

  // Render book form
  const renderForm = () => (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      {error && <p className="text-danger">{error}</p>}
      {Object.keys(book).map((key) => (
        <Form.Group className="mb-3" controlId={`form${key}`} key={key}>
          <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
          <Form.Control
            type={key === 'pages' || key === 'rating' || key === 'price' ? 'number' : 'text'}
            name={key}
            value={book[key]}
            onChange={handleChange}
            required
          />
        </Form.Group>
      ))}
      <Button variant="primary" type="submit">
        {editingBookId ? 'Update Book' : 'Add Book'}
      </Button>
    </Form>
  );

  // Render book list
  const renderList = () => {
    if (loading) {
      return <div>Loading...</div>; // Ensure this is rendered when loading is true
    }
  
    return (
      <Table striped bordered hover>
        <tbody>
          {books.length === 0 ? (
            <tr><td colSpan="4">No books found</td></tr>
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
  };  

  // Render book details
  const renderDetails = () => (
    <Card>
      <Card.Body>
        <Card.Title>{selectedBook?.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{selectedBook?.author}</Card.Subtitle>
        <Card.Text>{selectedBook?.description}</Card.Text>
        <ListGroup variant="flush">
          <ListGroup.Item>Genre: {selectedBook?.genre}</ListGroup.Item>
          <ListGroup.Item>Pages: {selectedBook?.pages}</ListGroup.Item>
          <ListGroup.Item>Rating: {selectedBook?.rating}</ListGroup.Item>
          <ListGroup.Item>Price: ${selectedBook?.price}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Book Catalogue</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link onClick={() => handleNavLinkClick('list')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('form')}>Add Book</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('search')}>Search Books</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {/* Conditional view rendering */}
        {view === 'list' && renderList()}
        {view === 'form' && renderForm()}
        {view === 'details' && renderDetails()}
        {view === 'search' && <GoogleBooksSearch />} {/* Google Books search component */}
      </Container>
    </div>
  );
}

export default App;