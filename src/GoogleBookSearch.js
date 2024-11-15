import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const GoogleBooksSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get('http://ec2-98-84-73-133.compute-1.amazonaws.com/books/search', {
        params: { q: query },
      });
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
      <Button className="mt-2" onClick={handleSearch} disabled={loading}>
        Search
      </Button>
      {loading && <p>Loading...</p>}
      <ListGroup>
        {results.map((book) => (
          <ListGroup.Item key={book.id}>
            <strong>{book.volumeInfo.title}</strong> by {book.volumeInfo.authors?.join(', ')}
            <br />
            <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">
              More Info
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default GoogleBooksSearch;