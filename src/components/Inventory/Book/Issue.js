/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const BookIssue = () => {
    const [issue, setIssue] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [bookDetails, setBookDetails] = useState([]);
    const [memberBookings, setMemberBookings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', accessionNo: '' })));
    const [issueNumber, setIssueNumber] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueToDelete, setIssueToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isMembershipValid, setIsMembershipValid] = useState(false);
    const [membershipChecked, setMembershipChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    //view
    const [viewDetails, setViewDetails] = useState(null);
    //auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchIssue();
        fetchGeneralMembers();
        fetchBookDetails();
    }, [username, accessToken]);

    //get all isuue
    const fetchIssue = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching issue: ${response.statusText}`);
            }
            const data = await response.json();
            setIssue(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching issue. Please try again later.');
        }
    };

    //get username
    const fetchGeneralMembers = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/general-members`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGeneralMember(data.data);
        } catch (error) {
            console.error("Failed to fetch general members:", error);
            toast.error('Failed to load general members. Please try again later.');
        }
    };

    //get book details is updated with accession number
    const fetchBookDetails = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/bookdetails/copyno`);
            if (!response.ok) {
                throw new Error(`Error fetching book details: ${response.statusText}`);
            }
            const data = await response.json();
            setBookDetails(data);
        } catch (error) {
            console.error('Error fetching book details:', error.message);
            toast.error('Error fetching book details. Please try again later.');
        }
    };

    //online booking with accession number or without accession number 
    const fetchBookingDetails = async (memberId) => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/bookings/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching bookings: ${response.statusText}`);
            }
            const data = await response.json();
            setMemberBookings(data);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            toast.error('Failed to load booking details. Please try again later.');
        }
    };

    const [allBookDetails, setAllBookDetails] = useState([]);

    useEffect(() => {
        const combinedBooks = [...new Map(bookDetails.map(book => [book.bookId, book]).concat(
            memberBookings.map(booking => [booking.book_idF, {
                bookId: booking.book_idF,
                bookName: booking.bookName
            }])
        )).values()];
        setAllBookDetails(combinedBooks);
    }, [bookDetails, memberBookings]);

    const handleBookChangeForRow = (index, event) => {
        const updatedRows = [...rows];
        const selectedBookId = event.target.value;
        const selectedBook = allBookDetails.find(book => book.bookId === Number(selectedBookId));

        updatedRows[index] = {
            ...updatedRows[index],
            bookId: selectedBookId,
            bookName: selectedBook ? selectedBook.bookName : '',
            accessionNo: ''
        };
        setRows(updatedRows);
    };

    const handleBookDetailsChangeForRow = (index, event) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], accessionNo: event.target.value };
        setRows(updatedRows);
    };

    const addRowAdd = () => {
        setRows([...rows, { bookId: '', bookName: '', accessionNo: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const formatDateForPayload = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const checkMembershipFees = async (memberId, date) => {
        try {
            const formattedDate = formatDateForPayload(date);

            const response = await fetch(`${BaseURL}/api/membership-fees/check-member-fees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ memberId, date: formattedDate })
            });

            if (!response.ok) {
                throw new Error(`Error ... ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const handleDateChange = async (e) => {
        const newDate = e.target.value;
        setIssueDate(newDate);
        if (selectedMemberId && newDate) {
            const membershipCheck = await checkMembershipFees(selectedMemberId, newDate);
            if (membershipCheck && membershipCheck.success) {
                setIsMembershipValid(true);
                setMembershipChecked(true);
            } else {
                setIsMembershipValid(false);
                setMembershipChecked(false);
                setErrorMessage("Error: Member not registered or membership fees unpaid. Please register or pay dues to borrow books.");
            }
        }
    };

    const handleMemberChange = async (e) => {
        const newMemberId = e.target.value;
        setSelectedMemberId(newMemberId);
        if (newMemberId) {
            fetchBookingDetails(newMemberId);
        }
        if (issueDate && newMemberId) {
            const membershipCheck = await checkMembershipFees(newMemberId, issueDate);
            if (membershipCheck && membershipCheck.success) {
                setIsMembershipValid(true);
                setMembershipChecked(true);
            } else {
                setIsMembershipValid(false);
                setMembershipChecked(false);
                setErrorMessage("Error: Member not registered or membership fees unpaid. Please register or pay dues to borrow books.");
            }
        }
    };

    const resetFormFields = () => {
        setIssueNumber('');
        setIssueDate('');
        setSelectedMemberId('');
        setRows(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', accessionNo: '' })));
        setIsMembershipValid(false);
        setMembershipChecked(false);
        setErrorMessage('');
        setMemberBookings([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const invalidEntries = rows.filter(row => row.bookId && !row.accessionNo);

        if (invalidEntries.length > 0) {
            invalidEntries.forEach(row => {
                const bookName = allBookDetails.find(book => book.bookId === Number(row.bookId))?.bookName;
                toast.error(`Please select an accession number for the book "${bookName}".`);
            });
            return;
        }

        if (!isMembershipValid) {
            return;
        }

        const bookDetailsPayload = rows
            .filter(row => row.bookId && row.accessionNo)
            .map(row => ({
                bookId: Number(row.bookId),
                bookdetailId: Number(row.accessionNo)
            }));

        const formattedDate = formatDateForPayload(issueDate);

        const payload = {
            invoiceNo: issueNumber,
            invoiceDate: formattedDate,
            generalMemberId: selectedMemberId,
            bookDetails: bookDetailsPayload,
        };
        try {
            const response = await fetch(`${BaseURL}/api/issue/book-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const purchaseDetails = await response.json();
                toast.success(purchaseDetails.message);

                // Prepare the PUT request payload
                const membOnlineIds = rows
                    .filter(row => row.bookId && row.accessionNo)
                    .map(row => {
                        const matchedBooking = memberBookings.find(booking => booking.book_idF === Number(row.bookId));
                        return matchedBooking ? matchedBooking.membOnlineId : null;
                    })
                    .filter(id => id !== null);

                await updateBlockStatus(membOnlineIds);

                setShowAddModal(false);
                resetFormFields();
                fetchIssue();
                fetchBookDetails();//copyno
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            toast.error('Error submitting issue. Please try again.');
        }
    };

    // update api block status change
    const updateBlockStatus = async (membOnlineIds) => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/update-block-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ membOnlineIds })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(`Error updating block status: ${errorData.message}`);
            } else {
                // toast.success('Block status updated successfully.');
            }
        } catch (error) {
            console.error('Error updating block status:', error);
            // toast.error('Error updating block status. Please try again.');
        }
    };

    //delete function
    const handleDeleteClick = (issue) => {
        setIssueToDelete(issue);
        setShowDeleteModal(true);
    };

    //delete api
    const handleDeleteConfirm = async () => {
        if (!issueToDelete) return;
        try {
            // First, fetch the book details for the issue to be deleted
            const response = await fetch(`${BaseURL}/api/issue/book-issue/${issueToDelete.stock_id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch issue details');
            }
            const issueDetails = await response.json();
            const bookDetailIds = issueDetails[0].books.map(book => book.bookDetailId);

            // Next, call the API to update the status of the book details
            const updateResponse = await fetch(`${BaseURL}/api/bookdetails/update-status-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(bookDetailIds)
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                toast.error(`Error updating book details status: ${errorData.message}`);
                return;
            }

            // Finally, delete the issue
            const deleteResponse = await fetch(`${BaseURL}/api/issue/${issueToDelete.stock_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (deleteResponse.ok) {
                toast.success('Issue deleted successfully.');
                setShowDeleteModal(false);
                fetchIssue();
                fetchBookDetails();//copyno
            } else {
                const errorData = await deleteResponse.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            toast.error('Error deleting issue. Please try again.');
        }
    };


    // View purchase
    const fetchViewDetails = async (stockId) => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/book-issue/${stockId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch issue details');
            }
            const data = await response.json();
            setViewDetails(data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewClick = (issue) => {
        setSelectedIssue(issue);
        fetchViewDetails(issue.stock_id);
        setShowViewModal(true);
    };

    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(issue.length / perPage);

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
    const currentData = issue.slice(indexOfNumber, indexOfLastBookType);

    // Filter accession numbers based on the selected book name
    const getFilteredAccessionNumbers = (bookId) => {
        const book = bookDetails.find(book => book.bookId === Number(bookId));
        return book ? book.copyDetails : [];
    };


    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Issue
                        </Button>
                    </div>
                    <div className="table-responsive table-height mt-4">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Issue No</th>
                                    <th>Issue Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((issueItem, index) => (
                                    <tr key={issueItem.stock_id}>
                                        <td>{index + 1}</td>
                                        <td>{issueItem.username}</td>
                                        <td>{issueItem.invoiceNo}</td>
                                        <td>{issueItem.invoiceDate}</td>
                                        <td>
                                            <Eye className="action-icon view-icon" onClick={() => handleViewClick(issueItem)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issueItem)} />
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

            {/* add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Book Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue number"
                                        type="text"
                                        className="small-input"
                                        value={issueNumber}
                                        onChange={(e) => setIssueNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={issueDate}
                                        onChange={handleDateChange}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        className="small-input"
                                        value={selectedMemberId}
                                        onChange={handleMemberChange}
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.memberId}>
                                                {member.username}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <div className='error-message'>
                                {!membershipChecked && errorMessage && (
                                    <div className="error-message text-danger mt-3">{errorMessage}</div>
                                )}
                            </div>
                            {membershipChecked && (
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className='sr-size'>Sr. No.</th>
                                                <th>Book Name</th>
                                                <th>Accession No</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        <Form.Group as={Col}>
                                                            <Form.Select
                                                                as="select"
                                                                value={row.bookId}
                                                                onChange={(e) => handleBookChangeForRow(index, e)}
                                                            >
                                                                <option value="">Select a book</option>
                                                                {allBookDetails.map((book) => (
                                                                    <option key={book.bookId} value={book.bookId}>
                                                                        {book.bookName}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Form.Select
                                                            as="select"
                                                            value={row.accessionNo}
                                                            onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                        >
                                                            <option value="">Select Book Details</option>
                                                            {getFilteredAccessionNumbers(row.bookId).map((detail) => (
                                                                <option key={detail.bookDetailId} value={detail.bookDetailId}>
                                                                    {detail.accessionNo}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </td>
                                                    <td>
                                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowAdd(index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    <Button onClick={addRowAdd} className="button-color">
                                        Add Book
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* view modal */}
            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {viewDetails && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue No</Form.Label>
                                        <Form.Control
                                            placeholder="Issue number"
                                            type="text"
                                            className="small-input"
                                            value={viewDetails.invoiceNo}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            value={viewDetails.invoiceDate}
                                            className="custom-date-picker small-input"
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={viewDetails.user}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className='sr-size'>Sr. No.</th>
                                                <th>Book Name</th>
                                                <th>Accession No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewDetails.books.map((detail, index) => (
                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        <Form.Group as={Col}>
                                                            <Form.Control
                                                                type="text"
                                                                value={detail.bookName}
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={detail.accessionNo}
                                                            disabled
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal centered show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this issue?</p>
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
        </div>
    );
};

export default BookIssue;
