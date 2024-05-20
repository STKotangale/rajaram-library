/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const IssueReturn = () => {
    const [issueReturn, setIssueReturn] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [selectedMemberUsername, setSelectedMemberUsername] = useState("");
    const [userData, setUserData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookDetailId: '', bookName: '', purchaseCopyNo: '' })));
    const [issueReturnNumber, setIssueReturnNumber] = useState('');
    const [issueReturnDate, setIssueReturnDate] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedIssueReturn, setSelectedIssueReturn] = useState(null);
    const [issueReturnToDelete, setIssueReturnToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchIssueReturn();
        fetchGeneralMembers();
    }, [username, accessToken]);


    const fetchIssueReturn = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/issueReturns`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching issue return: ${response.statusText}`);
            }
            const data = await response.json();
            setIssueReturn(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching issue return. Please try again later.');
        }
    };

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

    const handleMemberNameSelect = async (e) => {
        const memberId = e.target.value;
        setSelectedMemberId(memberId);
    
        const selectedMember = generalMember.find(member => member.memberId === Number(memberId));
        if (selectedMember) {
            setSelectedMemberUsername(selectedMember.username);
    
            try {
                const response = await fetch(`${BaseURL}/api/issue/detail/${selectedMember.username}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error fetching issue details: ${response.statusText}`);
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching issue details:', error.message);
            }
        } else {
        }
    };
    

    const handleBookChangeForRow = (index, event) => {
        const { value } = event.target;
        const updatedRows = [...rows];

        if (!value) {
            updatedRows[index] = { bookId: '', bookDetailId: '', bookName: '', purchaseCopyNo: '' };
            setRows(updatedRows);
            return;
        }

        const [bookId, bookDetailId] = value.split('|').map(Number);

        const selectedBook = userData.find(book => book.bookId === bookId && book.bookDetailId === bookDetailId);

        if (selectedBook) {
            updatedRows[index] = {
                bookId: selectedBook.bookId,
                bookDetailId: selectedBook.bookDetailId,
                bookName: selectedBook.bookName,
                purchaseCopyNo: selectedBook.purchaseCopyNo
            };
            setRows(updatedRows);
        } else {
            toast.error('Selected book not found. Please try again.');
        }
    };

    const addRowAdd = () => {
        const newRow = { bookId: '', bookDetailId: '', bookName: '', purchaseCopyNo: '' };
        setRows([...rows, newRow]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const formatDateForAPI = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

      //reset fields
      const resetFormFields = () => {
        setIssueReturnNumber('');
        setIssueReturnDate('');
        setSelectedMemberId('');
        setRows(Array.from({ length: 5 }, () => ({ bookId: '', bookDetailId: '', bookName: '', purchaseCopyNo: '' })));
    };


    //post api
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const bookDetailsPayload = rows
            .filter(row => row.bookId && row.bookDetailId)
            .map(row => ({
                bookId: Number(row.bookId),
                bookDetailIds: Number(row.bookDetailId)
            }));
    
        const payload = {
            issueNo: issueReturnNumber,  
            issueReturnDate: formatDateForAPI(issueReturnDate), 
            memberId: Number(selectedMemberId), 
            bookDetailsList: bookDetailsPayload 
        };
    
        try {
            const response = await fetch(`${BaseURL}/api/issue/return/create`, {
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
                fetchIssueReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Error submitting invoice. Please try again.');
        }
    };
    
    const handleDeleteClick = (issueReturn) => {
        setIssueReturnToDelete(issueReturn);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!issueReturnToDelete) return;

        try {
            const response = await fetch(`${BaseURL}/api/issue/${issueReturnToDelete.stock_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                toast.success('Issue Return deleted successfully.');
                setShowDeleteModal(false);
                fetchIssueReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            toast.error('Error deleting issue. Please try again.');
        }
    };

    const handleViewClick = (issueReturn) => {
        setSelectedIssueReturn(issueReturn);
        setShowViewModal(true);
    };


    

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Issue Return
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Issue Return No</th>
                                    <th>Issue Return Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issueReturn.map((issueReturnItem, index) => (
                                    <tr key={issueReturnItem.stock_id}>
                                        <td>{index + 1}</td>
                                        <td>{issueReturnItem.username}</td>
                                        <td>{issueReturnItem.invoiceNo}</td>
                                        <td>{issueReturnItem.invoiceDate}</td>
                                        <td>
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(issueReturnItem)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issueReturnItem)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            {/* add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue Return number"
                                        type="text"
                                        className="small-input"
                                        value={issueReturnNumber}
                                        onChange={(e) => setIssueReturnNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={issueReturnDate}
                                        onChange={(e) => setIssueReturnDate(e.target.value)}
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
                                        onChange={handleMemberNameSelect}
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
                                                            value={`${row.bookId}|${row.bookDetailId}`}
                                                            onChange={(e) => handleBookChangeForRow(index, e)}
                                                        >
                                                            <option value="">Select a book</option>
                                                            {userData && userData.map((book) => (
                                                                <option key={`${book.bookId}|${book.bookDetailId}`} value={`${book.bookId}|${book.bookDetailId}`}>
                                                                    {book.bookName}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            as="select"
                                                            value={`${row.bookId}|${row.bookDetailId}`}
                                                            onChange={(e) => handleBookChangeForRow(index, e)}
                                                            disabled
                                                        >
                                                            <option value="">0</option>
                                                            {userData && userData.map((book) => (
                                                                <option key={`${book.bookId}|${book.bookDetailId}`} value={`${book.bookId}|${book.bookDetailId}`}>
                                                                    {book.purchaseCopyNo}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowAdd(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Button onClick={addRowAdd} className="button-color">
                                Add Book
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Add
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* view modal */}
            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Issue Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedIssueReturn && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedIssueReturn.invoiceNo}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue Return Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedIssueReturn.invoiceDate}
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
                                            value={selectedIssueReturn.username}
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
                                                <th>Purchase Copy No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='sr-size'>1</td>
                                                <td>
                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            type="text"
                                                            value={selectedIssueReturn.bookName}
                                                            disabled
                                                        />
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={selectedIssueReturn.purchaseCopyNo}
                                                        disabled
                                                    />
                                                </td>
                                            </tr>
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
                        <p>Are you sure you want to delete this issue return?</p>
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

export default IssueReturn;
