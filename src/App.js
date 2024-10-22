import React, { useState } from 'react';
import BookList from './DisplayBooks';
import AddBookForm from './CreateBooks';
import EditBookForm from './UpdateBooks';

function App() {
  const [editingBook, setEditingBook] = useState(null);

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleBookUpdated = () => {
    setEditingBook(null);  // Clear edit form after update
  };

  return (
    <div>
      <h1>Book Catalogue</h1>
      {editingBook ? (
        <EditBookForm bookId={editingBook.id} onBookUpdated={handleBookUpdated} />
      ) : (
        <AddBookForm onBookAdded={handleBookUpdated} />
      )}
      <BookList onEdit={handleEdit} />
    </div>
  );
}

export default App;