import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const GoogleBooksSearch = () => {
  // State to hold the search query input from the user
  const [query, setQuery] = useState('');

  // State to hold the search results (books data)
  const [results, setResults] = useState([]);

  // State to manage the loading state for when data is being fetched
  const [loading, setLoading] = useState(false);

  // Function that is triggered when the search button is clicked
  const handleSearch = async () => {
    if (!query) return; // If empty then exit
    setLoading(true); // Set loading to true if data is being fetched
    try {
      // endpoint to call to get the data
      const response = await axios.get('http://ec2-98-84-73-133.compute-1.amazonaws.com/books/search', {
        params: { q: query }, // Send query as a parameter to the API
      });

      // Set the response data to the results state (if response contains data)
      setResults(response.data.items || []);
    } catch (error) {
      // If there's an error, show an alert message
      alert('Error fetching data from Google Books API');
    } finally {
      setLoading(false); // Set loading state to false when request is done
    }
  };

  return (
    <div className="p-3">
      <h2>Search Google Books</h2>

      {/* Input field to enter the book title or author */}
      <Form.Control
        type="text"
        placeholder="Enter book title or author"
        value={query} // Bind the input value to the query state
        onChange={(e) => setQuery(e.target.value)} // Update query state when the user types
      />
      
      {/* Search button*/}
      <Button className="mt-2" onClick={handleSearch} disabled={loading}>
        Search
      </Button>

      {/* Display loading message when data is being retrieved */}
      {loading && <p>Loading...</p>}

      {/* Used to display the results */}
      <ListGroup>
        {results.map((book) => (
          <ListGroup.Item key={book.id}> {/* Each book result is displayed as a ListGroup item */}
            <strong>{book.volumeInfo.title}</strong> {/* Display the book title */}
            by {book.volumeInfo.authors?.join(', ')} {/* Display authors (if any) */}
            <br />
            {/* Link to more information about the book */}
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