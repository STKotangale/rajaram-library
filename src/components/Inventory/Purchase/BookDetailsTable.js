/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthProvider';
import { toast } from 'react-toastify';
import { PencilSquare } from 'react-bootstrap-icons';

const BookDetailsTable = () => {
    //get book purchase
    const [bookDetails, setBookDetails] = useState([]);
    //update book details
    const [showUpdateBookDetails, setShowUpdateBookDetails] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    //get languages
    const [bookLanguages, setBookLanguages] = useState([]);
    // get book type
    const [bookTypes, setBookTypes] = useState([]);
    const [selectedBookType, setSelectedBookType] = useState('');
    //get book author
    const [bookAuthors, setBookAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    //book publisher
    const [bookPublication, setBookPublication] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState('');
    //auth
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const { username, accessToken } = useAuth();

    useEffect(() => {
        fetchBookDetails();
    }, []);

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

    //update book details
    const handleUpdate = (book) => {
        setSelectedBook(book);
        setShowUpdateBookDetails(true);
    };

    //update api
    const updateBookDetails = async (e) => {
        e.preventDefault();
        try {
            if (!selectedBook) {
                throw new Error('No book selected');
            }
            const response = await fetch(`${BaseURL}/api/purchase/update/book-details/${selectedBook.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedBook),
            });
            if (!response.ok) {
                throw new Error('Failed to update book details');
            }
            const bookDetails = await response.json();
            console.log("book details update", bookDetails);
            toast.success('Book details updaet successfully.');
            setShowUpdateBookDetails(false);
        } catch (error) {
            console.error('Error updating book details:', error);
        }
    };

    // another api call
    // get languages
    const fetchBookLanguages = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-languages`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBookLanguages(data.data);
        } catch (error) {
            console.error('Error fetching book languages:', error);
        }
    };
    const handleBookInputChange = (e) => {
        const { name, value } = e.target;
        setBookDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //get book types
    const fetchBookTypes = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-types`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book types: ${response.statusText}`);
            }
            const data = await response.json();
            setBookTypes(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book types. Please try again later.');
        }
    };

    const handleBookTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedBookType(selectedType);
    };

    //get api  book author
    const fetchBookAuthors = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book-authors`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book authors: ${response.statusText}`);
            }
            const data = await response.json();
            setBookAuthors(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAuthorChange = (event) => {
        const selectedType = event.target.value;
        setSelectedAuthor(selectedType);
    };

    //get api book publisher
    const fetchBookPublication = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book-publications`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book publication: ${response.statusText}`);
            }
            const data = await response.json();
            setBookPublication(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book publication. Please try again later.');
        }
    };

    const handlePublicationChange = (event) => {
        const selectedType = event.target.value;
        setSelectedPublication(selectedType);
    };

    useEffect(() => {
        fetchBookLanguages();
        fetchBookTypes();
        fetchBookAuthors();
        fetchBookPublication();
    }, []);


    return (

        <div className='mt-3 table-container-general-member-1'>
            <div className="table-responsive">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sr.No.</th>
                            <th>Book Name</th>
                            <th>Purchase Copy No.</th>
                            <th>Rate</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookDetails.map((book, index) => (
                            <tr key={book.id}>
                                <td>{index + 1}</td>
                                <td>{book.book_name}</td>
                                <td>{book.purchase_copy_no}</td>
                                <td>{book.rate}</td>
                                <td>
                                    <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleUpdate(book)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Update Book Details Modal */}
            <Modal show={showUpdateBookDetails} onHide={() => setShowUpdateBookDetails(false)} size='xl'>
                <div className='bg-light'>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Book Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={updateBookDetails}>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="bookName">
                                    <Form.Label>Book Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.book_name || ''}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="copyNo">
                                    <Form.Label>Purchase Copy No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.purchase_copy_no || ''}
                                        readOnly
                                    // onChange={(e) => setSelectedBook({ ...selectedBook, purchase_copy_no: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="rate">
                                    <Form.Label>Rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.rate || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, rate: e.target.value })}
                                    // readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="isbn">
                                    <Form.Label>ISBN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.isbn || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, isbn: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="itemNumber">
                                    <Form.Label>Item Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.itemNumber || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, itemNumber: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="classificationNumber">
                                    <Form.Label>Classification Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.classificationNumber || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, classificationNumber: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group lg={4} as={Col}>
                                    <Form.Label>Language</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="language"
                                        onChange={(e) => {
                                            setSelectedBook({ ...selectedBook, classificationNumber: e.target.value });
                                            handleBookInputChange();
                                        }}
                                    >
                                        <option value="">Select Language</option>
                                        {bookLanguages.map((language, index) => (
                                            <option key={index} value={language.bookLangName}>
                                                {language.bookLangName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="author">
                                    <Form.Label>Author</Form.Label>
                                    <Form.Select
                                        value={selectedAuthor}
                                        onChange={(e) => {
                                            setSelectedAuthor(e.target.value);
                                            handleAuthorChange(e);
                                        }}
                                    >
                                        <option value="">Select Book Type</option>
                                        {bookAuthors.map((bookAuthor, index) => (
                                            <option key={index} value={bookAuthor.authorName}>
                                                {bookAuthor.authorName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group lg={4} as={Col}>
                                    <Form.Label>Book Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="bookTypeOption"
                                        value={selectedBookType}
                                        onChange={(e) => {
                                            setSelectedBook({ ...selectedBook, typeofbook: e.target.value });
                                            handleBookTypeChange();
                                        }}
                                    >
                                        <option value="">Select Book Type</option>
                                        {bookTypes.map((bookType, index) => (
                                            <option key={index} value={bookType.bookTypeName}>
                                                {bookType.bookTypeName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="publicaion">
                                    <Form.Label>Publication Name</Form.Label>
                                    <Form.Select
                                        value={selectedPublication}
                                        onChange={(e) => {
                                            setSelectedPublication(e.target.value);
                                            handlePublicationChange(e);
                                        }}
                                    >
                                        <option value="">Select Book Type</option>
                                        {bookPublication.map((bookPublication, index) => (
                                            <option key={index} value={bookPublication.publicationName}>
                                                {bookPublication.publicationName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" lg={4} as={Col} controlId="secondTitle">
                                    <Form.Label>Second Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.secondTitle || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, secondTitle: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="seriesTitle">
                                    <Form.Label>Series Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.seriesTitle || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, seriesTitle: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="edition">
                                    <Form.Label>Edition</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.edition || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, edition: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="placeOfPublication">
                                    <Form.Label>Place of Publication</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.placeOfPublication || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, placeOfPublication: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.title || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="publicationYear">
                                    <Form.Label>Publication Year</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.publicationYear || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, publicationYear: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="numberOfPages">
                                    <Form.Label>Number of Pages</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.numberOfPages || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, numberOfPages: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="subjectHeading">
                                    <Form.Label>Subject Heading</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.subjectHeading || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, subjectHeading: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="secondAuthorEditor">
                                    <Form.Label>Second Author/Editor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.secondAuthorEditor || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, secondAuthorEditor: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="thirdAuthorEditor">
                                    <Form.Label>Third Author/Editor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.thirdAuthorEditor || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, thirdAuthorEditor: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="itemType">
                                    <Form.Label>Item Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.itemType || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, itemType: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="permanentLocation">
                                    <Form.Label>Permanent Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.permanentLocation || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, permanentLocation: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="currentLocation">
                                    <Form.Label>Current Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.currentLocation || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, currentLocation: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="shelvingLocation">
                                    <Form.Label>Shelving Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.shelvingLocation || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, shelvingLocation: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="volumeNo">
                                    <Form.Label>Volume No </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.volumeNo || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, volumeNo: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="fullCallNumber">
                                    <Form.Label>full Call Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.fullCallNumber || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, fullCallNumber: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="accessionNo">
                                    <Form.Label>Accession No </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.accessionNo || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, accessionNo: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editor">
                                    <Form.Label>Editor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.editor || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, editor: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>


                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">Submit</Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
};

export default BookDetailsTable;
