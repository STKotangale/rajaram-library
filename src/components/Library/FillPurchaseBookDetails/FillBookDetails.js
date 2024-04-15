/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

import { useAuth } from '../../Auth/AuthProvider';

const FillBookDetails = () => {
    const BaseURL = process.env.REACT_APP_BASE_URL;
    //book details data
    const [bookNamesDetails, setBookNamesDetails] = useState([]);
    const [bookNames, setBookNames] = useState([]);
    const [selectedBook, setSelectedBook] = useState("");
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedPurchaseCopyNo, setSelectedPurchaseCopyNo] = useState('');

    const { username, accessToken } = useAuth();

    useEffect(() => {
        //get username and access token

    }, [username, accessToken]);

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
            // console.log("All Book Details:", bookListResponse);

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
            toast.error('Error fetching book names:', error.message);
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
            toast.error("No matching book found.");
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
            toast.error('Error fetching languages:', error.message);
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
            toast.error('Error fetching book price:', error.message);
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
        accessionNo: '',
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
            toast.success('Book details submitted successfully');
            // Reset all fields
            setSelectedBook("");
            setSelectedBookId(null);
            setSelectedPurchaseCopyNo('');
            setBookPrice('');
            setBookDetails({
                ISBN: '', language: '', classificationNumber: '', itemNumber: '',
                author: '', editor: '', title: '', secondTitle: '', seriesTitle: '',
                edition: '', placeOfPublication: '', nameOfPublisher: '', publicationYear: '',
                numberOfPages: '', subjectHeading: '', secondAuthorEditor: '', thirdAuthorEditor: '',
                itemType: '', permanentLocation: '', currentLocation: '', shelvingLocation: '',
                volumeNo: '', fullCallNumber: '', accessionNo: '',
            });
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Failed to submit book details');
        }
    };


    const handlePriceChange = (event) => {
        setBookPrice(event.target.value); // Update bookPrice with the input's current value
    };

    return (
        <div className="main-content-book-details">
            <Container>
                <Row className="book-details-main">
                    <Col xs={12} md={10} lg={10}>
                        <h1 className="mt-4">Book Details</h1>
                        <div className="mt-5 border p-4">
                            <Form onSubmit={handleSubmitBookDetails}>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Book Name</Form.Label>
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
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Purchase Copy No.</Form.Label>
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
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Book Price</Form.Label>
                                        {/* <span>{bookPrice}</span> */}
                                        <Form.Control
                                            type="text"
                                            value={bookPrice}
                                            onChange={handlePriceChange} // Add the onChange handler here
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Language</Form.Label>
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
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>ISBN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ISBN"
                                            value={bookDetails.ISBN}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Classification Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="classificationNumber"
                                            value={bookDetails.classificationNumber}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Item Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="itemNumber"
                                            value={bookDetails.itemNumber}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Book Author</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="author"
                                            value={bookDetails.author}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Editor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="editor"
                                            value={bookDetails.editor}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={bookDetails.title}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Second Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="secondTitle"
                                            value={bookDetails.secondTitle}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Series Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="seriesTitle"
                                            value={bookDetails.seriesTitle}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Edition</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="edition"
                                            value={bookDetails.edition}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Place of Publication</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="placeOfPublication"
                                            value={bookDetails.placeOfPublication}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Name of Publisher</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nameOfPublisher"
                                            value={bookDetails.nameOfPublisher}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Publication Year</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="publicationYear"
                                            value={bookDetails.publicationYear}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>No. of Pages</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="numberOfPages"
                                            value={bookDetails.numberOfPages}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Subject Heading</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subjectHeading"
                                            value={bookDetails.subjectHeading}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Second Author/Editor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="secondAuthorEditor"
                                            value={bookDetails.secondAuthorEditor}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Third Author/Editor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="thirdAuthorEditor"
                                            value={bookDetails.thirdAuthorEditor}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Item Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="itemType"
                                            value={bookDetails.itemType}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Permanant Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="permanentLocation"
                                            value={bookDetails.permanentLocation}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Currenmt Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="currentLocation"
                                            value={bookDetails.currentLocation}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Shelving Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="shelvingLocation"
                                            value={bookDetails.shelvingLocation}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>


                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Voume No.</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="volumeNo"
                                            value={bookDetails.volumeNo}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Full Call No.</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fullCallNumber"
                                            value={bookDetails.fullCallNumber}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Accession No.</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="accessionNo"
                                            value={bookDetails.accessionNo}
                                            onChange={handleBookInputChange}
                                        />
                                    </Form.Group>
                                </Row>

                                <div className="d-flex justify-content-end">
                                    <Button className="button-color" type="submit" onClick={handleSubmitBookDetails}>
                                        Submit
                                    </Button>
                                </div>

                            </Form>

                        </div>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default FillBookDetails;
