/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookNames = () => {
    const [books, setBooks] = useState([]);
    const [newBookName, setNewBookName] = useState('');
    const [isBlock, setIsBlock] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showEditBookModal, setShowEditBookModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

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
            setBooks(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching books. Please try again later.');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const addBook = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/book`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookName: newBookName }),
                // body: JSON.stringify({ bookName: newBookName, isBlock: isBlock.toString() }),

            });
            if (!response.ok) {
                throw new Error(`Error adding book: ${response.statusText}`);
            }
            const newBook = await response.json();
            setBooks([...books, newBook.data]);
            setShowAddBookModal(false);
            setNewBookName('');
            // setIsBlock(false);
            toast.success('Book added successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error adding book. Please try again later.');
        }
    };

    const editBook = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/book/${selectedBookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookName: newBookName, isBlock: isBlock.toString() }),
            });
            if (!response.ok) {
                throw new Error(`Error editing book: ${response.statusText}`);
            }
            const updatedBookData = await response.json();
            const updatedBooks = books.map(book => {
                if (book.bookId === selectedBookId) {
                    return { ...book, bookName: updatedBookData.data.bookName, isBlock: updatedBookData.data.isBlock };
                }
                return book;
            });
            setBooks(updatedBooks);
            setShowEditBookModal(false);
            setNewBookName('');
            setIsBlock(false);
            toast.success('Book edited successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error editing book. Please try again later.');
        }
    };

    const deleteBook = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book/${selectedBookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting book: ${response.statusText}`);
            }
            setBooks(books.filter(book => book.bookId !== selectedBookId));
            setShowDeleteConfirmation(false);
            toast.success('Book deleted successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting book. Please try again later.');
        }
    };

    return (
        <Container>
            <div className='mt-3'>
            <Button onClick={() => setShowAddBookModal(true)} className="button-color">
                Add Book Name
            </Button>
            </div>
            <div className='mt-3'>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Book Name</th>
                        <th>Is Blocked</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{book.bookName}</td>
                            <td>{book.isBlock === 'true' ? 'Yes' : 'No'}</td>
                            <td>
                                <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => {
                                    setSelectedBookId(book.bookId);
                                    setNewBookName(book.bookName);
                                    setIsBlock(book.isBlock === 'true');
                                    setShowEditBookModal(true);
                                }} />
                                <Trash className="ms-3 action-icon delete-icon" onClick={() => {
                                    setSelectedBookId(book.bookId);
                                    setShowDeleteConfirmation(true);
                                }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>


            {/* Add Book Modal */}
            <Modal show={showAddBookModal} onHide={() => setShowAddBookModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addBook}>
                        <Form.Group className="mb-3" controlId="newBookName">
                            <Form.Label>Book Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter book name"
                                value={newBookName}
                                onChange={(e) => setNewBookName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {/* <Form.Group className="mb-3" controlId="isBlock">
                            <Form.Label>Is Blocked</Form.Label>
                            <Form.Select
                                value={isBlock ? 'Yes' : 'No'}
                                onChange={(e) => setIsBlock(e.target.value === 'Yes')}
                                required
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Form.Group> */}
                        <div className='d-flex justify-content-end'>
                            <Button className='button-color' type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Book Modal */}
            <Modal show={showEditBookModal} onHide={() => setShowEditBookModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editBook}>
                        <Form.Group className="mb-3" controlId="editedBookName">
                            <Form.Label>Book Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter edited book name"
                                value={newBookName}
                                onChange={(e) => setNewBookName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editedBookIsBlocked">
                            <Form.Label>Is Blocked</Form.Label>
                            <Form.Select
                                value={isBlock ? 'Yes' : 'No'}
                                onChange={(e) => setIsBlock(e.target.value === 'Yes')}
                                required
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='button-color' type="submit">
                                Update
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteBook}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BookNames;
