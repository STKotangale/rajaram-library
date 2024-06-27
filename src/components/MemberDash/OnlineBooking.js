/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';
import { ChevronLeft, ChevronRight, Eye, PencilSquare, Trash } from 'react-bootstrap-icons';

// Utility function to format date to dd-mm-yyyy
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const OnlineBooking = () => {
    const [onlineBookingData, setOnlineBookingData] = useState([]);
    const [bookName, setBookName] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        bookId: ""
    });

    const { username, accessToken, memberId } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchOnlineData();
        fetchBooks();
    }, [memberId, username, accessToken]);

    //get all data
    const fetchOnlineData = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/All/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching online booking: ${response.statusText}`);
            }
            const data = await response.json();
            setOnlineBookingData(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching online booking. Please try again later.');
        }
    };

    //get book
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book/all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching books: ${response.statusText}`);
            }
            const data = await response.json();
            setBookName(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching books. Please try again later.');
        }
    };

    const resetField = () => {
        setFormData({
            invoiceNo: "",
            invoiceDate: "",
            bookId: "",
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            invoiceNo: formData.invoiceNo,
            invoiceDate: formatDateToDDMMYYYY(formData.invoiceDate),
            memberIdF: memberId,
            bookIdF: parseInt(formData.bookId),
        };
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Online booking added successfully!');
            setShowAddModal(false);
            resetField();
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to add online booking:', error);
            toast.error('Failed to add online booking. Please try again later.');
        }
    };


    const handleEditClick = (booking) => {
        setSelectedBooking(booking);
        // Convert from dd-mm-yyyy to yyyy-mm-dd
        const [day, month, year] = booking.invoiceDate.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        setFormData({
            invoiceNo: booking.invoiceNo,
            invoiceDate: formattedDate,
            bookId: booking.book_idF
        });
        setShowEditModal(true);
    };


    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            invoiceNo: formData.invoiceNo,
            invoiceDate: formatDateToDDMMYYYY(formData.invoiceDate),
            memberIdF: memberId,
            bookIdF: parseInt(formData.bookId),
        };
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/${selectedBooking.membOnlineId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Online booking updated successfully!');
            setShowEditModal(false);
            setSelectedBooking(null);
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to update online booking:', error);
            toast.error('Failed to update online booking. Please try again later.');
        }
    };

    const handleDeleteClick = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/${selectedBooking.membOnlineId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Online booking deleted successfully!');
            setShowDeleteModal(false);
            setSelectedBooking(null);
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to delete online booking:', error);
            toast.error('Failed to delete online booking. Please try again later.');
        }
    };

    const handleViewClick = (booking) => {
        setSelectedBooking(booking);
        setShowViewModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(onlineBookingData.length / perPage);

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
    const currentData = onlineBookingData.slice(indexOfNumber, indexOfLastBookType);

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Online Booking
                        </Button>
                    </div>
                    <div className="table-responsive table-height">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Invoice No</th>
                                    <th>Book Name</th>
                                    <th>Invoice Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((issueItem, index) => (
                                    <tr key={issueItem.memberId}>
                                        <td>{index + 1}</td>
                                        <td>{issueItem.invoiceNo}</td>
                                        <td>{issueItem.bookName}</td>
                                        <td>{issueItem.invoiceDate}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(issueItem)}>Edit</PencilSquare>
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issueItem)}>Delete</Trash>
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(issueItem)}>View</Eye>
                                        </td>
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

            {/* Add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Online Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        placeholder="Invoice number"
                                        type="text"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        name="bookId"
                                        className="small-input"
                                        value={formData.bookId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a book</option>
                                        {bookName.map(book => (
                                            <option key={book.bookId} value={book.bookId}>
                                                {book.bookName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            {/* Edit modal */}
            <Modal centered show={showEditModal} onHide={() => setShowEditModal(false)} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Online Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        placeholder="Invoice number"
                                        type="text"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        name="bookId"
                                        className="small-input"
                                        value={formData.bookId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a book</option>
                                        {bookName.map(book => (
                                            <option key={book.bookId} value={book.bookId}>
                                                {book.bookName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            {/* Delete modal */}
            <Modal centered show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size='sm'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Online Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this booking?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            No
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* View modal */}
            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Online Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedBooking && (
                            <div>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            name="invoiceNo"
                                            value={selectedBooking.invoiceNo}
                                            className="small-input"
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            name="invoiceDate"
                                            value={selectedBooking.invoiceDate}
                                            className="custom-date-picker small-input"
                                            readOnly
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            value={username}
                                            className="small-input"
                                            readOnly
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Book Name</Form.Label>
                                        <Form.Control
                                            name="bookId"
                                            value={bookName.find(book => book.bookId === selectedBooking.book_idF)?.bookName || 'Not found'}
                                            className="small-input"
                                            readOnly
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Row>

                                {/* <p><strong>Invoice No:</strong> {selectedBooking.invoiceNo}</p>
                                <p><strong>Invoice Date:</strong> {selectedBooking.invoiceDate}</p>
                                <p><strong>Member Name:</strong> {username}</p>
                                <p><strong>Book Name:</strong> {bookName.find(book => book.bookId === selectedBooking.book_idF)?.bookName || 'Not found'}</p> */}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

        </div>
    );
};

export default OnlineBooking;
