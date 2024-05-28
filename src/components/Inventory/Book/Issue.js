/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const BookIssue = () => {
    const [issue, setIssue] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [bookDetails, setBookDetails] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '' })));
    const [issueNumber, setIssueNumber] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issueToDelete, setIssueToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isMembershipValid, setIsMembershipValid] = useState(false);
    const [membershipChecked, setMembershipChecked] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');


    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchIssue();
        fetchGeneralMembers();
        fetchBookDetails();
    }, [username, accessToken]);

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

    const handleBookChangeForRow = (index, event) => {
        const updatedRows = [...rows];
        const selectedBookId = event.target.value;
        const selectedBook = bookDetails.find(book => book.bookId === Number(selectedBookId));

        updatedRows[index] = {
            ...updatedRows[index],
            bookId: selectedBookId,
            bookName: selectedBook ? selectedBook.bookName : '',
            purchaseCopyNo: ''
        };
        setRows(updatedRows);
    };

    const handleBookDetailsChangeForRow = (index, event) => {
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], purchaseCopyNo: event.target.value };
        setRows(updatedRows);
    };

    const addRowAdd = () => {
        setRows([...rows, { bookId: '', bookName: '', purchaseCopyNo: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const checkMembershipFees = async (memberId, date) => {
        try {
            const formatDateForPayload = (date) => {
                if (!date) return '';
                const [year, month, day] = date.split('-');
                return `${day}-${month}-${year}`;
            };

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

    // Reset form fields
    const resetFormFields = () => {
        setIssueNumber('');
        setIssueDate('');
        setSelectedMemberId('');
        setRows(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '' })));
        setIsMembershipValid(false);
        setMembershipChecked(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isMembershipValid) {
            // toast.error("Error: Member not registered or membership fees unpaid. Please register or pay dues to borrow  books.");
            return;
        }

        const bookDetailsPayload = rows
            .filter(row => row.bookId && row.purchaseCopyNo)
            .map(row => ({
                bookId: Number(row.bookId),
                bookdetailId: Number(row.purchaseCopyNo)
            }));

        const payload = {
            invoiceNo: issueNumber,
            invoiceDate: issueDate,
            generalMemberId: selectedMemberId,
            bookDetails: bookDetailsPayload
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
                setShowAddModal(false);
                resetFormFields();
                fetchIssue();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Error submitting invoice. Please try again.');
        }
    };

    const handleDeleteClick = (issue) => {
        setIssueToDelete(issue);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!issueToDelete) return;

        try {
            const response = await fetch(`${BaseURL}/api/issue/${issueToDelete.stock_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                toast.success('Issue deleted successfully.');
                setShowDeleteModal(false);
                fetchIssue();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            toast.error('Error deleting issue. Please try again.');
        }
    };

    const handleViewClick = (issue) => {
        setSelectedIssue(issue);
        setShowViewModal(true);
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
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
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
                                {issue.map((issueItem, index) => (
                                    <tr key={issueItem.stock_id}>
                                        <td>{index + 1}</td>
                                        <td>{issueItem.memberName}</td>
                                        <td>{issueItem.invoiceNo}</td>
                                        <td>{new Date(issueItem.invoiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <Eye className="action-icon view-icon" onClick={() => handleViewClick(issueItem)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issueItem)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

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
                                    <Form.Control
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
                                    </Form.Control>
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
                                                <th>Purchase Copy No</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        <Form.Group as={Col}>
                                                            <Form.Control
                                                                as="select"
                                                                value={row.bookId}
                                                                onChange={(e) => handleBookChangeForRow(index, e)}
                                                            >
                                                                <option value="">Select a book</option>
                                                                {bookDetails.map((book) => (
                                                                    <option key={book.bookId} value={book.bookId}>
                                                                        {book.bookName}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            as="select"
                                                            value={row.purchaseCopyNo}
                                                            onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                        >
                                                            <option value="">Select Book Details</option>
                                                            {bookDetails.find(book => book.bookId === Number(row.bookId))?.copyDetails.map((detail) => (
                                                                <option key={detail.bookDetailId} value={detail.bookDetailId}>
                                                                    {detail.purchaseCopyNo}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
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

            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedIssue && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            placeholder="Issue number"
                                            type="text"
                                            className="small-input"
                                            value={selectedIssue.invoiceNo}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={new Date(selectedIssue.invoiceDate).toISOString().substr(0, 10)}
                                            className="custom-date-picker small-input"
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="small-input"
                                            value={selectedIssue.memberIdF}
                                            disabled
                                        >
                                            <option value={selectedIssue.memberIdF}>{selectedIssue.memberName}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className='sr-size'>Sr. No. </th>
                                                <th>Book Name</th>
                                                <th>Purchase Copy No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedIssue.bookDetails.map((detail, index) => (
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
                                                            value={detail.purchaseCopyNo}
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
