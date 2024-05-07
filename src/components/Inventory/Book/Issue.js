/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const BookIssue = () => {
    const [searchQuery] = useState('');
    const [issue, setIssue] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    // const [rows, setRows] = useState([{ bookName: '', bookDetails: '' }]);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '', bookDetails: '' })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [ledgerName, setLedgerName] = useState([]);
    const [selectedLedgerName, setSelectedLedgerName] = useState('');
    const [selectedLedgerID, setSelectedLedgerID] = useState('');
    const [bookName, setBookName] = useState([]);
    const [bookDetails, setBookDetails] = useState([]);
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchIssue();
        fetchBooks();
        fetchLedgerNames();
        fetchBookDetails();
    }, [username, accessToken]);

    const fetchIssue = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase`, {
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

    const fetchLedgerNames = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/ledger`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch ledger names - ${response.status}`);
            }
            const data = await response.json();
            setLedgerName(data.data);
        } catch (error) {
            console.error('Error fetching ledger names:', error.message);
            toast.error('Error fetching ledger names. Please try again later.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            ledgerId: selectedLedgerID,
            purchaseDetails: rows.map(row => ({
                bookId: bookName.find(book => book.bookName === row.bookName)?.bookId,
                bookDetails: row.bookDetails
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/purchase`, {
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


    //edit function
    // const handleEditClick = (issue) => {
    //     setEditData(issue);
    //     setShowEditModal(true);
    // };


    const handleEditClick = (issue) => {
        const bookName = issue.purchaseDetails.map(detail => detail.bookName);
        setEditData({
            ...issue,
            bookName: bookName,
        });
        setShowEditModal(true);
    };



    const handleSubmitEdit = async (event) => {
        event.preventDefault();
        if (!editData) {
            toast.error('No data to submit.');
            return;
        }
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${editData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(editData)
            });
            if (response.ok) {
                const updatedIssue = await response.json();
                toast.success(updatedIssue.message);
                setShowEditModal(false);
                fetchIssue();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error updating issue:', error);
            toast.error('Error updating issue. Please try again.');
        }
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditData(null);
    };

    const handleBookChangeForRow = (index, event) => {
        const value = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], bookName: value };
        setRows(updatedRows);
    };

    // const handleBookChangeForRow = (index, event) => {
    //     const { name, value } = event.target;
    //     const updatedRows = [...rows];
    //     updatedRows[index] = { ...updatedRows[index], [name]: value };
    //     setRows(updatedRows);
    // };

    const handleBookChangeEdit = (index, event) => {
        const { name, value } = event.target;
        const updatedRows = [...editData.purchaseDetails];
        updatedRows[index][name] = value;
        setEditData(prevState => ({
            ...prevState,
            purchaseDetails: updatedRows
        }));
    };

    const handleBookDetailsChangeForRow = (index, event) => {
        const value = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], bookDetails: value };
        setRows(updatedRows);
    };

    const addRowAdd = () => {
        setRows([...rows, { bookName: '', bookDetails: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((row, i) => i !== index);
        setRows(updatedRows);
    };

    const addRowEdit = () => {
        setEditData(prevState => ({
            ...prevState,
            purchaseDetails: [...prevState.purchaseDetails, { bookName: '', bookDetails: '' }]
        }));
    };

    const deleteRowEdit = (index) => {
        const updatedRows = [...editData.purchaseDetails];
        updatedRows.splice(index, 1);
        setEditData(prevState => ({
            ...prevState,
            purchaseDetails: updatedRows
        }));
    };


    const filteredLedgerName = ledgerName.filter(ledger =>
        ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Function to format the date as "yyyy-mm-dd" for input type 'date'
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    //get book details
    const fetchBookDetails = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/bookdetails');
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




    //view
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState(null);
    // Function to open view modal
    const handleViewClick = (issue) => {
        setViewData(issue);
        setShowViewModal(true);
    };
    // Function to close view modal
    const handleCloseViewModal = () => {
        setShowViewModal(false);
    };



    //delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [issueToDelete, setIssueToDelete] = useState(null);
    const handleConfirmDelete = async () => {
        if (!issueToDelete) return;
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${issueToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                fetchIssue();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            toast.error('Error deleting issue. Please try again.');
        }
        setShowDeleteModal(false);
        setIssueToDelete(null);
    };
    const handleDeleteClick = (issue) => {
        setIssueToDelete(issue);
        setShowDeleteModal(true);
    };
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setIssueToDelete(null);
    };





    return (
        <div className="main-content">
            <Container>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add issue
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
                                {issue.map((issue, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{issue.ledgerName}</td>
                                        <td>{issue.invoiceNo}</td>
                                        <td>{new Date(issue.invoiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(issue)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issue)} />
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(issue)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>



            {/* add  Modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="input"
                                        className="small-input"
                                        list="ledgerNames"
                                        value={selectedLedgerName}
                                        onChange={(e) => setSelectedLedgerName(e.target.value)}
                                        placeholder="Search or select member name"
                                    />
                                    <datalist id="ledgerNames">
                                        {filteredLedgerName.map((ledger) => (
                                            <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Row>
                            {/* Book details table */}
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th>Sr. No. </th>
                                            <th>Book Name</th>
                                            <th>Book Details</th>
                                            <th>Action</th>
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
                                                            value={row.bookName}
                                                            onChange={(e) => handleBookChangeForRow(index, e)}
                                                        >
                                                            <option value="">Select a book</option>
                                                            {bookName.map((book, index) => (
                                                                <option key={index} value={book.bookName}>{book.bookName}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={row.bookDetails}
                                                        onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                    >
                                                        <option value="">Select Book Details</option>
                                                        {bookDetails
                                                            .filter((book) => book.book_name === row.bookName)
                                                            .map((book) => (
                                                                <option key={book.id} value={book.purchase_copy_no}>
                                                                    {book.purchase_copy_no}
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


            {/* Edit Modal */}
            <Modal centered show={showEditModal} onHide={handleCloseEditModal} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmitEdit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue number"
                                        type="text"
                                        className="small-input"
                                        value={editData?.invoiceNo || ''}
                                        onChange={(e) => setEditData({ ...editData, invoiceNo: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formatDateForInput(editData?.invoiceDate) || ''}
                                        onChange={(e) => setEditData({ ...editData, invoiceDate: e.target.value })}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="input"
                                        className="small-input"
                                        list="ledgerNames"
                                        value={editData?.ledgerName || ''}
                                        onChange={(e) => setEditData({ ...editData, ledgerName: e.target.value })}
                                        placeholder="Search or select member name"
                                    />
                                    <datalist id="ledgerNames">
                                        {filteredLedgerName.map((ledger) => (
                                            <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Row>
                            {/* Book details table */}
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th>Book Name</th>
                                            <th>Book Details</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editData?.purchaseDetails.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        name="bookName"
                                                        value={row.bookName}
                                                        onChange={(e) => handleBookChangeEdit(index, e)}
                                                    >
                                                        <option value="">Select a book</option>
                                                        {bookName.map((book, index) => (
                                                            <option key={index} value={book.bookName}>{book.bookName}</option>
                                                        ))}
                                                    </Form.Control>

                                                </td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={row.bookDetails}
                                                        onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                    >
                                                        <option value="">Select Book Details</option>
                                                        {bookDetails
                                                            .filter((book) => book.book_name === row.bookName)
                                                            .map((book) => (
                                                                <option key={book.id} value={book.purchase_copy_no}>
                                                                    {book.purchase_copy_no}
                                                                </option>
                                                            ))}
                                                    </Form.Control>

                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowEdit(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Button onClick={addRowEdit} className="button-color">
                                Add Book
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmitEdit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* view modal */}
            <Modal centered show={showViewModal} onHide={handleCloseViewModal} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue number"
                                        type="text"
                                        value={viewData?.invoiceNo || ''}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={viewData?.invoiceDate || ''}
                                        readOnly 
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewData?.ledgerName || ''}
                                        readOnly 
                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                        <div className="table-responsive">
                            <Table striped bordered hover className="table-bordered-dark">
                                <thead>
                                    <tr>
                                        <th>Book Name</th>
                                        <th>Book Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewData?.purchaseDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.bookName}</td>
                                            <td>{detail.bookDetails}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseViewModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this issue?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default BookIssue;
