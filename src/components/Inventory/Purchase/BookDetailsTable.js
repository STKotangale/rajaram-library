/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthProvider';
import { toast } from 'react-toastify';
import { PencilSquare } from 'react-bootstrap-icons';

import '../InventoryCSS/PurchaseBookDashboardData.css'

const BookDetailsTable = () => {
    //get book purchase
    const [bookDetails, setBookDetails] = useState([]);
    //update book details
    const [showUpdateBookDetails, setShowUpdateBookDetails] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    // get book type
    const [bookTypes, setBookTypes] = useState([]);
    const [selectedBookType, setSelectedBookType] = useState('');
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

    const handleUpdate = (book) => {
        setSelectedBook(book);
        setShowUpdateBookDetails(true);
    };

    const updateBookDetails = async (e) => {
        e.preventDefault();
        try {
            if (!selectedBook) {
                throw new Error('No book selected');
            }
            const updatedBookDetails = {
                isbn: selectedBook.isbn,
                classificationNumber: selectedBook.classificationNumber,
                itemNumber: selectedBook.itemNumber,
                editor: selectedBook.editor,
                title: selectedBook.title,
                secondTitle: selectedBook.secondTitle,
                seriesTitle: selectedBook.seriesTitle,
                edition: selectedBook.edition,
                publicationYear: selectedBook.publicationYear,
                numberOfPages: selectedBook.numberOfPages,
                subjectHeading: selectedBook.subjectHeading,
                secondAuthorEditor: selectedBook.secondAuthorEditor,
                thirdAuthorEditor: selectedBook.thirdAuthorEditor,
                itemType: selectedBook.itemType,
                permanentLocation: selectedBook.permanentLocation,
                currentLocation: selectedBook.currentLocation,
                shelvingLocation: selectedBook.shelvingLocation,
                volumeNo: selectedBook.volumeNo,
                fullCallNumber: selectedBook.fullCallNumber,
                copyNo: selectedBook.purchaseCopyNo,
                typeofbook: selectedBookType,
                accessionNo: selectedBook.accessionNo,
                bookIssue: selectedBook.bookIssue,
                bookWorkingStart: selectedBook.bookWorkingStart,
                bookLostScrap: selectedBook.bookLostScrap,
            };
            // const response = await fetch(`${BaseURL}/api/purchase/update/book-details/${selectedBook.bookDetailId}`, {
            const response = await fetch(`${BaseURL}/api/bookdetails/update/book-details/${selectedBook.bookDetailId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBookDetails),
            });
            if (!response.ok) {
                throw new Error('Failed to update book details');
            }
            await response.json();
            toast.success('Book details updated successfully.');
            setShowUpdateBookDetails(false);
            fetchBookDetails();
        } catch (error) {
            console.error('Error updating book details:', error);
            toast.error('Error updating book details. Please try again later.');
        }
    };


    // another api call

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
        if (event && event.target) {
            const selectedType = event.target.value;
            setSelectedBookType(selectedType);
        }
    };


    useEffect(() => {
        fetchBookTypes();
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
                            <tr key={book.bookDetailId}>
                                <td>{index + 1}</td>
                                <td>{book.bookName}</td>
                                <td>{book.purchaseCopyNo}</td>
                                <td>{book.book_rate}</td>
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
                    <Modal.Body className='box'>
                        <Form onSubmit={updateBookDetails}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="isbn">
                                    <Form.Label>ISBN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.isbn || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, isbn: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="copyNo">
                                    <Form.Label>Purchase Copy No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.purchaseCopyNo || ''}
                                        readOnly
                                    // onChange={(e) => setSelectedBook({ ...selectedBook, copyNo: e.target.value })}
                                    // onChange={(e) => handleBookTypeChange(e)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="bookTYPE">
                                    <Form.Label>Book Type</Form.Label>
                                    <Form.Select
                                        as="select"
                                        name="bookTypeOption"
                                        value={selectedBookType}
                                        onChange={(e) => handleBookTypeChange(e)}
                                    >
                                        <option value="">Select Book Type</option>
                                        {bookTypes.map((bookType, index) => (
                                            <option key={index} value={bookType.bookTypeName}>
                                                {bookType.bookTypeName}
                                            </option>
                                        ))}
                                    </Form.Select>
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
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.title || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="secondTitle">
                                    <Form.Label>Second Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.secondTitle || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, secondTitle: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="seriesTitle">
                                    <Form.Label>Series Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.seriesTitle || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, seriesTitle: e.target.value })}
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
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="edition">
                                    <Form.Label>Edition</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.edition || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, edition: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>


                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="numberOfPages">
                                    <Form.Label>Number of Pages</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.numberOfPages || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, numberOfPages: e.target.value })}
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
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="permanentLocation">
                                    <Form.Label>Permanent Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.permanentLocation || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, permanentLocation: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
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
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="volumeNo">
                                    <Form.Label>Volume Number </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedBook?.volumeNo || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, volumeNo: e.target.value })}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editor">
                                    <Form.Label>Book Issue</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.bookIssue || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 1) {
                                                setSelectedBook({ ...selectedBook, bookIssue: e.target.value });
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editor">
                                    <Form.Label>Book Working Start</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.bookWorkingStart || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 1) {
                                                setSelectedBook({ ...selectedBook, bookWorkingStart: e.target.value });
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editor">
                                    <Form.Label>Book Lost Scrap</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.bookLostScrap || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 1) {
                                                setSelectedBook({ ...selectedBook, bookLostScrap: e.target.value });
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="fullCallNumber">
                                    <Form.Label>full Call Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.fullCallNumber || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, fullCallNumber: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="accessionNo">
                                    <Form.Label>Accession Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.accessionNo || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, accessionNo: e.target.value })}
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
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="itemType">
                                    <Form.Label>Item Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedBook?.itemType || ''}
                                        onChange={(e) => setSelectedBook({ ...selectedBook, itemType: e.target.value })}
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





