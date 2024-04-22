/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookTypes = () => {
    const [bookTypes, setBookTypes] = useState([]);
    const [newBookTypeName, setNewBookTypeName] = useState('');
    const [isBlock, setIsBlock] = useState(false);
    const [selectedBookTypeId, setSelectedBookTypeId] = useState(null);
    const [showAddBookTypeModal, setShowAddBookTypeModal] = useState(false);
    const [showEditBookTypeModal, setShowEditBookTypeModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

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

    useEffect(() => {
        fetchBookTypes();
    }, []);

    const addBookType = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-types`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookTypeName: newBookTypeName }),
            });
            if (!response.ok) {
                throw new Error(`Error adding book type: ${response.statusText}`);
            }
            const newBookType = await response.json();
            setBookTypes([...bookTypes, newBookType.data]);
            setShowAddBookTypeModal(false);
            setNewBookTypeName('');
            toast.success('Book type added successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error adding book type. Please try again later.');
        }
    };

    const editBookType = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-types/${selectedBookTypeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookTypeName: newBookTypeName, isBlock: isBlock.toString() }),
            });
            if (!response.ok) {
                throw new Error(`Error editing book type: ${response.statusText}`);
            }
            const updatedBookTypeData = await response.json();
            const updatedBookTypes = bookTypes.map(bookType => {
                if (bookType.id === selectedBookTypeId) {
                    return { ...bookType, bookTypeName: updatedBookTypeData.data.bookTypeName, isBlock: updatedBookTypeData.data.isBlock };
                }
                return bookType;
            });
            setBookTypes(updatedBookTypes);
            setShowEditBookTypeModal(false);
            setNewBookTypeName('');
            setIsBlock(false);
            toast.success('Book type edited successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error editing book type. Please try again later.');
        }
    };

    const deleteBookType = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-types/${selectedBookTypeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting book type: ${response.statusText}`);
            }
            setBookTypes(bookTypes.filter(bookType => bookType.id !== selectedBookTypeId));
            setShowDeleteConfirmation(false);
            toast.success('Book type deleted successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting book type. Please try again later.');
        }
    };

    return (
        <div className="main-content">

            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddBookTypeModal(true)} className="button-color">
                        Add Book Type
                    </Button>
                </div>
                <div className='mt-3'>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Book Type ID</th>
                                <th>Book Type Name</th>
                                <th>Is Blocked</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookTypes.map((bookType) => (
                                <tr key={bookType.id}>
                                    <td>{bookType.id}</td>
                                    <td>{bookType.bookTypeName}</td>
                                    <td>{bookType.isBlock === 'true' ? 'Yes' : 'No'}</td>

                                    <td>
                                        <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => {
                                            setSelectedBookTypeId(bookType.id);
                                            setNewBookTypeName(bookType.bookTypeName);
                                            setShowEditBookTypeModal(true);
                                            setIsBlock(bookType.isBlock === 'true');

                                        }} />

                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => {
                                            setSelectedBookTypeId(bookType.id);
                                            setShowDeleteConfirmation(true);
                                        }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>


                {/* Add Book Type Modal */}
                <Modal show={showAddBookTypeModal} onHide={() => setShowAddBookTypeModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Book Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addBookType}>
                            <Form.Group className="mb-3" controlId="newBookTypeName">
                                <Form.Label>Book Type Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter book type name"
                                    value={newBookTypeName}
                                    onChange={(e) => setNewBookTypeName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Edit Book Type Modal */}
                <Modal show={showEditBookTypeModal} onHide={() => setShowEditBookTypeModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Book Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editBookType}>
                            <Form.Group className="mb-3" controlId="editedBookTypeName">
                                <Form.Label>Book Type Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter edited book type name"
                                    value={newBookTypeName}
                                    onChange={(e) => setNewBookTypeName(e.target.value)}
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
                    <Modal.Body>Are you sure you want to delete this book type?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={deleteBookType}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>

    );
};

export default BookTypes;
