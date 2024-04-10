/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown, Form, Button, Row, Col, Table } from 'react-bootstrap';
import Login from '../../assets/AvtarLogo.webp';

import { useAuth } from '../Auth/AuthProvider';
import './PurchaseBillBookDetails.css';


const BookDetailsPage = () => {
    const navigate = useNavigate();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    //sidebar open close
    const [showSidebar, setShowSidebar] = useState(false);

    //book details data
    const [bookNamesDetails, setBookNamesDetails] = useState([]);
    const [bookNames, setBookNames] = useState([]);
    const [selectedBook, setSelectedBook] = useState("");
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedPurchaseCopyNo, setSelectedPurchaseCopyNo] = useState('');

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    //get book name and languages
    useEffect(() => {
        fetchBookNames();
        fetchLanguages();
    }, []);

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

            const filteredBooks = bookListResponse.filter(item => item.book_name && item.purchase_copy_no !== null && item.id !== null);
            const uniqueBooks = Array.from(new Set(filteredBooks.map(item => JSON.stringify({
                bookName: item.book_name,
                purchase_copy_no: item.purchase_copy_no,
                id: item.id
            })))).map(JSON.parse);

            setBookNamesDetails(uniqueBooks);
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
        const price = await fetchSelectedBookPrice(selectedBookName);  //fetch book price
        setBookPrice(price);
    };

    const handlePurchaseCopyNumberChange = (e) => {
        const selectedCopyNo = e.target.value;
        setSelectedPurchaseCopyNo(selectedCopyNo);
        const copyNoAsNumber = Number(selectedCopyNo);
        const matchingBook = bookNamesDetails.find(book =>
            book.bookName === selectedBook && book.purchase_copy_no === copyNoAsNumber
        );
        if (matchingBook) {
            setSelectedBookId(matchingBook.id);
        } else {
            console.log("No matching book found.");
            setSelectedBookId(null);
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
                bookName: selectedBook,
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

    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    const handleDashboard = () => {
        navigate('/sidebar');
    };

    const handlePurchaseBillClick = () => {
        navigate('/purchasebillpage');
    };

    return (
        <div className={`main-container ${showSidebar ? 'sidebar-open' : ''}`}>
            <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <ul>
                    <li><span className="heading">Rajaram Library</span> </li>
                    <li>
                        <span onClick={() => { handleDashboard(); }}>
                            Dashboard
                        </span>
                    </li>
                    <li><span onClick={() => { handlePurchaseBillClick(); }}>Purchase Bill</span></li>

                    <li><span>Book Details</span></li>
                </ul>
            </div>

            <div className={`content ${showSidebar ? 'content-shifted' : ''}`}>

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


                <div className="main-content">



                    <Container>
                        <Row className="justify-content-md-center mt-5">
                            <Col xs={12} md={10} lg={10}>
                                <div className="border-dark p-2 border-style-heading">
                                    <div className="text-center">
                                        <h3 className="heading-with-line">BOOK DETAILS</h3>
                                    </div>
                                </div>

                                <div className="border-dark p-4 border-style">


                                    <Form onSubmit={handleSubmitBookDetails}>
                                        <div className="table-responsive">

                                            <Table striped bordered hover className="table-bordered-dark">
                                                <thead>

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



                                                </thead>
                                            </Table>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between">
                                            <Button variant="outline-secondary" onClick={handlePurchaseBillClick}>
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

                </div>
            </div>

        </div>
    );
};

export default BookDetailsPage;
