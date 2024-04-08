/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown, Form, Button, Row, Col, Table } from 'react-bootstrap';
import Login from '../../assets/AvtarLogo.webp';


import { useAuth } from '../Auth/AuthProvider';


const Purchase = () => {
    const navigate = useNavigate();
    const [showToken, setShowToken] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '', quantity: '', rate: '', amount: '' })));
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(0);

    const BaseURL = process.env.REACT_APP_BASE_URL;

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {
        console.log('Username:', username);
        console.log('AccessToken:', accessToken);
    }, [username, accessToken]);

    //get ledger name
    const [ledgerName, setLedgerName] = useState([]);
    const [selectedLedgerName, setSelectedLedgerName] = useState("");
    const [selectedLedgerId, setSelectedLedgerId] = useState('');


//handle ledger change
    const handleLedgerChange = (event) => {
        const name = event.target.value;
        setSelectedLedgerName(name);
        const ledger = ledgerName.find(l => l.ledgerName === name);
        if (ledger) {
            setSelectedLedgerId(ledger.ledgerId);
        } else {
            setSelectedLedgerId("");
        }
    };



    //get ledger name
    useEffect(() => {
        const fetchLedgerNames = async () => {
            try {
                if (!accessToken) {
                    throw new Error('Access token not found');
                }
                const response = await fetch(`${BaseURL}/api/ledger/list`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized - Access token may be invalid or expired');
                    } else {
                        throw new Error(`Failed to fetch party names - ${response.status}`);
                    }
                }
                const ledgerNameId = await response.json();
                console.log("ledger name", ledgerNameId);
                setLedgerName(ledgerNameId);
            } catch (error) {
                console.error('Error fetching party names:', error.message);
            }
        };
        fetchLedgerNames();
    }, []);


    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    //show token  and hide token
    const handleViewToken = () => {
        setShowToken(!showToken);
    };


    //bill total
    const calculateBillTotal = () => {
        let allTotal = 0;
        rows.forEach(row => {
            if (row.quantity && row.rate) {
                allTotal += parseFloat(row.quantity) * parseFloat(row.rate); //allTotal + =quantity*rate
            }
        });
        return allTotal;
    };

    //discount change
    const handleDiscountChange = (e) => {
        const value = e.target.value.trim();
        if (value === '' || !isNaN(parseFloat(value))) {
            setDiscountPercentage(value === '' ? '' : parseFloat(value));
        }
    };

    // //show discount price
    const calculateDiscount = () => {
        const billTotal = calculateBillTotal();
        const discountAmount = billTotal * (discountPercentage / 100); //Discount amount=allTotal * (dicount in % / 100)
        return Math.floor(discountAmount);
    };

    //calculate after discount
    const calculateTotalAfterDiscount = () => {
        const billTotal = calculateBillTotal();
        const totalAfterDiscount = billTotal - (billTotal * (discountPercentage / 100)); //total after discount = total bill - discount amount
        return Math.floor(totalAfterDiscount);
    };


    //gst  
    const handleGstChange = (e) => {
        const value = e.target.value.trim();
        if (value === '' || !isNaN(parseFloat(value))) {
            setGstPercentage(value === '' ? '' : parseFloat(value));
        }
    };

    const calculateGst = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount();
        const gstAmount = totalAfterDiscount * (gstPercentage / 100); //gst amount = total after discount * (gst % / 100)
        return Math.floor(gstAmount);
    };

    //grand total
    const calculateGrandTotal = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount();
        const grandTotal = totalAfterDiscount + (totalAfterDiscount * (gstPercentage / 100)); //grant toatl = total after discount + gst amount
        return Math.floor(grandTotal);
    };

    //add row
    const addRow = () => {
        setRows([...rows, { bookName: '', quantity: '', rate: '', amount: '' }]);
    };

    // invoice number
    const initializeInvoiceNumber = () => {
        const lastInvoiceNumber = localStorage.getItem('lastInvoiceNumber');
        if (!lastInvoiceNumber) return 'TIN1';

        const match = lastInvoiceNumber.match(/(TIN)(\d+)/i);
        if (match && match.length === 3) {
            const prefix = match[1];
            const currentNumber = parseInt(match[2], 10) + 1;
            return `${prefix}${currentNumber}`;
        }
        return 'TIN1';
    };
    const [invoiceNumber, setInvoiceNumber] = useState(initializeInvoiceNumber);


    //handle submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedLedgerName.trim()) {
            event.preventDefault();
            toast.error('Please select ledger name !');
            return;
        }

        const isBookFilled = rows.some(row => row.bookName.trim() !== '');
        if (!isBookFilled) {
            event.preventDefault();
            toast.error('Please enter at least one book.');
            return;
        }

        const filteredRows = rows.filter(row => row.bookName.trim() !== '' && row.quantity.trim() !== '' && row.rate.trim() !== '');

        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            ledgerId: selectedLedgerId,
            billTotal: calculateBillTotal(),
            discountPercent: discountPercentage,
            discountAmount: calculateDiscount(),
            totalAfterDiscount: calculateTotalAfterDiscount(),
            gstPercent: gstPercentage,
            gstAmount: calculateGst(),
            grandTotal: calculateGrandTotal(),
            purchaseDetails: filteredRows.map(row => ({
                bookName: row.bookName,
                qty: parseFloat(row.quantity),
                rate: parseFloat(row.rate),
                amount: row.quantity && row.rate ? parseFloat(row.quantity) * parseFloat(row.rate) : 0
            }))
        };
        console.log("data", payload);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Access token not found. Please log in again.');
                return;
            }
            const response = await fetch(`${BaseURL}/api/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const purchaseDetails = await response.json();
                toast.success(purchaseDetails.message);
                
                const num = purchaseDetails.invoiceNo + 1;
                console.log("Purchase Details", purchaseDetails);
                setInvoiceNumber(num);
                setShowPurchaseForm(false);
                setShowBookDetailsForm(true);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Service Temporarily Unavailable or Error submitting invoice. Please try again.');
            console.error('Error message:', error.message);
        }
    };


    //handle change
    const handleRowChange = (index, e) => {
        const { name, value } = e.target;
        const newRows = [...rows];
        newRows[index][name] = value;
        setRows(newRows);
    };


    // get today date 
    const [invoiceDate, setInvoiceDate] = useState(getTodayDate());

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return `${year}-${month}-${day}`;
    }

    // Function to handle invoice date change
    const handleInvoiceDateChange = (e) => {
        setInvoiceDate(e.target.value);
    };


    //delete row
    const deleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };

    //sidebar purchse form show
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };


    // Function to handle search query change
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // fillter name
    const filteredLedgerName = ledgerName.filter(ledger =>
        ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );



//book details
// Define initial state for book details
const initialBookDetails = {
    bookNameInBookDetail: '',
    isbn: '',
    bookPrice: '',
    language: '',
    classificationNumber: '',
    itemNumber: '',
    author: '',
    editor: '',
    title: '',
    secondTitle: '',
    seriesTitle: '',
    edition: '',
    placeOfPublication: '',
    nameOfPublisher: '',
    publicationYear: '',
    numberOfPages: '',
    subjectHeading: '',
    secondAuthorEditor: '',
    thirdAuthorEditor: '',
    itemType: '',
    permanantLocation: '',
    currentLocation: '',
    shelvingLocation: '',
    voumeNo: '',
    fullCallNumber: '',
    copyNo: '',
    accessionNo: ''
};

// Initialize state variables
const [showBookDetailsForm, setShowBookDetailsForm] = useState(false);
const [bookDetails, setBookDetails] = useState([initialBookDetails]);

// Function to handle changes in book details
const handleBookInputChange = (index, name, value) => {
    const newList = [...bookDetails];
    newList[index][name] = value;
    setBookDetails(newList);
};

// Function to add a new book
const handleAddBook = () => {
    setBookDetails([...bookDetails, initialBookDetails]);
};

// Function to remove a book
const handleRemoveBook = (index) => {
    const newList = [...bookDetails];
    newList.splice(index, 1);
    setBookDetails(newList);
};

// Function to submit book details
const handleSubmitBookDetails = (event) => {
    event.preventDefault();
    const bookData = {
        books: bookDetails
    };

    fetch('your-api-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    })
    .then(response => {
        // Handle response from the API
        if (response.ok) {
            toast.success('Data submitted successfully');
            console.log('Data submitted successfully');
        } else {
            toast.error('Failed to submit data');
            console.error('Failed to submit data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};




    return (
        <div className={`main-container ${showSidebar ? 'sidebar-open' : ''}`}>
            {/* <div className='sidebar'> */}
            <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <ul>
                    <li><span className="heading">RajaLib</span> </li>
                    <li><span onClick={() => setShowPurchaseForm(true)}>Purchase Bill</span></li>
                </ul>
            </div>

            <div className={`content ${showSidebar ? 'content-shifted' : ''}`}>

                {/* <Navbar bg="dark" variant="dark" expand="lg" className="navbarnavabar"> */}
                <Navbar bg="dark" variant="dark" expand="lg" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
                    <div className="container-fluid">
                        <div className="sidebar-toggle" onClick={toggleSidebar}>
                            ☰
                        </div>

                        <Nav className="me-auto">
                            <Navbar.Brand href="#">Registration and Login System</Navbar.Brand>
                        </Nav>
                        <div className="profileicon">
                            <Dropdown className="custom-dropdown-toggle profile-icon">
                                <Dropdown.Toggle variant="custom" id="dropdown-basic">
                                    <img src={Login} className="loginregistericon" alt="loginregistericon" height="25" width="25" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu-show'>
                                    <Dropdown.Item disabled>{username}</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Navbar>

                <div className="fixed-button-container">
                    <div className='access-token'>
                        <button onClick={handleViewToken}>
                            {showToken ? 'Hide Token' : 'Show Token'}
                            {showToken && (
                                <div className='access-text smaller-text'>
                                    Access Token:{accessToken}
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="main-content">
                    {showBookDetailsForm && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-2 border-style">
                                        <div className="text-center">
                                            <h3 className="heading-with-line">PURCHASE</h3>
                                        </div>
                                    </div>

                                    <div className="border-dark p-4 border-style">
                                        <Form onSubmit={handleSubmit}>

                                            <Row className="mb-3">
                                                <Form.Group as={Col}>
                                                    <Form.Label>Invoice No</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={invoiceNumber}
                                                        readOnly
                                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col}>
                                                    <Form.Label>Invoice Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={invoiceDate}
                                                        min={getTodayDate()}
                                                        max={getTodayDate()}
                                                        onChange={handleInvoiceDateChange}
                                                        className="custom-date-picker"
                                                    />
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} sm={6}>
                                                    <Form.Label>Ledger Name</Form.Label>
                                                    <Form.Control
                                                        as="input"
                                                        list="ledgerNames"
                                                        value={selectedLedgerName}
                                                        onChange={handleLedgerChange}
                                                        placeholder="Search or select ledger name"
                                                    />
                                                    <datalist id="ledgerNames">
                                                        {filteredLedgerName.map((ledger) => (
                                                            <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                                        ))}
                                                    </datalist>

                                                </Form.Group>
                                            </Row>

                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th className="table-header">Sr.No</th>
                                                        <th className="table-header">Book Name</th>
                                                        <th className="table-header">No Of Quantity</th>
                                                        <th className="table-header">Rate</th>
                                                        <th className="table-header">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="bookName"
                                                                    value={row.bookName}
                                                                    onChange={(e) => handleRowChange(index, e)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="quantity"
                                                                    value={row.quantity}
                                                                    onChange={(e) => handleRowChange(index, e)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="rate"
                                                                    value={row.rate}
                                                                    onChange={(e) => handleRowChange(index, e)}
                                                                />
                                                            </td>
                                                            <td>
                                                                {(row.quantity && row.rate) ? (parseFloat(row.quantity) * parseFloat(row.rate)) : ''}

                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Bill Total</td>
                                                        <td>{calculateBillTotal()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Discount</td>
                                                        <td>
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Enter discount"
                                                                value={discountPercentage}
                                                                onChange={handleDiscountChange}
                                                            />
                                                        </td>
                                                        <td>{calculateDiscount()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Total After Discount</td>
                                                        <td></td>
                                                        <td>{calculateTotalAfterDiscount()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td>GST</td>
                                                        <td>
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Enter GST (%)"
                                                                value={gstPercentage}
                                                                onChange={handleGstChange}
                                                            />
                                                        </td>
                                                        <td>{calculateGst()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>Grand Total:</td>
                                                        <td>{calculateGrandTotal()}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>

                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <Button variant="primary" onClick={addRow} className="add-row-button">
                                                        Add Row
                                                    </Button>

                                                    {rows.length > 5 &&
                                                        <Button variant="danger" onClick={() => deleteRow(rows.length - 1)}>
                                                            Delete Row
                                                        </Button>
                                                    }
                                                </div>
                                                <Button variant="success" type="submit">
                                                    Submit
                                                </Button>
                                            </div>

                                        </Form>

                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    )}

                    {showPurchaseForm && (

                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-2 border-style">
                                        <div className="text-center">
                                            <h3 className="heading-with-line">BOOK DETAILS</h3>
                                        </div>
                                    </div>

                                    <div className="border-dark p-4 border-style">

                                        <div className="d-flex justify-content-end mb-3">
                                            <Button variant="secondary" onClick={handleAddBook}>Add Book</Button>
                                        </div>

                                        <Form onSubmit={handleSubmitBookDetails}>

                                            <Table striped bordered hover>
                                                <thead>

                                                    <tr>
                                                        <th className="table-header">Details</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th className="table-header" key={index}>
                                                                Book {index + 1}
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Book Name</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="bookNameInBookDetail"
                                                                    value={book.bookNameInBookDetail}
                                                                    onChange={(e) => handleBookInputChange(index, 'bookNameInBookDetail', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Book Author</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="author"
                                                                    value={book.author}
                                                                    onChange={(e) => handleBookInputChange(index, 'author', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">ISBN</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="isbn"
                                                                    value={book.isbn}
                                                                    onChange={(e) => handleBookInputChange(index, 'isbn', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Book Price</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="bookPrice"
                                                                    value={book.bookPrice}
                                                                    onChange={(e) => handleBookInputChange(index, 'bookPrice', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Language</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="language"
                                                                    value={book.language}
                                                                    onChange={(e) => handleBookInputChange(index, 'language', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Classification Number</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="classificationNumber"
                                                                    value={book.classificationNumber}
                                                                    onChange={(e) => handleBookInputChange(index, 'classificationNumber', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Item Number</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="itemNumber"
                                                                    value={book.itemNumber}
                                                                    onChange={(e) => handleBookInputChange(index, 'itemNumber', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Editor</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="editor"
                                                                    value={book.editor}
                                                                    onChange={(e) => handleBookInputChange(index, 'editor', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Title</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="title"
                                                                    value={book.title}
                                                                    onChange={(e) => handleBookInputChange(index, 'title', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Second Title</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="secondTitle"
                                                                    value={book.secondTitle}
                                                                    onChange={(e) => handleBookInputChange(index, 'secondTitle', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Series Title</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="seriesTitle"
                                                                    value={book.seriesTitle}
                                                                    onChange={(e) => handleBookInputChange(index, 'seriesTitle', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Edition</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="edition"
                                                                    value={book.edition}
                                                                    onChange={(e) => handleBookInputChange(index, 'edition', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Place of Publication</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="placeOfPublication"
                                                                    value={book.placeOfPublication}
                                                                    onChange={(e) => handleBookInputChange(index, 'placeOfPublication', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Name of Publisher</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="nameOfPublisher"
                                                                    value={book.nameOfPublisher}
                                                                    onChange={(e) => handleBookInputChange(index, 'nameOfPublisher', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Publication Year</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="publicationYear"
                                                                    value={book.publicationYear}
                                                                    onChange={(e) => handleBookInputChange(index, 'publicationYear', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">No. of Pages</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="numberOfPages"
                                                                    value={book.numberOfPages}
                                                                    onChange={(e) => handleBookInputChange(index, 'numberOfPages', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Subject Heading</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="subjectHeading"
                                                                    value={book.subjectHeading}
                                                                    onChange={(e) => handleBookInputChange(index, 'subjectHeading', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Second Author/Editor</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="secondAuthorEditor"
                                                                    value={book.secondAuthorEditor}
                                                                    onChange={(e) => handleBookInputChange(index, 'secondAuthorEditor', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Third Author/Editor</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="thirdAuthorEditor"
                                                                    value={book.thirdAuthorEditor}
                                                                    onChange={(e) => handleBookInputChange(index, 'thirdAuthorEditor', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Item Type</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="itemType"
                                                                    value={book.itemType}
                                                                    onChange={(e) => handleBookInputChange(index, 'itemType', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Permanant Location</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="permanantLocation"
                                                                    value={book.permanantLocation}
                                                                    onChange={(e) => handleBookInputChange(index, 'permanantLocation', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Currenmt Location</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="currenmtLocation"
                                                                    value={book.currenmtLocation}
                                                                    onChange={(e) => handleBookInputChange(index, 'currenmtLocation', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Shelving Location</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="shelvingLocation"
                                                                    value={book.shelvingLocation}
                                                                    onChange={(e) => handleBookInputChange(index, 'shelvingLocation', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Voume No.</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="voumeNo"
                                                                    value={book.voumeNo}
                                                                    onChange={(e) => handleBookInputChange(index, 'voumeNo', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Full Call No.</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="fullCallNumber"
                                                                    value={book.fullCallNumber}
                                                                    onChange={(e) => handleBookInputChange(index, 'fullCallNumber', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Copy No.</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="copyNo"
                                                                    value={book.copyNo}
                                                                    onChange={(e) => handleBookInputChange(index, 'copyNo', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Accession No.</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="accessionNo"
                                                                    value={book.accessionNo}
                                                                    onChange={(e) => handleBookInputChange(index, 'accessionNo', e.target.value)}
                                                                />
                                                            </th>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <th className="table-header">Actions</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th key={index}>
                                                                <Button variant="danger" onClick={() => handleRemoveBook(index)}>Remove Book</Button>
                                                            </th>
                                                        ))}
                                                    </tr>

                                                </thead>
                                            </Table>

                                            <div className="d-flex justify-content-end">
                                                <Button variant="success" type="submit">
                                                    Submit
                                                </Button>
                                            </div>

                                        </Form>

                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    )}


                    <div className="container">
                        <div className="row"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Purchase;
