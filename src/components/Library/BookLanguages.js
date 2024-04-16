/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';

const BookLanguages = () => {
  const [bookLanguages, setBookLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Ensure the REACT_APP_BASE_URL is set in your .env file
  const BaseURL = process.env.REACT_APP_BASE_URL;

  // Fetch book languages from the API
  const fetchBookLanguages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${BaseURL}/api/book-languages`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookLanguages(data.data); // Assumes the JSON response structure you provided
    } catch (error) {
      setError('Failed to load book languages: ' + error.message);
      console.error('Error fetching book languages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookLanguages();
  }, []);

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Book Name</th>
            <th>Is Blocked</th>
          </tr>
        </thead>
        <tbody>
          {bookLanguages.length > 0 ? (
            bookLanguages.map((language) => (
              <tr key={language.bookLangId}>
                <td>{language.bookLangId}</td>
                <td>{language.bookLangName}</td>
                <td>{language.isBlock === null ? 'Unknown' : (language.isBlock ? 'Yes' : 'No')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No book languages found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BookLanguages;
