/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown, Form, Button, Row, Col, Table } from 'react-bootstrap';
import Login from '../../assets/AvtarLogo.webp';

import { useAuth } from '../Auth/AuthProvider';


import './Demo.css';

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
                fetchBookNames();
                fetchLanguages();
                // fetchSelectedBookPrice();


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
    const [invoiceDate, setInvoiceDate] = useState();

    // function getTodayDate() {
    //     const today = new Date();
    //     const year = today.getFullYear();
    //     let month = today.getMonth() + 1;
    //     let day = today.getDate();

    //     if (month < 10) {
    //         month = '0' + month;
    //     }
    //     if (day < 10) {
    //         day = '0' + day;
    //     }
    //     return `${year}-${month}-${day}`;
    // }

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



    //back
    const handleBack = () => {
        setShowPurchaseForm(true);
        setShowBookDetailsForm(false);
    };


    const [showLibraryInfo, setShowLibraryInfo] = useState(true);
    const [viewToken, setViewToken] = useState(false);

    const handleCloseTables = () => {
        setShowLibraryInfo(false);
        setViewToken(false);
        setShowPurchaseForm(false);
        setShowBookDetailsForm(false);
    };


    //book details under data
    const [bookNamesDetails, setBookNamesDetails] = useState([]);
    const [bookNames, setBookNames] = useState([]);
    const [selectedBook, setSelectedBook] = useState("");

    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedPurchaseCopyNo, setSelectedPurchaseCopyNo] = useState('');

    const fetchBookNames = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/book-details`);
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized - Access token may be invalid or expired');
                } else {
                    throw new Error(`Failed to fetch book names - ${response.status}`);
                }
            }
            const bookListResponse = await response.json();
            console.log("All Book Details:", bookListResponse);

            // Make sure to use 'book_name' and 'purchase_copy_no' consistently
            const filteredBooks = bookListResponse.filter(item => item.book_name && item.purchase_copy_no !== null && item.id !== null);

            // To create a list of unique books with all details
            const uniqueBooks = Array.from(new Set(filteredBooks.map(item => JSON.stringify({
                bookName: item.book_name, // Use 'bookName' for state consistency but take the value from 'book_name'
                purchase_copy_no: item.purchase_copy_no,
                id: item.id
            })))).map(JSON.parse);

            setBookNamesDetails(uniqueBooks);

            // Extracting unique book names for the dropdown
            const uniqueBookNames = Array.from(new Set(bookListResponse.map(item => item.book_name).filter(Boolean)));
            setBookNames(uniqueBookNames);
        } catch (error) {
            console.error('Error fetching book names:', error.message);
        }
    };


    // Handler for when a book name is selected
    const handleBookNameChange = async (e) => {
        const selectedBookName = e.target.value;
        setSelectedBook(selectedBookName);

        setSelectedPurchaseCopyNo('');
        setSelectedBookId(null);

        const price = await fetchSelectedBookPrice(selectedBookName);
        setBookPrice(price);
    };


    const handlePurchaseCopyNumberChange = (e) => {
        const selectedCopyNo = e.target.value;
        setSelectedPurchaseCopyNo(selectedCopyNo);

        // Convert selectedCopyNo to the correct type if necessary. Here it's converted to a number.
        const copyNoAsNumber = Number(selectedCopyNo);

        // Find the book that matches the selected book name and purchase copy number
        const matchingBook = bookNamesDetails.find(book =>
            book.bookName === selectedBook && book.purchase_copy_no === copyNoAsNumber
        );

        if (matchingBook) {
            setSelectedBookId(matchingBook.id); // Update the state with the found ID
        } else {
            console.log("No matching book found.");
            setSelectedBookId(null); // Or handle this scenario as needed
        }
    };




    // get languages
    const [languages, setLanguages] = useState([]);

    const fetchLanguages = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/languages`);
            if (!response.ok) {
                throw new Error('Failed to fetch languages');
            }
            const languagesData = await response.json();
            setLanguages(languagesData);
        } catch (error) {
            console.error('Error fetching languages:', error.message);
        }
    };

    // get price
    const [bookPrice, setBookPrice] = useState('');
    const fetchSelectedBookPrice = async (bookName) => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/book/${bookName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch book price');
            }
            const data = await response.json();
            const price = data.rate;
            return price != null ? price.toString() : '';
        } catch (error) {
            console.error('Error fetching book price:', error.message);
            return '';
        }
    };


   

    const [bookDetails, setBookDetails] = useState({
        ISBN: '',
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
        permanentLocation: '',
        currentLocation: '',
        shelvingLocation: '',
        volumeNo: '',
        fullCallNumber: '',
        accessionNumber: '',
    });

    const handleBookInputChange = (e) => {
        const { name, value } = e.target;
        setBookDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Initialize state variables
    const [showBookDetailsForm, setShowBookDetailsForm] = useState(false);

    
    const handleSubmitBookDetails = async (event) => {
        event.preventDefault();
        try {
            // const price = await fetchSelectedBookPrice(selectedBook);
            // if (!price) {
            //     throw new Error('Price not found');
            // }
            // const bookData = {
            //     bookName: selectedBook,
            //     copyNumber: selectedPurchaseCopyNo,
            //     // price: price,
            //     ...bookDetails 
            // };

            const correctedBookData = {
              copyNumber: selectedPurchaseCopyNo,

                isbn: bookDetails.ISBN,
                language: bookDetails.language,
                classificationNumber: bookDetails.classificationNumber,
                itemNumber: bookDetails.itemNumber,
                author: bookDetails.author,
                editor: bookDetails.editor,
                title: bookDetails.title,
                secondTitle: bookDetails.secondTitle,
                seriesTitle: bookDetails.seriesTitle,
                edition: parseInt(bookDetails.edition), 
                placeOfPublication: bookDetails.placeOfPublication,
                nameOfPublisher: bookDetails.nameOfPublisher,
                publicationYear: parseInt(bookDetails.publicationYear), 
                numberOfPages: parseInt(bookDetails.numberOfPages),
                subjectHeading: bookDetails.subjectHeading,
                secondAuthorEditor: bookDetails.secondAuthorEditor,
                thirdAuthorEditor: bookDetails.thirdAuthorEditor,
                itemType: bookDetails.itemType,
                permanentLocation: bookDetails.permanentLocation,
                currentLocation: bookDetails.currentLocation,
                shelvingLocation: bookDetails.shelvingLocation,
                volumeNo: parseInt(bookDetails.volumeNo), 
                fullCallNumber: bookDetails.fullCallNumber,
                accessionNo: bookDetails.accessionNo 
            };
            
            const response = await fetch(`${BaseURL}/api/purchase/update/book-details/${selectedBookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(correctedBookData),
            });
            if (!response.ok) {
                throw new Error('Failed to submit book details');
            }
            console.log('Book details submitted successfully');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    

    return (
        <div className={`main-container ${showSidebar ? 'sidebar-open' : ''}`}>
            {/* <div className='sidebar'> */}
            <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <ul>
                    <li><span className="heading">RajaLib</span> </li>
                    {/* <li><span onClick={() => {handleCloseTables(); setShowLibraryInfo(true)}}>Dashboard</span></li> */}
                    <li>
                        <span onClick={() => { handleCloseTables(); setShowLibraryInfo(true) }}>
                            Dashboard
                        </span>
                    </li>
                    <li><span onClick={() => { handleCloseTables(); setViewToken(true) }}>Token</span></li>

                    <li><span onClick={() => { handleCloseTables(); setShowPurchaseForm(true) }}>Purchase Bill</span></li>
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

                    {viewToken && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-4 border-style text-center">
                                        <div className="welcome-message">
                                            <h1>Welcome to Library Management, {username}!</h1>
                                            <div className='access-text smaller-text token-text'>
                                                Access Token: {accessToken}
                                            </div>
                                        </div>

                                        <div className="library-info mt-3">
                                            <p>
                                                Library management refers to the process of managing library resources effectively to meet the needs of users. It involves various tasks such as acquiring, organizing, cataloging, circulating, and maintaining library materials.
                                            </p>
                                            <p>
                                                Key aspects of library management include collection development, budgeting, space planning, staff management, user services, and technology integration.
                                            </p>
                                            <p>
                                                Effective library management ensures that library resources are accessible, organized, and utilized efficiently to support the educational, informational, and recreational needs of the community.
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    )}

                    {showLibraryInfo && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-4 border-style text-center">
                                        <div className="welcome-message">
                                            Welcome to Library Management, {username}!
                                        </div>

                                        <div className="library-info mt-3">
                                            <p>
                                                Library management refers to the process of managing library resources effectively to meet the needs of users. It involves various tasks such as acquiring, organizing, cataloging, circulating, and maintaining library materials.
                                            </p>
                                            <p>
                                                Key aspects of library management include collection development, budgeting, space planning, staff management, user services, and technology integration.
                                            </p>
                                            <p>
                                                Effective library management ensures that library resources are accessible, organized, and utilized efficiently to support the educational, informational, and recreational needs of the community.
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    )}

                    {showPurchaseForm && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-2 border-style-heading">
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
                                                        // min={getTodayDate()}
                                                        // max={getTodayDate()}
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

                                            <Table striped bordered hover className="table-bordered-dark">
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
                                                        Add Book
                                                    </Button>

                                                    {rows.length > 5 &&
                                                        <Button variant="danger" onClick={() => deleteRow(rows.length - 1)}>
                                                            Delete Book
                                                        </Button>
                                                    }
                                                </div>
                                                {/* <Button variant="primary" onClick={handleSaveAndNext}>
                                                    Save & Next
                                                </Button> */}
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

                    {showBookDetailsForm && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-2 border-style-heading">
                                        <div className="text-center">
                                            <h3 className="heading-with-line">BOOK DETAILS</h3>
                                        </div>
                                    </div>

                                    <div className="border-dark p-4 border-style">

                                        {/* <div className="d-flex justify-content-end mb-3">
                                            <Button variant="primary" onClick={handleAddBook}>Add Book</Button>
                                        </div> */}

                                        <Form onSubmit={handleSubmitBookDetails}>
                                            <div className="table-responsive">

                                                <Table striped bordered hover className="table-bordered-dark">
                                                    <thead>

                                                        {/* <tr>
                                                        <th className="table-header">Details</th>
                                                        {bookDetails.map((book, index) => (
                                                            <th  key={index}>
                                                                Book {index + 1}
                                                            </th>
                                                        ))}
                                                    </tr> */}
                                                        <tr>
                                                            <th className="table-header">Book Name</th>
                                                            <td>
                                                                <Form.Control
                                                                    as="select"
                                                                    name="bookOptions"
                                                                    value={selectedBook}
                                                                    onChange={handleBookNameChange}
                                                                >
                                                                    <option value="">Select Book</option>
                                                                    {bookNames.map((book, index) => (
                                                                        <option key={index} value={book}>
                                                                            {book}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Purchase Copy No.</th>
                                                            <td>
                                                                <Form.Control
                                                                    as="select"
                                                                    name="copyNo"
                                                                    value={selectedPurchaseCopyNo}
                                                                    onChange={handlePurchaseCopyNumberChange}
                                                                >
                                                                    <option value="">Select copy number</option>
                                                                    {selectedBook && bookNamesDetails
                                                                        .filter(book => book.bookName === selectedBook)
                                                                        .map((book, index) => (
                                                                            <option key={index} value={book.purchase_copy_no}>
                                                                                {book.purchase_copy_no}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </Form.Control>
                                                            </td>
                                                        </tr>



                                                        <tr>
                                                            <th className="table-header">Book Price</th>
                                                            <td>
                                                                <span>{bookPrice}</span>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Language</th>
                                                            <td>
                                                                <Form.Control
                                                                    as="select"
                                                                    name="language"
                                                                    onChange={handleBookInputChange}
                                                                >
                                                                    <option value="">Select Language</option>
                                                                    {languages.map((language, index) => (
                                                                        <option key={index} value={language.bookLangName}>
                                                                            {language.bookLangName}
                                                                        </option>
                                                                    ))}
                                                                </Form.Control>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">ISBN</th>
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="ISBN"
                                                                    value={bookDetails.ISBN}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Classification Number</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="classificationNumber"
                                                                    value={bookDetails.classificationNumber}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>


                                                        <tr>
                                                            <th className="table-header">Item Number</th>
                                                            <th >
                                                                <Form.Control
                                                                    type="text"
                                                                    name="itemNumber"
                                                                    value={bookDetails.itemNumber}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Book Author</th>
                                                            <th >
                                                                <Form.Control
                                                                    type="text"
                                                                    name="author"
                                                                    value={bookDetails.author}
                                                                    onChange={handleBookInputChange}

                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Editor</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="editor"
                                                                    value={bookDetails.editor}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Title</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="title"
                                                                    value={bookDetails.title}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Second Title</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="secondTitle"
                                                                    value={bookDetails.secondTitle}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Series Title</th>
                                                            <th >
                                                                <Form.Control
                                                                    type="text"
                                                                    name="seriesTitle"
                                                                    value={bookDetails.seriesTitle}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Edition</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="edition"
                                                                    value={bookDetails.edition}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Place of Publication</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="placeOfPublication"
                                                                    value={bookDetails.placeOfPublication}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Name of Publisher</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="nameOfPublisher"
                                                                    value={bookDetails.nameOfPublisher}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Publication Year</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="publicationYear"
                                                                    value={bookDetails.publicationYear}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">No. of Pages</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="numberOfPages"
                                                                    value={bookDetails.numberOfPages}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Subject Heading</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="subjectHeading"
                                                                    value={bookDetails.subjectHeading}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Second Author/Editor</th>
                                                            <th >
                                                                <Form.Control
                                                                    type="text"
                                                                    name="secondAuthorEditor"
                                                                    value={bookDetails.secondAuthorEditor}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Third Author/Editor</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="thirdAuthorEditor"
                                                                    value={bookDetails.thirdAuthorEditor}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Item Type</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="itemType"
                                                                    value={bookDetails.itemType}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Permanant Location</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="permanentLocation"
                                                                    value={bookDetails.permanentLocation}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Currenmt Location</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="currentLocation"
                                                                    value={bookDetails.currentLocation}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Shelving Location</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="shelvingLocation"
                                                                    value={bookDetails.shelvingLocation}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Voume No.</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="volumeNo"
                                                                    value={bookDetails.volumeNo}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <th className="table-header">Full Call No.</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="fullCallNumber"
                                                                    value={bookDetails.fullCallNumber}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>



                                                        <tr>
                                                            <th className="table-header">Accession No.</th>
                                                            <th>
                                                                <Form.Control
                                                                    type="number"
                                                                    name="accessionNo"
                                                                    value={bookDetails.accessionNo}
                                                                    onChange={handleBookInputChange}
                                                                />
                                                            </th>
                                                        </tr>

                                                        {/* <tr>
                                                            <th className="table-header">Actions</th>
                                                            {bookDetails.map((book, index) => (
                                                                <th key={index}> */}
                                                        {/* <Button variant="danger" onClick={() => handleRemoveBook(index)}>Remove Book</Button> */}
                                                        {/* {index > 0 && (
                                                                    <Button variant="danger" onClick={() => handleRemoveBook(index)}>Remove Book</Button>
                                                                )} */}
                                                        {/* </th>
                                                            ))}
                                                        </tr> */}

                                                    </thead>
                                                </Table>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between">
                                                {/* <div className="d-flex justify-content-end"> */}
                                                <Button variant="outline-secondary" onClick={handleBack}>
                                                    Back
                                                </Button>
                                                <Button variant="success" type="submit" onClick={handleSubmitBookDetails}>
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
