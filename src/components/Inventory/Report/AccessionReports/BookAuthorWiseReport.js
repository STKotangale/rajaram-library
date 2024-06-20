/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Auth/AuthProvider';
import '../CSS/Report.css';
import { Button, Container, Row, Form, Modal } from 'react-bootstrap';
import { Download, Printer } from 'react-bootstrap-icons';

const BookAuthorWiseReport = () => {
    const [authors, setAuthors] = useState([]);
    const [selectedBookAuthorName, setSelectedBookAuthorName] = useState('');
    const [show, setShow] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchAuthors();
    }, [username, accessToken]);

    const fetchAuthors = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book-authors`);
            if (!response.ok) {
                throw new Error(`Error fetching authors: ${response.statusText}`);
            }
            const data = await response.json();
            setAuthors(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching authors. Please try again later.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShow(true);
        setIsLoading(true);
        try {
            const response = await fetch(`${BaseURL}/api/reports/acession-status-autherwise/${selectedBookAuthorName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/pdf'
                }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setBlobUrl(url);
            } else {
                throw new Error(`Failed to fetch PDF: ${await response.text()}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(`Error retrieving PDF: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        setShow(false);
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
        }
    };

    const handleDownloadPDF = () => {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'acession-status-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open(blobUrl, '_blank', 'top=0,left=0,height=100%,width=auto');
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2 className="text-primary">Book Author Wise Report</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mt-5">
                                <Form.Group className="mb-3" controlId="bookName">
                                    <Form.Label>Book Author</Form.Label>
                                    <Form.Select
                                        value={selectedBookAuthorName}
                                        onChange={(e) => setSelectedBookAuthorName(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Author</option>
                                        {authors.map(author => (
                                            <option key={author.authorId} value={author.authorName}>{author.authorName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <div className='mt-4 d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="flex-grow-1">Accession Status Report Book Author Wise</Modal.Title>
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
                    ) : (
                        blobUrl ? (
                            <embed src={blobUrl} type="application/pdf" width="100%" height="500px" />
                        ) : (
                            <p>Error loading PDF. Please try again or contact support.</p>
                        )
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default BookAuthorWiseReport;
