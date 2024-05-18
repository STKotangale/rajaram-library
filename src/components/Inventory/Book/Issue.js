import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const BookIssue = () => {
    const [issue, setIssue] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '' })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [bookDetails, setBookDetails] = useState([]);

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
            setIssue(data)
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

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
        invoiceNo: '',
        invoiceDate: '',
        generalMemberId: '',
        books: [{ bookId: '', bookName: '', purchaseCopyNo: '' }]
    });

    const handleEditClick = (issueData) => {
        if (!issueData) {
            console.error("No issue data provided");
            return;
        }

        const books = issueData.bookDetails || [];

        setEditData({
            invoiceNo: issueData.invoiceNo,
            invoiceDate: issueData.invoiceDate.substring(0, 10),
            generalMemberId: issueData.memberIdF.toString(),
            memberName: issueData.memberName,
            books: books.map(book => ({
                bookId: book.bookId.toString(),
                bookName: book.bookName,
                purchaseCopyNo: book.purchaseCopyNo.toString()
            }))
        });
        setShowEditModal(true);
    };


    const handleUpdate = async (event) => {
        event.preventDefault();
        const payload = {
            invoiceNo: editData.invoiceNo,
            invoiceDate: editData.invoiceDate,
            generalMemberId: Number(editData.generalMemberId),
            bookDetails: editData.books.map(book => ({
                bookId: Number(book.bookId),
                bookdetailId: Number(book.purchaseCopyNo)
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/issues/${editData.invoiceNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Issue updated successfully.');
                fetchIssue();
                setShowEditModal(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error updating issue:', error);
            toast.error('Error updating issue. Please try again.');
        }
    };

    const addBookRowEdit = () => {
        const newBooks = [...editData.books, { bookId: '', bookName: '', purchaseCopyNo: '' }];
        setEditData({ ...editData, books: newBooks });
    };

    const deleteBookRowEdit = (index) => {
        const newBooks = editData.books.filter((_, idx) => idx !== index);
        setEditData({ ...editData, books: newBooks });
    };

    const handleBookDetailChangeEdit = (index, key, value) => {
        const updatedBooks = [...editData.books];
        updatedBooks[index] = { ...updatedBooks[index], [key]: value };
        setEditData({ ...editData, books: updatedBooks });
    };

    const handleDeleteClick = () => {

    }

    const [showViewModal, setShowViewModal] = useState(false);


    const [viewData, setViewData] = useState(null);

    // Function to handle the click event of the eye icon
    const handleViewClick = (issueData) => {
        setViewData(issueData);
        setShowViewModal(true); // Show the view modal
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
                                    {/* <th>Book</th>
                                    <th>Purchase Copy No</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let serialNumber = 1;
                                    return issue.flatMap((issue, issueIndex) => (
                                        issue.bookDetails.map((bookDetail, bookIndex) => (
                                            <tr key={`${issue.invoiceNo}-${bookIndex}`}>
                                                <td>{serialNumber++}</td>
                                                <td>{issue.memberName}</td>
                                                <td>{issue.invoiceNo}</td>
                                                <td>{new Date(issue.invoiceDate).toLocaleDateString()}</td>
                                                {/* <td>{bookDetail.bookName}</td>
                                                <td>{bookDetail.purchaseCopyNo}</td> */}
                                                <td>
                                                    {/* <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(issue)} /> */}
                                                    {/* <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(issue)} /> */}
                                                    {/* <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(viewData)} /> */}
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
                                        as="select"
                                        className="small-input"
                                        value={selectedMemberId}
                                        onChange={(e) => setSelectedMemberId(e.target.value)}
                                    >
                                        <option value="">Select member name</option>
                                        {generalMember.map((member) => (
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
                                            <th className='sr-size'>Sr. No. </th>
                                            <th>Book Name</th>
                                            <th>Purchase Copy No</th>
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

            {/* Edit Issue Modal */}
            <Modal centered show={showEditModal} onHide={() => setShowEditModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate}>
                            <Row className="mb-3">
                                <Form.Group as={Col} md={6}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter invoice number"
                                        value={editData.invoiceNo}
                                        onChange={(e) => setEditData({ ...editData, invoiceNo: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md={6}>
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editData.invoiceDate}
                                        onChange={(e) => setEditData({ ...editData, invoiceDate: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md={12}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={editData.generalMemberId}
                                        onChange={(e) => setEditData({ ...editData, generalMemberId: e.target.value })}
                                    >
                                        <option value="">Select member</option>
                                        {generalMember.map((member) => (
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
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editData.books.map((book, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>
                                                    <Form.Group as={Col}>
                                                        <Form.Control
                                                            as="select"
                                                            value={book.bookId}
                                                            onChange={(e) => handleBookDetailChangeEdit(index, 'bookId', e.target.value)}
                                                        >
                                                            <option value="">Select a book</option>
                                                            {bookDetails.map((detail) => (
                                                                <option key={detail.bookId} value={detail.bookId}>
                                                                    {detail.bookName}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={book.copyDetails?.purchaseCopyNo}
                                                        onChange={(e) => handleBookDetailChangeEdit(index, 'purchaseCopyNo', e.target.value)}
                                                    >
                                                        <option value="">Select purchase copy no </option>
                                                        {bookDetails.find(b => b.bookId === Number(book.bookId))?.copyDetails.map((detail) => (
                                                            <option key={detail.bookDetailId} value={detail.bookDetailId}>
                                                                {detail.purchaseCopyNo}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteBookRowEdit(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Button onClick={addBookRowEdit} className="button-color">
                                Add Book
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Update
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* // View Issue Modal */}
            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} size='xl'>
    <div className="bg-light">
        <Modal.Header closeButton>
            <Modal.Title>View Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {viewData && issue[viewData] && ( // Add conditional check
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Invoice No</Form.Label>
                            <Form.Control type="text" value={issue[viewData].invoiceNo} readOnly />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Issue Date</Form.Label>
                            <Form.Control type="date" value={issue[viewData].invoiceDate} readOnly />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md={12}>
                            <Form.Label>Member Name</Form.Label>
                            <Form.Control as="select" value={issue[viewData].generalMemberId} disabled>
                                <option value="">Select member</option>
                                {generalMember.map((member) => (
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
                                </tr>
                            </thead>
                            <tbody>
                                {issue[viewData].bookDetails.map((book, index) => (
                                    <tr key={index}>
                                        <td className='sr-size'>{index + 1}</td>
                                        <td>{book.bookName}</td>
                                        <td>{book.purchaseCopyNo}</td>
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



        </div>
    );
};

export default BookIssue;
