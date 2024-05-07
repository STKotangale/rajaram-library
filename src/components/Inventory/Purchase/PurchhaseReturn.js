/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';

import '../InventoryCSS/PurchaseBookDashboardData.css'

const PurchhaseReturn = () => {
    const [searchQuery] = useState('');
    //get 
    const [purchases, setPurchases] = useState([]);
    //add 
    const [showAddPurchase, setShowAddPurchase] = useState(false);
    //edit  
    const [showModal, setShowModal] = useState(false);
    //delete 
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    //edit and delete
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    //view
    const [viewPurchaseModal, setViewPurchaseModal] = useState(false);
    //auth
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const { username, accessToken } = useAuth();

    //another api
    //get books
    const [bookName, setBookName] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [rowBooks, setRowBooks] = useState("");

    useEffect(() => {
        fetchPurchases();
    }, [username, accessToken]);

    //get purchase
    const fetchPurchases = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching purchases: ${response.statusText}`);
            }
            const data = await response.json();
            setPurchases(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching purchases. Please try again later.');
        }
    };

    //edit purchase function
    const handleEditClick = (purchase) => {
        const updatedPurchase = {
            ...purchase,
            purchaseDetails: purchase.purchaseDetails.filter(detail => !detail.deleted)
        };
        setSelectedPurchase(updatedPurchase);
        setShowModal(true);

    };

    const handleCloseModal = () => {
        setShowModal(false);
        setViewPurchaseModal(false);
        setShowAddPurchase(false);
    }

    //edit api
    const handleEditPurchase = async (e) => {
        const payload = {
            invoiceNo: selectedPurchase.invoiceNo,
            invoiceDate: selectedPurchase.invoiceDate,
            ledgerId: selectedPurchase.ledgerId,
            purchaseDetails: selectedPurchase.purchaseDetails.map(detail => ({
                bookId: detail.bookId,
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedPurchase.purchaseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseJson = await response.json();
            console.log('Success:', responseJson);
            toast.success('Purchase saved successfully.');
            fetchPurchases();
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving purchase. Please try again later.');
        }
    };

    //edit change input  
    const handleInputChange = (e, field, index) => {
        let value = e.target.value;
        if (field === 'invoiceDate') {
            value = formatDateToISO(value);
        }
        if (index !== undefined) {
            const updatedDetails = [...selectedPurchase.purchaseDetails];
            if (field === 'bookName') {
                const selectedBook = bookName.find(book => book.bookName === value);
                updatedDetails[index].bookId = selectedBook ? selectedBook.bookId : null;
                updatedDetails[index][field] = value;
            } else {
                updatedDetails[index][field] = value;
            }
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                purchaseDetails: updatedDetails
            }));
            return;
        }
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            [field]: value
        }));
    };

    //date format
    const formatDateToISO = (dateString) => {
        if (!dateString) return '';
        const localDate = new Date(dateString);
        return localDate.toISOString();
    };

    //delete function
    const handleDeleteClick = (purchase) => {
        setSelectedPurchase(purchase);
        setShowDeleteConfirmation(true);
    };

    //delete api
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedPurchase.purchaseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error deleting purchase: ${response.statusText}`);
            }
            toast.success('Purchase deleted successfully.');
            fetchPurchases();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
            toast.error('Error deleting purchase. Please try again later.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };


    // book edit under edit book name  change input dropdown
    const handleBookChangeForRow = (index, event) => {
        const name = event.target.value;
        const selectedBook = bookName.find(book => book.bookName === name);
        const updatedRowBooks = [...rowBooks];

        if (selectedBook) {
            updatedRowBooks[index] = { ...updatedRowBooks[index], bookId: selectedBook.bookId };
            updatedRowBooks[index].bookName = name;
        } else {
            updatedRowBooks[index] = { ...updatedRowBooks[index], bookId: null };
            updatedRowBooks[index].bookName = name;
        }
        setRowBooks(updatedRowBooks);
    };

    // Filtered book names based on selectedBooks
    const filteredBookNamesForRow = (rowIndex) => {
        return bookName.filter(book =>
            !selectedBooks.includes(book.bookId) ||
            selectedBooks[rowIndex] === book.bookId
        );
    };

    //add row under edit
    const addRow = () => {
        const newRow = {
            bookId: null,
            bookName: '',
        };
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            purchaseDetails: [...prevPurchase.purchaseDetails, newRow]
        }));
    };

    //delete row under edit
    const deleteRow = (index) => {
        const updatedDetails = selectedPurchase.purchaseDetails.filter((_, i) => i !== index);
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            purchaseDetails: updatedDetails,
            purchase: updatedDetails

        }));
    };

    //view purchase
    const handleViewClick = (purchase) => {
        setSelectedPurchase(purchase);
        setViewPurchaseModal(true);
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

    useEffect(() => {
        fetchBooks();
    }, []);



    //add /post popup moadl
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '' })));
    // date function 
    const [invoiceDate, setInvoiceDate] = useState();
    //invoice number
    const [invoiceNumber, setInvoiceNumber] = useState();
    //get ledger name
    const [ledgerName, setLedgerName] = useState([]);
    const [selectedLedgerName, setSelectedLedgerName] = useState("");
    const [selectedLedgerID, setSelectedLedgerID] = useState('');
    // post api
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedLedgerName.trim()) {
            toast.error('Please select purchaser name !');
            return;
        }
        const isBookFilled = rows.some(row => row.bookName.trim() !== '');
        if (!isBookFilled) {
            toast.error('Please enter at least one book.');
            return;
        }
        const filteredRows = rows.filter(row => row.bookName.trim() !== '' && row.quantity.trim() !== '' && row.rate.trim() !== '');
        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            ledgerId: selectedLedgerID,
            purchaseDetails: filteredRows.map(row => ({
                bookId: bookName.find(book => book.bookName === row.bookName)?.bookId,

            }))
        };
        try {
            if (!accessToken) {
                toast.error('Access token not found. Please log in again.');
                return;
            }
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


            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Service Temporarily Unavailable or Error submitting invoice. Please try again.');
            console.error('Error message:', error.message);
        }
    };


    //  invoice date change
    const handleInvoiceDateChange = (e) => {
        setInvoiceDate(e.target.value);
    };
    const handleLedgerChange = (event) => {
        const name = event.target.value;
        setSelectedLedgerName(name);
        const ledger = ledgerName.find(l => l.ledgerName === name);
        if (ledger) {
            setSelectedLedgerID(ledger.ledgerID);
        } else {
            setSelectedLedgerID('');
        }
    };

    const filteredLedgerName = ledgerName.filter(ledger =>
        ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addRowAdd = () => {
        setRows([...rows, { bookName: '', bookDetailsId: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };


    const handleBookDetailsChangeForRow = (index, event) => {
        const value = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], bookDetails: value };
        setRows(updatedRows);
    };

    //get  purchaser/ledger name
    useEffect(() => {
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
        fetchLedgerNames();
    }, [accessToken]);



    const [bookDetails, setBookDetails] = useState([]);
    const [bookData, setBookData] = useState('');

    //get api
    const fetchBookDetails = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/bookdetails`);
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            const data = await response.json();
            setBookDetails(data);
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };
    return (
        <div className="main-content">
            <Container>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddPurchase(true)} className="button-color">
                            Add purchase
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
                                {purchases.map((purchase, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{purchase.ledgerName}</td>
                                        <td>{purchase.invoiceNo}</td>
                                        <td>{new Date(purchase.invoiceDate).toLocaleDateString()}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(purchase)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(purchase)} />
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(purchase)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>



            {/* add Purchase Modal */}
            <Modal centered show={showAddPurchase} onHide={() => { setShowAddPurchase(false); }}>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}  >
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Invoice number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={invoiceDate}
                                        onChange={handleInvoiceDateChange}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} >
                                    <Form.Label>Purchaser Name</Form.Label>
                                    <Form.Control
                                        as="input"
                                        className="small-input" list="ledgerNames"
                                        value={selectedLedgerName}
                                        onChange={handleLedgerChange}
                                        placeholder="Search or select purchaser name"
                                    />
                                    <datalist id="ledgerNames">
                                        {filteredLedgerName.map((ledger) => (
                                            <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Row>

                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className="table-header sr-size">Sr.No</th>
                                            <th className="table-header ">Book Name</th>
                                            <th className="table-header ">Book Details</th>
                                            <th className="table-header ">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>
                                                    <Form.Group as={Col} sm={12}>
                                                        <Form.Control
                                                            as="input"
                                                            list={`bookName-${index}`}
                                                            value={row.bookName}
                                                            onChange={(e) => { handleBookChangeForRow(index, e); }}
                                                            placeholder="Select book name"
                                                        />
                                                        <datalist id={`bookName-${index}`}>
                                                            {filteredBookNamesForRow(index).map((book) => (
                                                                <option key={book.bookId} value={book.bookName} />
                                                            ))}
                                                        </datalist>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Form.Group className="mb-3" controlId="newBookAuthor">
                                                        <Form.Select
                                                            value={row.bookDetails}
                                                            onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                            required
                                                        >
                                                            <option value="">Select Book Details</option>
                                                            {bookDetails.map(book => (
                                                                <option key={book.id} value={book.id}>{book.id}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowAdd(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td>
                                                <Button onClick={addRowAdd} className="button-color">
                                                    Add Book
                                                </Button>
                                            </td>
                                            <td></td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* Edit Purchase Modal */}
            {selectedPurchase && (
                <Modal show={showModal} onHide={handleCloseModal} centered >
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Issue</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"

                                            value={selectedPurchase.invoiceNo}
                                            onChange={(e) => handleInputChange(e, 'invoiceNo')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                            onChange={(e) => handleInputChange(e, 'invoiceDate')}
                                            className="custom-date-picker small-input"
                                        />

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={selectedPurchase.ledgerName || ''}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header sr-size">Sr.No</th>
                                                <th className="table-header ">Book Name</th>
                                                <th className="table-header ">Book Details</th>
                                                <th className="table-header ">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPurchase.purchaseDetails.map((row, index) => (

                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        <Form.Group >
                                                            <Form.Control
                                                                as="input"
                                                                list={`bookName-${index}`}
                                                                value={row.bookName}
                                                                onChange={(e) => { handleBookChangeForRow(index, e); handleInputChange(e, 'bookName', index) }}
                                                                placeholder="Search or select book name"
                                                            />
                                                            <datalist id={`bookName-${index}`}>
                                                                {filteredBookNamesForRow(index).map((book) => (
                                                                    <option key={book.bookId} value={book.bookName} />
                                                                ))}
                                                            </datalist>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Form.Group className="mb-3" controlId="newBookAuthor">
                                                            <Form.Select
                                                                value={row.bookDetails}
                                                                onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                                required
                                                            >
                                                                <option value="">Select Book Details</option>
                                                                {bookDetails.map(book => (
                                                                    <option key={book.id} value={book.id}>{book.id}</option>
                                                                ))}
                                                            </Form.Select>  <Form.Select
                                                                value={bookData}
                                                                onChange={(e) => setBookData(e.target.value)}
                                                                required
                                                            >
                                                                <option value="">Select Book Details</option>
                                                                {bookDetails.map(book => (
                                                                    <option key={book.id} value={book.id}>{book.id}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRow(index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Button onClick={addRow} className="button-color">
                                                        Add Book
                                                    </Button>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleEditPurchase}>
                                Update
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this purchase?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* View Issue Modal */}
            {selectedPurchase && (
                <Modal show={viewPurchaseModal} onHide={handleCloseModal} centered >
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>Issue </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedPurchase.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                            readOnly
                                            className="custom-date-picker"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={selectedPurchase.ledgerName || ''}
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header ">Sr.No</th>
                                                <th className="table-header">Book Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPurchase.purchaseDetails.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={detail.bookName}
                                                            readOnly
                                                        />
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PurchhaseReturn;




import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';

import '../InventoryCSS/PurchaseBookDashboardData.css'

const BookIssue = () => {
    const [searchQuery] = useState('');
    //get 
    const [issue, setIssue] = useState([]);

    //add  function
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '', bookDetails: '' })));
    //invoice number
    const [invoiceNumber, setInvoiceNumber] = useState();
    // date  
    const [invoiceDate, setInvoiceDate] = useState();
    //get ledger name
    const [ledgerName, setLedgerName] = useState([]);
    const [selectedLedgerName, setSelectedLedgerName] = useState("");
    const [selectedLedgerID, setSelectedLedgerID] = useState('');

    //edit  
    const [showEditModal, setShowEditModal] = useState(false);
    //delete 
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    //edit and delete
    const [selectedEntry, setSelectedEntry] = useState(null);
    //view
    const [viewModal, setViewModal] = useState(false);
    //auth
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const { username, accessToken } = useAuth();

    //another api
    //get books
    const [bookName, setBookName] = useState([]);


    const [bookDetails, setBookDetails] = useState([]);
    useEffect(() => {
        fetchIssue();
    }, [username, accessToken]);

    //get Issue
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


    //add / post api
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedLedgerName.trim()) {
            toast.error('Please select member name !');
            return;
        }
        const isBookFilled = rows.some(row => row.bookName.trim() !== '');
        if (!isBookFilled) {
            toast.error('Please enter at least one book.');
            return;
        }
        const filteredRows = rows.filter(row => row.bookName.trim() !== '' && row.quantity.trim() !== '' && row.rate.trim() !== '');
        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            ledgerId: selectedLedgerID,
            purchaseDetails: filteredRows.map(row => ({
                bookId: bookName.find(book => book.bookName === row.bookName)?.bookId,

            }))
        };
        try {
            if (!accessToken) {
                toast.error('Access token not found. Please log in again.');
                return;
            }
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


            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Service Temporarily Unavailable or Error submitting invoice. Please try again.');
            console.error('Error message:', error.message);
        }
    };
    //  invoice date change
    const handleInvoiceDateChange = (e) => {
        setInvoiceDate(e.target.value);
    };
    //member/purchaser/ledger change
    const handleLedgerChange = (event) => {
        const name = event.target.value;
        setSelectedLedgerName(name);
        const ledger = ledgerName.find(l => l.ledgerName === name);
        if (ledger) {
            setSelectedLedgerID(ledger.ledgerID);
        } else {
            setSelectedLedgerID('');
        }
    };
    //filter pmember /purchaser /ledger name
    const filteredLedgerName = ledgerName.filter(ledger =>
        ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    //book name change

    //book details change
    const handleBookDetailsChangeForRow = (index, event) => {
        const value = event.target.value;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], bookDetails: value };
        setRows(updatedRows);
    };


    const addRowAdd = () => {
        setRows([...rows, { bookName: '', purchaseCopyNo: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((row, i) => i !== index);
        setRows(updatedRows);
    };




    //colse modal
    const handleCloseModal = () => {
        setShowEditModal(false);
        setViewModal(false);
        setShowAddModal(false);
    }


    //edit api and function
    const handleEdit = async (e) => {
        const payload = {
            invoiceNo: selectedEntry.invoiceNo,
            invoiceDate: selectedEntry.invoiceDate,
            ledgerId: selectedEntry.ledgerId,
            purchaseDetails: selectedEntry.purchaseDetails.map(detail => ({
                bookId: detail.bookId,
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedEntry.purchaseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseJson = await response.json();
            console.log('Success:', responseJson);
            toast.success('Issue saved successfully.');
            fetchIssue();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving issue. Please try again later.');
        }
    };
    //edit Entry function
    const handleEditClick = (issue) => {
        const updatedIssue = {
            ...issue,
            purchaseDetails: issue.purchaseDetails.filter(detail => !detail.deleted)
        };
        setSelectedEntry(updatedIssue);
        setShowEditModal(true);

    };
    //edit change input  
    const handleInputChange = (e, field, index) => {
        let value = e.target.value;
        if (field === 'invoiceDate') {
            value = formatDateToISO(value);
        }
        if (index !== undefined) {
            const updatedDetails = [...selectedEntry.purchaseDetails];
            if (field === 'bookName') {
                const selectedBook = bookName.find(book => book.bookName === value);
                updatedDetails[index].bookId = selectedBook ? selectedBook.bookId : null;
                updatedDetails[index][field] = value;
            } else {
                updatedDetails[index][field] = value;
            }
            setSelectedEntry(prevIssue => ({
                ...prevIssue,
                purchaseDetails: updatedDetails
            }));
            return;
        }
        setSelectedEntry(prevIssue => ({
            ...prevIssue,
            [field]: value
        }));
    };
    //date format
    const formatDateToISO = (dateString) => {
        if (!dateString) return '';
        const localDate = new Date(dateString);
        return localDate.toISOString();
    };






    //delete api
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedEntry.purchaseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error deleting issue: ${response.statusText}`);
            }
            toast.success('issue deleted successfully.');
            fetchIssue();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
            toast.error('Error deleting issue. Please try again later.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };



    //delete function
    const handleDeleteClick = (issue) => {
        setSelectedEntry(issue);
        setShowDeleteConfirmation(true);
    };

    //add row under edit
    const addRow = () => {
        const newRow = {
            bookId: null,
            bookName: '',
        };
        setSelectedEntry(prevIssue => ({
            ...prevIssue,
            purchaseDetails: [...prevIssue.purchaseDetails, newRow]
        }));
    };

    //delete row under edit
    const deleteRow = (index) => {
        const updatedDetails = selectedEntry.purchaseDetails.filter((_, i) => i !== index);
        setSelectedEntry(prevIssue => ({
            ...prevIssue,
            purchaseDetails: updatedDetails,
            issue: updatedDetails

        }));
    };

    //view issue
    const handleViewClick = (issue) => {
        setSelectedEntry(issue);
        setViewModal(true);
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

    useEffect(() => {
        fetchBooks();
    }, []);




    //get member/ purchaser/ledger name
    useEffect(() => {
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
        fetchLedgerNames();
    }, []);





    useEffect(() => {
        fetchBookDetails();
    }, []);


    //get book details
    const fetchBookDetails = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/bookdetails`);
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }
            const data = await response.json();
            setBookDetails(data);
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    };

    const handleBookChangeForRow = (index, event) => {
        const name = event.target.value;
        const selectedBook = bookName.find(book => book.bookName === name);
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], bookName: name };
        if (selectedBook) {
            const filteredBookDetails = bookDetails.filter(book => book.book_name === selectedBook.bookName);
            updatedRows[index] = { ...updatedRows[index], filteredBookDetails: filteredBookDetails };
        }

        setRows(updatedRows);
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
            <Modal centered show={showAddModal} onHide={() => { setShowAddModal(false); }} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}  >
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Issue Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={invoiceDate}
                                        onChange={handleInvoiceDateChange}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} >
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="input"
                                        className="small-input" list="ledgerNames"
                                        value={selectedLedgerName}
                                        onChange={handleLedgerChange}
                                        placeholder="Search or select member name"
                                    />
                                    <datalist id="ledgerNames">
                                        {filteredLedgerName.map((ledger) => (
                                            <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                        ))}
                                    </datalist>
                                </Form.Group>
                            </Row>

                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className="table-header sr-size">Sr.No</th>
                                            <th className="table-header ">Book Name</th>
                                            <th className="table-header ">Book Details</th>
                                            <th className="table-header ">Action</th>
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
                                                    <Form.Group className="mb-3" controlId="newBookDetails">
                                                        <Form.Select
                                                            value={row.bookDetails}
                                                            onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                            required
                                                        >
                                                            <option value="">Select Book Details</option>
                                                            {row.filteredBookDetails && row.filteredBookDetails.map(book => (
                                                                <option key={book.id} value={book.purchase_copy_no}>{book.purchase_copy_no}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>

                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowAdd(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td>
                                                <Button onClick={addRowAdd} className="button-color">
                                                    Add Book
                                                </Button>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* Edit Modal */}
            {selectedEntry && (
                <Modal show={showEditModal} onHide={handleCloseModal} centered size='xl'>
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Issue</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"

                                            value={selectedEntry.invoiceNo}
                                            onChange={(e) => handleInputChange(e, 'invoiceNo')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedEntry.invoiceDate ? selectedEntry.invoiceDate.substring(0, 10) : ''}
                                            onChange={(e) => handleInputChange(e, 'invoiceDate')}
                                            className="custom-date-picker small-input"
                                        />

                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={selectedEntry.ledgerName || ''}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header sr-size">Sr.No</th>
                                                <th className="table-header ">Book Name</th>
                                                <th className="table-header ">Book Details</th>
                                                <th className="table-header ">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedEntry.purchaseDetails.map((row, index) => (
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
                                                        <Form.Group className="mb-3" controlId="newBookDetails">
                                                            <Form.Select
                                                                value={row.bookDetails}
                                                                onChange={(e) => handleBookDetailsChangeForRow(index, e)}
                                                                required
                                                            >
                                                                <option value="">Select Book Details</option>
                                                                {row.filteredBookDetails && row.filteredBookDetails.map(book => (
                                                                    <option key={book.id} value={book.purchase_copy_no}>{book.purchase_copy_no}</option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRow(index)} />
                                                    </td>
                                                </tr>
                                            ))}{selectedEntry.purchaseDetails.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Form.Control
                                                            as="select"
                                                            value={detail.bookId}
                                                            onChange={(e) => handleInputChange(e, 'bookId', index)}
                                                        >
                                                            <option value="">Select a book</option>
                                                            {bookName.map((book, index) => (
                                                                <option key={index} value={book.bookId}>{book.bookName}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            as="select"
                                                            value={detail.purchaseCopyNo}
                                                            onChange={(e) => handleInputChange(e, 'purchaseCopyNo', index)}
                                                        >
                                                            <option value="">Select Purchase Copy No</option>
                                                            {detail.filteredBookDetails && detail.filteredBookDetails.map(book => (
                                                                <option key={book.id} value={book.purchase_copy_no}>{book.purchase_copy_no}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </td>
                                                    <td>
                                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRow(index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                            
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Button onClick={addRow} className="button-color">
                                                        Add Book
                                                    </Button>
                                                </td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleEdit}>
                                Update
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this member?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* View Issue Modal */}
            {selectedEntry && (
                <Modal show={viewModal} onHide={handleCloseModal} centered >
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>Issue </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedEntry.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} >
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedEntry.invoiceDate ? selectedEntry.invoiceDate.substring(0, 10) : ''}
                                            readOnly
                                            className="custom-date-picker"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            value={selectedEntry.ledgerName || ''}
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header ">Sr.No</th>
                                                <th className="table-header">Book Name</th>
                                                <th className="table-header">Book Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedEntry.purchaseDetails.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={detail.bookName}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={detail.bookName}
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default BookIssue;
