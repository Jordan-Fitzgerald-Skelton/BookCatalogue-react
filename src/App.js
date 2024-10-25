import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

const API_URL = 'http://localhost:4000/books';

// API functions
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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch books from API
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
    
    // Validation Logic
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
  
    // Reset any existing error before processing
    setError('');
  
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
    <form onSubmit={handleSubmit}>
      {Object.keys(book).map((key) => (
        <input
          key={key}
          name={key}
          value={book[key]}
          onChange={handleChange}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          type={key === 'pages' || key === 'rating' || key === 'price' ? 'number' : 'text'}
          required // Make inputs required
        />
      ))}
      <button type="submit">{editingBookId ? 'Update Book' : 'Add Book'}</button>
    </form>
  );

  const renderDetails = () => (
    <div>
      <h2>{selectedBook.title}</h2>
      <p><strong>Author:</strong> {selectedBook.author}</p>
      <p><strong>Description:</strong> {selectedBook.description}</p>
      <p><strong>Genre:</strong> {selectedBook.genre}</p>
      <p><strong>Pages:</strong> {selectedBook.pages}</p>
      <p><strong>Rating:</strong> {selectedBook.rating}</p>
      <p><strong>Price:</strong> €{selectedBook.price}</p>
      <button onClick={() => setView('list')}>Back to List</button>
    </div>
  );

  const renderList = () => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
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
        ))}
      </tbody>
    </Table>
  );  

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Book Catalogue</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => { resetForm(); setView('list'); }}>Home</Nav.Link>
              <Nav.Link onClick={() => { resetForm(); setView('form'); }}>Add New Book</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {view === 'form' && renderForm()}
      {view === 'details' && selectedBook && renderDetails()}
      {view === 'list' && renderList()}
    </div>
  );
}

export default App;