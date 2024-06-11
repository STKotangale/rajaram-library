/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import './CSS/Report.css';

// Utility function to format date to dd-mm-yyyy
const formatDate = (date) => {
    const d = new Date(date);
    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookReport = () => {
    //get books
    const [books, setBooks] = useState([]);
    //post
    const [bookId, setBookId] = useState('');
    const [bookName, setBookName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    //auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;


    useEffect(() => {
        fetchBooks();
    }, [username, accessToken]);

    //get api fot book name
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const result = await response.json();
            if (result.success) {
                setBooks(result.data);
            } else {
                toast.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Error fetching books');
        }
    };

    //post api
    const handleSubmit = async (event) => {
        event.preventDefault();

        const reportData = {
            bookId,
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
        };

        try {
            const response = await fetch(`${BaseURL}/api/auth/submit-book-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                toast.success('Report submitted successfully');
                // window.open('https://your-report-results-url.com', '_blank');
                // Optionally reset form fields
                setBookId('');
                setBookName('');
                setFromDate('');
                setToDate('');
            } else {
                toast.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting report');
        }
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2>Report Format</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" controlId="bookName">
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Select
                                        value={bookId}
                                        onChange={(e) => {
                                            const selectedBook = books.find(book => book.bookId === parseInt(e.target.value, 10));
                                            setBookId(e.target.value);
                                            setBookName(selectedBook ? selectedBook.bookName : '');
                                        }}
                                        required
                                    >
                                        <option value="">Select a book</option>
                                        {books.map(book => (
                                            <option key={book.bookId} value={book.bookId}>
                                                {book.bookName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default BookReport;
