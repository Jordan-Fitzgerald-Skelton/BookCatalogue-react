import React, { useState } from 'react';
import { addBook } from './api/books';

function AddBookForm({ onBookAdded }) {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    pages: '',
    rating: '',
    price: ''
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook(book).then(() => {
      alert('Book added successfully');
      onBookAdded();  // Refresh book list
    }).catch(error => {
      console.error('Error adding book:', error);
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
      <button type="submit">Add Book</button>
    </form>
  );
}

export default AddBookForm;
