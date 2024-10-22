import React, { useState, useEffect } from 'react';
import { updateBook, getBook } from './api/books';

function UpdateBookForm({ bookId, onBookUpdated }) {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    pages: '',
    rating: '',
    price: ''
  });

  useEffect(() => {
    getBook(bookId).then(response => {
      setBook(response.data);
    }).catch(error => {
      console.error('Error fetching book:', error);
    });
  }, [bookId]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBook(bookId, book).then(() => {
      alert('Book updated successfully');
      onBookUpdated();  // Refresh book list
    }).catch(error => {
      console.error('Error updating book:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={book.title} onChange={handleChange} placeholder="Title" />
      <input name="author" value={book.author} onChange={handleChange} placeholder="Author" />
      <input name="description" value={book.description} onChange={handleChange} placeholder="Description" />
      <input name="genre" value={book.genre} onChange={handleChange} placeholder="Genre" />
      <input name="pages" value={book.pages} onChange={handleChange} placeholder="Pages" type="number" />
      <input name="rating" value={book.rating} onChange={handleChange} placeholder="Rating" type="number" />
      <input name="price" value={book.price} onChange={handleChange} placeholder="Price" type="number" />
      <button type="submit">Update Book</button>
    </form>
  );
}

export default UpdateBookForm;
