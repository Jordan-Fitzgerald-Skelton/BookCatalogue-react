import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const GoogleBooksSearch = () => {
  //Holds the search query
  const [query, setQuery] = useState('');

  //Holds the search results
  const [results, setResults] = useState([]);

  //Loading state for when data is being fetched
  const [loading, setLoading] = useState(false);

  //Triggered when the search button is clicked
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      //Endpoint to call to get the data
      const response = await axios.get('http://ec2-98-84-73-133.compute-1.amazonaws.com/books/search', {
         //Send the query as a parameter to the API
        params: { q: query }
      });

      //Sets the response data to the results state
      setResults(response.data.items || []);
    } catch (error) {
      alert('Error fetching data from Google Books API');
    } finally {
      //Sets the loading state to false when request is done
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <h2>Search Google Books</h2>

      {/*Input fort he book title or author*/}
      <Form.Control
        type="text"
        placeholder="Enter book title or author"
        value={query}
        //Updates the query state when the user types
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {/* Search button*/}
      <Button className="mt-2" onClick={handleSearch} disabled={loading}>
        Search
      </Button>

      {loading && <p>Loading...</p>}

      {/*Used to display the results*/}
      <ListGroup>
        {results.map((book) => (
          <ListGroup.Item key={book.id}>
            <strong>{book.volumeInfo.title}</strong>
            by {book.volumeInfo.authors?.join(', ')} 
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