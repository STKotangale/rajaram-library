/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import '../CommonFiles/CommonCSS/MemberDashboard.css';

// Utility function to format date to dd-mm-yyyy
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookList = () => {
    // auth
    const { accessToken, memberId } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    // state
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookData, setBookData] = useState([]);

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fromDate || !toDate) {
            toast.error('Please select both From Date and To Date.');
            return;
        }
  
        try {
            const response = await fetch(`${BaseURL}/api/general-members/bookIssueDetails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    userId:memberId,
                    startDate: formatDateToDDMMYYYY(fromDate),
                    endDate: formatDateToDDMMYYYY(toDate)
                })
            });
            if (!response.ok) {
                throw new Error(`Error submitting data: ${response.statusText}`);
            }
            const result = await response.json();
            setBookData(result);
            toast.success('Data submitted successfully');

            // // Reset date fields after successful submission
            // setFromDate('');
            // setToDate('');
        } catch (error) {
            console.error(error);
            toast.error('Error submitting data. Please try again later.');
        }
    };


    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;
    const totalPages = Math.ceil(bookData.length / perPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // First and last page navigation functions
    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const indexOfLastBookType = currentPage * perPage;
    const indexOfNumber = indexOfLastBookType - perPage;
    const currentData = bookData.slice(indexOfNumber, indexOfLastBookType);



    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <Form onSubmit={handleSubmit}>
                    <Row className="mt-4">
                        <Form.Group as={Col} lg={3}>
                            <Form.Label>From Date</Form.Label>
                            <Form.Control
                                type="date"
                                className="small-input"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} lg={3}>
                            <Form.Label>To Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="custom-date-picker small-input"
                            />
                        </Form.Group>
                    </Row>
                    <div className=''>
                        <Button type="submit" className="mt-3 button-color">Submit</Button>
                    </div>
                </Form>

                <Container className='small-screen-table'>
                    <div className='mt-4'>
                        <div className="table-responsive table-height-book-list">
                            <Table striped bordered hover >
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
                                    {currentData.map((book, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{book.bookName}</td>
                                            <td>{book.purchaseCopyNo}</td>
                                            <td>{book.issueDate}</td>
                                            <td>{book.returnDate}</td>
                                            <td>{book.confirmReturnDate}</td>
                                            <td>{book.maxFineAmount != null ? book.maxFineAmount.toFixed(2) : '0.00'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="pagination-container">
                        <Button onClick={handleFirstPage} disabled={currentPage === 1}>First Page</Button>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}> <ChevronLeft /></Button>
                        <div className="pagination-text">Page {currentPage} of {totalPages}</div>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages}> <ChevronRight /></Button>
                        <Button onClick={handleLastPage} disabled={currentPage === totalPages}>Last Page</Button>
                    </div>
                    </div>
                </Container>
            </Container>

        </div>
    );
}

export default BookList;
