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

// Define the base URL for API calls
const API_URL = 'http://ec2-98-84-73-133.compute-1.amazonaws.com/books';

// Functions to interact with the API
export const getBooks = () => axios.get(API_URL);
export const addBook = async (bookData) => {
  try {
    const response = await axios.post(API_URL, bookData);
    return response.data;
  } catch (error) {
    throw new Error('Error adding book');
  }
};
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
export const getBook = (id) => axios.get(`${API_URL}/${id}`);

function App() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    pages: '',
    rating: '',
    price: ''
  });
  const [view, setView] = useState('list');
  const [editingBookId, setEditingBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      setError('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!book.title || !book.author || !book.genre || isNaN(book.pages) || isNaN(book.rating) || isNaN(book.price)) {
      setError('All fields are required and must be valid.');
      return;
    }

    try {
      if (editingBookId) {
        await updateBook(editingBookId, book);
        alert('Book updated successfully');
      } else {
        await addBook(book);
        alert('Book added successfully');
      }
      fetchBooks();
      resetForm();
      setView('list');
    } catch (error) {
      setError('Error saving book');
    }
  };

  const handleEdit = async (bookToEdit) => {
    setEditingBookId(bookToEdit.id);
    setBook(bookToEdit);
    setView('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        alert('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        setError('Error deleting book');
      }
    }
  };

  const handleShowDetails = (bookToShow) => {
    setSelectedBook(bookToShow);
    setView('details');
  };

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

  const renderDetails = () => (
    <Card className="detail-card m-3 p-3 shadow-sm">
      <Card.Header as="h3" className="text-center text-primary">
        {selectedBook.title}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Author:</strong> {selectedBook.author}</ListGroup.Item>
          <ListGroup.Item><strong>Description:</strong> {selectedBook.description}</ListGroup.Item>
          <ListGroup.Item><strong>Genre:</strong> {selectedBook.genre}</ListGroup.Item>
          <ListGroup.Item><strong>Pages:</strong> {selectedBook.pages}</ListGroup.Item>
          <ListGroup.Item><strong>Rating:</strong> {selectedBook.rating}</ListGroup.Item>
          <ListGroup.Item><strong>Price:</strong> ${selectedBook.price}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer className="text-center">
        <Button variant="primary" onClick={() => setView('list')}>Back to List</Button>
      </Card.Footer>
    </Card>
  );

  const renderList = () => (
    <Table striped bordered hover>
      <tbody>
        {books.length === 0 ? (
          <tr><td colSpan="4">No books found</td></tr>
        ) : (
          books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
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

  const renderGoogleBooks = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/search`, { params: { q: query } });
        setResults(response.data.items || []);
      } catch (error) {
        alert('Error fetching data from Google Books API');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-3">
        <h2>Search Google Books</h2>
        <Form.Control
          type="text"
          placeholder="Enter book title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="mt-2" onClick={handleSearch} disabled={loading}>Search</Button>
        {loading && <p>Loading...</p>}
        <ListGroup>
          {results.map((book) => (
            <ListGroup.Item key={book.id}>
              <strong>{book.volumeInfo.title}</strong> by {book.volumeInfo.authors?.join(', ')}
              <br />
              <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">More Info</a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Book Catalogue</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setView('list')}>Home</Nav.Link>
              <Nav.Link onClick={() => setView('form')}>Add New Book</Nav.Link>
              <Nav.Link onClick={() => setView('googleBooks')}>Search Google Books</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {view === 'form' && renderForm()}
      {view === 'details' && selectedBook && renderDetails()}
      {view === 'list' && renderList()}
      {view === 'googleBooks' && renderGoogleBooks()}
    </div>
  );
}

export default App;