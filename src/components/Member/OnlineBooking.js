/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';

// Utility function to format date to dd-mm-yyyy
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

// Utility function to parse date from dd-mm-yyyy to yyyy-mm-dd
const parseDateFromDDMMYYYY = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
};

const OnlineBooking = () => {
    const [onlineBookingData, setOnlineBookingData] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [bookName, setBookName] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        // fromDate: "",
        // toDate: "",
        selectedMemberId: "",
        bookId: ""
    });

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchOnlineData();
        fetchGeneralMembers();
        fetchBooks();
    }, [username, accessToken]);

    //get all data
    const fetchOnlineData = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings`, {
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

    //get general member
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


     //get book
     const fetchBooks = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book`, {
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
            selectedMemberId: "",
            bookId: "",
            // fromDate: "",
            // toDate: "",
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            invoiceNo: formData.invoiceNo,
            invoiceDate: formatDateToDDMMYYYY(formData.invoiceDate),
            memberIdF: parseInt(formData.selectedMemberId),
            bookIdF:parseInt(formData.bookId),
            // fromDate: formatDateToDDMMYYYY(formData.fromDate),
            // toDate: formatDateToDDMMYYYY(formData.toDate),
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
            toast.success('Online booking  added successfully!');
            setShowAddModal(false);
            resetField();
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to add online booking:', error);
            toast.error('Failed to add online booking. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            invoiceNo: formData.invoiceNo,
            invoiceDate: formatDateToDDMMYYYY(formData.invoiceDate),
            memberIdF: parseInt(formData.selectedMemberId),
            bookIdF:parseInt(formData.bookId),
            // fromDate: formatDateToDDMMYYYY(formData.fromDate),
            // toDate: formatDateToDDMMYYYY(formData.toDate),
        };
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/${selectedId}`, {
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
            resetField();
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to update online booking:', error);
            toast.error('Failed to update online booking. Please try again later.');
        }
    };

    const handleEditClick = (issueItem) => {
        setShowEditModal(true);
        setFormData({
            invoiceNo: issueItem.invoiceNo,
            invoiceDate: parseDateFromDDMMYYYY(issueItem.invoiceDate),
            selectedMemberId: issueItem.memberIdF.toString(),
            bookIdF:parseInt(formData.bookId),
            // fromDate: parseDateFromDDMMYYYY(issueItem.fromDate),
            // toDate: parseDateFromDDMMYYYY(issueItem.toDate),
        });
      };


    const handleDeleteClick = (memberId) => {
        setSelectedId(memberId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/member-bookings/${selectedId}`, {
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
            fetchOnlineData();
        } catch (error) {
            console.error('Failed to delete online booking:', error);
            toast.error('Failed to delete online booking. Please try again later.');
        }
    };

    const handleViewClick = (issueItem) => {
        setFormData({
            invoiceNo: issueItem.invoiceNo,
            invoiceDate: parseDateFromDDMMYYYY(issueItem.invoiceDate),
            selectedMemberId: issueItem.memberIdF.toString(),
            bookIdF:parseInt(formData.bookId),
            // fromDate: parseDateFromDDMMYYYY(issueItem.fromDate),
            // toDate: parseDateFromDDMMYYYY(issueItem.toDate),
          
        });
        setShowViewModal(true);
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Online Booking
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Invoice No</th>
                                    <th>Invoice Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineBookingData.map((issueItem, index) => (
                                    <tr key={issueItem.memberId}>
                                        <td>{index + 1}</td>
                                        <td>{issueItem.memberName}</td>
                                        <td>{issueItem.invoiceNo}</td>
                                        <td>{(issueItem.invoiceDate)}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(issueItem)}>Edit</PencilSquare>
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issueItem.memberId)} />
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(issueItem)}>View</Eye>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={formData.fromDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={formData.toDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        name="selectedMemberId"
                                        className="small-input"
                                        value={formData.selectedMemberId}
                                        onChange={handleInputChange}
                                        required
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
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Control
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
                                    </Form.Control>
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
            <Modal centered show={showEditModal} onHide={() => { setShowEditModal(false); resetField() }} size='lg'>
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
                                        value={(formData.invoiceDate)}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={(formData.fromDate)}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={(formData.toDate)}
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
                                        as="select"
                                        name="selectedMemberId"
                                        className="small-input"
                                        value={formData.selectedMemberId}
                                        onChange={handleInputChange}
                                        required
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

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="bookId"
                                        className="small-input"
                                        value={formData.bookId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a book</option>
                                        {bookName.map(book => (
                                            <option key={book.bookId} value={book.bookName}>
                                                {book.bookName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Online Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this online booking?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* View modal */}
            <Modal centered show={showViewModal} onHide={() => { setShowViewModal(false); resetField() }} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Online Booking</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        type="text"
                                        value={formData.invoiceNo}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={(formData.invoiceDate)}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={(formData.fromDate)}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={(formData.toDate)}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectedMemberId"
                                        className="small-input"
                                        value={formData.selectedMemberId}
                                        readOnly
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

                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
};

export default OnlineBooking;
