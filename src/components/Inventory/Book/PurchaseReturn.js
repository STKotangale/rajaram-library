/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const PurchaseReturn = () => {
    //get Purchase return
    const [purchaseReturn, setPurchaseReturn] = useState([]);
    //get general member
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    //get book details all
    const [bookDetails, setBookDetails] = useState([]);
    //add
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '' })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    //delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [purchaseReturnToDelete, setPurchaseReturnToDelete] = useState(null);
    //view
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPurchaseReturn, setSelectedPurchaseReturn] = useState(null);

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchPurchaseReturn();
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

    const fetchPurchaseReturn = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching purchase return: ${response.statusText}`);
            }
            const data = await response.json();
            setPurchaseReturn(data)
        } catch (error) {
            console.error(error);
            toast.error('Error fetching purchase return. Please try again later.');
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bookDetailsPayload = rows
            .filter(row => row.bookId && row.purchaseCopyNo)
            .map(row => ({
                bookId: Number(row.bookId),
                bookdetailId: Number(row.purchaseCopyNo)
            }));

        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            generalMemberId: Number(selectedMemberId),
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
                fetchPurchaseReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Error submitting invoice. Please try again.');
        }
    };

    const handleViewClick = (purchaseReturn) => {
        setSelectedPurchaseReturn(purchaseReturn);
        setShowViewModal(true);
    };

    const handleDeleteClick = (purchaseReturn) => {
        setPurchaseReturnToDelete(purchaseReturn);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!purchaseReturnToDelete) return;

        try {
            const response = await fetch(`${BaseURL}/api/issue/${purchaseReturnToDelete.stock_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                toast.success('Purchase return deleted successfully.');
                setShowDeleteModal(false);
                fetchPurchaseReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting purchase return:', error);
            toast.error('Error deleting purchase return. Please try again.');
        }
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Purchase Return
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Purchase Return No</th>
                                    <th>Purchase Return Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let serialNumber = 1;
                                    return purchaseReturn.flatMap((purchaseReturn, purchaseReturnIndex) => (
                                        purchaseReturn.bookDetails.map((bookDetail, bookIndex) => (
                                            <tr key={`${purchaseReturn.invoiceNo}-${bookIndex}`}>
                                                <td>{serialNumber++}</td>
                                                <td>{purchaseReturn.memberName}</td>
                                                <td>{purchaseReturn.invoiceNo}</td>
                                                <td>{new Date(purchaseReturn.invoiceDate).toLocaleDateString()}</td>
                                                <td>
                                                    <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(purchaseReturn)} />
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(purchaseReturn)} />
                                                </td>
                                            </tr>
                                        ))
                                    ));
                                })()}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Purchase Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Purchase Return No.</Form.Label>
                                    <Form.Control
                                        placeholder="Purchase return number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Purchase Return Date</Form.Label>
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
                                        as="select"
                                        className="small-input"
                                        value={selectedMemberId}
                                        onChange={(e) => setSelectedMemberId(e.target.value)}
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.generalMemberId} value={member.generalMemberId}>
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
                        <Modal.Title>View Purchase Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedPurchaseReturn && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            placeholder="Purchase return number"
                                            type="text"
                                            className="small-input"
                                            value={selectedPurchaseReturn.invoiceNo}
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Purchase Return Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={new Date(selectedPurchaseReturn.invoiceDate).toISOString().substr(0, 10)}
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
                                            value={selectedPurchaseReturn.memberIdF}
                                            disabled
                                        >
                                            <option value={selectedPurchaseReturn.memberIdF}>{selectedPurchaseReturn.memberName}</option>
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
                                            {selectedPurchaseReturn.bookDetails.map((detail, index) => (
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

            {/* delete modal */}
            <Modal centered show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this purchase return?</p>
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

export default PurchaseReturn;
