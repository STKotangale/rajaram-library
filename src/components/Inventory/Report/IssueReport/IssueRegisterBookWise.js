/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Auth/AuthProvider';
import { Download, Printer } from 'react-bootstrap-icons';
import '../CSS/Report.css';

// Utility function to format date to yyyy-mm-dd
const formatDate = (date) => {
    const d = new Date(date);
    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};


const IssueRegisterBookWise = () => {
    //get
    const [books, setBooks] = useState([]);
    //post
    const [bookname, setBookname] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    //modal
    const [showModal, setShowModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchBooks();
    }, [accessToken]);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const reportData = {
            bookName: bookname,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        };
        setIsLoading(true);
        try {
            const response = await fetch(`${BaseURL}/api/reports/issue-book-wise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(reportData),
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setShowModal(true);
            } else {
                toast.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting report');
        }
        setIsLoading(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
    };

    const handleDownloadPDF = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'issue-book-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(pdfUrl, '_blank', 'top=0,left=0,height=100%,width=auto');
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2>Issue Register Book Wise Report</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" controlId="bookName">
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Select
                                        value={bookname}
                                        onChange={(e) => setBookname(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a book</option>
                                        {books.map(book => (
                                            <option key={book.bookId} value={book.bookName}>
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
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit" disabled={isLoading}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Issue Book Wise Report</Modal.Title>
                    <Button variant="info" onClick={handleDownloadPDF} className="me-2">
                        <Download /> Download PDF
                    </Button>
                    <Button variant="primary" onClick={handlePrint} className="me-2">
                        <Printer /> Print
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <p>Loading PDF... Please wait.</p>
                    ) : pdfUrl ? (
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="500px" />
                    ) : (
                        <p>Error loading PDF. Please try again or contact support.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default IssueRegisterBookWise;