/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

// Utility function to convert date to dd-mm-yyyy format
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookList = () => {
    // auth
    const { accessToken, userId } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    // state
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookData, setBookData] = useState([]);

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert dates to dd-mm-yyyy format
        const formattedFromDate = formatDateToDDMMYYYY(fromDate);
        const formattedToDate = formatDateToDDMMYYYY(toDate);

        try {
            const response = await fetch(`${BaseURL}/api/general-members/bookIssueDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    userId,
                    startDate: formattedFromDate,
                    endDate: formattedToDate
                })
            });
            if (!response.ok) {
                throw new Error(`Error submitting data: ${response.statusText}`);
            }
            const result = await response.json();
            // Format dates in the response to dd-mm-yyyy
            const formattedResult = result.map(book => ({
                ...book,
                issueDate: formatDateToDDMMYYYY(book.issueDate),
                returnDate: formatDateToDDMMYYYY(book.returnDate),
                confirmDate: formatDateToDDMMYYYY(book.confirmDate)
            }));
            setBookData(formattedResult);
            toast.success('Data submitted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Error submitting data. Please try again later.');
        }
    };

    return (
        <div className="main-content">
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>From Date</Form.Label>
                        <Form.Control
                            type="date"
                            className="small-input"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>To Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="custom-date-picker small-input"
                        />
                    </Form.Group>
                </Row>
                <Button type="submit" className="mb-3">Submit</Button>
            </Form>

            <Container className='small-screen-table'>
                <div className='mt-3'>
                    <div className="table-responsive table-height">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Book Name</th>
                                    <th>Copy No.</th>
                                    <th>Issue Date</th>
                                    <th>Return Date</th>
                                    <th>Confirm Return Date </th>
                                    <th>Fine Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookData.map((book, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{book.bookName}</td>
                                        <td>{book.purchaseCopyNo}</td>
                                        <td>{book.issueDate}</td>
                                        <td>{book.returnDate}</td>
                                        <td>{book.confirmDate}</td>
                                        <td>{book.fineAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="pagination-container">
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default BookList;
