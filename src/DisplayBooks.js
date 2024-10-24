import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook } from './api/books';

function BookList({ onEdit }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    getBooks().then(response => {
      setBooks(response.data);
    }).catch(error => {
      console.error('Error fetching books:', error);
    });
  };

  const handleDelete = (id) => {
    deleteBook(id).then(() => {
      alert('Book DELETED successfully');
      fetchBooks();  // Refresh the list after deletion
    }).catch(error => {
      console.error('Error deleting book:', error);
    });
  };

  return (
    <div>
      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>
                <button onClick={() => onEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
