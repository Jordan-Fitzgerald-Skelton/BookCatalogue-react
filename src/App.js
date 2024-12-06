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
import GoogleBooksSearch from './GoogleBookSearch';

//URL for accessing the EC2
const API_URL = 'http://ec2-98-84-73-133.compute-1.amazonaws.com/books';
//Functions to interact with the API
export const getBooks = () => axios.get(API_URL); // Fetch all books
export const addBook = async (bookData) => {
  try {
    //For adding a new book
    const response = await axios.post(API_URL, bookData);
    return response.data;
  } catch (error) {
    throw new Error(`Error adding book: ${error.response?.data?.message || error.message}`);
  }
};
//For updating a book
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
//For deleting a book
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
//For getting a book using it's id
export const getBook = (id) => axios.get(`${API_URL}/${id}`);

function App() {
  //State variables to manage application data and the UI
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
  //Sets the view list 
  const [view, setView] = useState('list');
  const [editingBookId, setEditingBookId] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //Fetchs the books from the API
  useEffect(() => {
    if (view === 'list') {
      fetchBooks();
    }
  }, [view]);

  //Fetches all books and update the state
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getBooks();
      console.log(response.data);
      setBooks(response.data);
    } catch (error) {
      setError('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  //Handles the input changes
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };  

  //Handles the form when it is submitted for adding or updating a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      genre: book.genre || '',
      pages: parseInt(book.pages, 10) || 0,
      rating: parseFloat(book.rating) || 0,
      price: parseFloat(book.price) || 0
    };        

    console.log('Payload being sent:', payload);

    try {
      if (editingBookId) {
        //For editing a book
        await updateBook(editingBookId, book);
        alert('Book updated successfully');
      } else {
        //For creating a new book
        await addBook(payload);
        //Resets the form
        resetForm();
        alert('Book added successfully');
      }
      //Refresh the list
      fetchBooks();
      //reset the form
      resetForm();
      //set the view to list
      setView('list');
    } catch (error) {
      setError('Error saving book');
    }
  };

  //Resets the form
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

  //Handles editing a book
  const handleEdit = (bookToEdit) => {
    setEditingBookId(bookToEdit.id);
    setBook({
      title: bookToEdit.title || '',
      author: bookToEdit.author || '',
      description: bookToEdit.description || '',
      genre: bookToEdit.genre || '',
      pages: bookToEdit.pages || '',
      rating: bookToEdit.rating || '',
      price: bookToEdit.price || ''
    });
    setView('form');
  };    

  //Handles deleting a book
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        alert('Book deleted successfully');
        //Refresh the book list
        fetchBooks();
      } catch (error) {
        setError('Error deleting book');
      }
    }
  };

  //Show details of the book
  const handleShowDetails = (bookToShow) => {
    setSelectedBook(bookToShow);
    setView('details');
  };

  //Handles the navigation and switching between views
  const handleNavLinkClick = (viewName) => {
    setView(viewName);
    if (viewName !== 'search') {
      //Clear the book
      setSelectedBook(null);
    }
  };

  //Renders the book form
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

  //Renders the book details
  const renderDetails = () => (
    <Card className="detail-card m-3 p-3 shadow-sm">
      <Card.Header as="h3" className="text-center text-primary">
        {selectedBook.title}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Title:</strong> {selectedBook.title}</ListGroup.Item>
          <ListGroup.Item><strong>Author:</strong> {selectedBook.author}</ListGroup.Item>
          <ListGroup.Item><strong>Description:</strong> {selectedBook.description}</ListGroup.Item>
          <ListGroup.Item><strong>Genre:</strong> {selectedBook.genre}</ListGroup.Item>
          <ListGroup.Item><strong>Pages:</strong> {selectedBook.pages}</ListGroup.Item>
          <ListGroup.Item><strong>Rating:</strong> {selectedBook.rating}</ListGroup.Item>
          <ListGroup.Item><strong>Price:</strong> {selectedBook.price}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer className="text-center">
        <Button variant="primary" onClick={() => setView('list')}>
          Back to List
        </Button>
      </Card.Footer>
    </Card>
  );
  
  //Renders the list of books
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
        {books.length === 0 ? (
          <tr>
            <td colSpan="5">No books found</td>
          </tr>
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
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Book Catalogue</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavLinkClick('list')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('form')}>Add New Book</Nav.Link>
              <Nav.Link onClick={() => handleNavLinkClick('search')}>Search Google Books</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/*Renders the different views based on the current state*/}
      {view === 'form' && renderForm()}
      {view === 'details' && selectedBook && renderDetails()}
      {view === 'list' && renderList()}
      {/*Renders the GoogleBooksSearch*/}
      {view === 'search' && <GoogleBooksSearch />}
    </div>
  );
}
export default App;