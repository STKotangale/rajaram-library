/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Auth/AuthProvider';
import '../CSS/Report.css';
import { Button, Container, Row, Form, Modal } from 'react-bootstrap';
import { Download, Printer } from 'react-bootstrap-icons';

const BookTypeWiseReport = () => {
    //get book types
    const [bookTypes, setBookTypes] = useState([]);
    // bookTypeId and bookTypeName
    const [bookTypeName, setBookTypeName] = useState('');
    const [bookTypeId, setBookTypeId] = useState('');
    //pdf
    const [show, setShow] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    //auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchBookTypes();
    }, [username, accessToken]);


    //get book type
    const fetchBookTypes = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/booktype/book-types`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book types: ${response.statusText}`);
            }
            const data = await response.json();
            const sortedBookTypes = data.data.sort((a, b) => a.bookTypeName.localeCompare(b.bookTypeName));
            setBookTypes(sortedBookTypes);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book types. Please try again later.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShow(true);
        setIsLoading(true);

        const payloadData = {
            bookTypeId: bookTypeId,
            bookTypeName:bookTypeName,
        };
        try {
            const response = await fetch(`${BaseURL}/api/reports/acession-status-booktype-wise`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify(payloadData)  
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
            setBlobUrl(null);
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
        link.href={blobUrl};
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

    const handleBookTypeChange = (e) => {
        const selectedBookTypeName = e.target.value;
        setBookTypeName(selectedBookTypeName);
        const selectedBookType = bookTypes.find(bookType => bookType.bookTypeName === selectedBookTypeName);
        if (selectedBookType) {
            setBookTypeId(selectedBookType.bookTypeId);
        } else {
            setBookTypeId('');
        }
    };

    

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2 className="text-primary">Book Type Wise Report</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mt-5">
                                <Form.Group className="mb-3" controlId="bookTypeName">
                                    <Form.Label>Book Type</Form.Label>
                                    <input
                                        list="bookTypes"
                                        className="form-control"
                                        placeholder="Select or search book type"
                                        value={bookTypeName}
                                        onChange={handleBookTypeChange}
                                        required
                                    />
                                    <datalist id="bookTypes">
                                        {bookTypes.map(bookType => (
                                            <option key={bookType.bookTypeId} value={bookType.bookTypeName}></option>
                                        ))}
                                    </datalist>
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
                    <Modal.Title className="flex-grow-1">Accession Status Report Book Type Wise</Modal.Title>
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
                    ) : blobUrl ? (
                        <embed src={blobUrl} type="application/pdf" width="100%" height="500px" />
                    ) : (
                        <p>Error loading PDF. Please try again or contact support.</p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
};

export default BookTypeWiseReport;