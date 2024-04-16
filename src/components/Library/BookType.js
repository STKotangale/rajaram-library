/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { PencilSquare, Trash, PlusSquare } from 'react-bootstrap-icons';

const BookTypes = () => {
    const [bookTypes, setBookTypes] = useState([]);
    // const [bookTypes, setBookTypes] = useState([
    //     {
    //         id: 0,
    //         bookTypeName: 'Static Book Type',
    //         isBlock: true
    //     }
    // ]);

    // const [bookType, setBookType] = useState({
    //   bookType:'',
    //   isBlock:'',
    // });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editableBookType, setEditableBookType] = useState({ id: null, bookTypeName: '', isBlock: false });

    const [newBookType, setNewBookType] = useState('');
    const [showAddBookType, setShowAddBookType] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [bookTypeToDelete, setBookTypeToDelete] = useState(null);


    const BaseURL = process.env.REACT_APP_BASE_URL;

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    const fetchBookTypes = async () => {
       
        try {
            const response = await fetch(`${BaseURL}/api/book-types`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            if (!response.ok) {
                // const message = `An error has occurred: ${response.status}`;
                // throw new Error(message);
            }
            const data = await response.json();
            console.log("data:",data);
            setBookTypes(data.data);
        } catch (error) {
            console.error('Error fetching book types:', error);
        }
    };
    

    const addBookType = async (bookTypeName, isBlock = '0') => {
        try {
            const response = await fetch(`${BaseURL}/api/book-types`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookTypeName, isBlock }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newBookType = await response.json();
            setBookTypes([...bookTypes, newBookType]);
        } catch (error) {
            console.error('Error adding book type: ' + error.message);
        }
    };

    const handleEditBookType = async (id, bookTypeName, isBlock) => {
        try {
            const response = await fetch(`${BaseURL}/api/book-types/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookTypeName, isBlock }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            fetchBookTypes(); // Refresh list after update
        } catch (error) {
            console.error('Error updating book type: ' + error.message);
        }
    };

    const handleDeleteBookType = async () => {
        if (bookTypeToDelete) {
            try {
                const response = await fetch(`${BaseURL}/api/book-types/${bookTypeToDelete.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                if (!response.ok) throw new Error('Network response was not ok');
                setBookTypes(bookTypes.filter(type => type.id !== bookTypeToDelete.id));
                setShowDeleteConfirmation(false);  // Close the confirmation dialog
                setBookTypeToDelete(null);  // Reset the book type to delete
            } catch (error) {
                console.error('Error deleting book type:', error);
            }
        }
    };

    useEffect(() => {
        fetchBookTypes();
    }, []); 


    //edit fuction
    const handleShowEditModal = (bookType) => {
        setEditableBookType(bookType);
        setShowEditModal(true);
    };

    //delete function
    const handleShowDeleteConfirmation = (bookType) => {
        setBookTypeToDelete(bookType);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setBookTypeToDelete(null);  // Reset the book type to delete
    };

    return (
        <Container>
            <div className='mt-5'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Book Type Name</th>
                            <th>Is Blocked</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookTypes.map((type) => (
                            <tr key={type.id}>
                                <td>{type.id}</td>
                                <td>{type.bookTypeName}</td>
                                <td>{type.isBlock ? 'Yes' : 'No'}</td>
                                <td>
                                    <PlusSquare className="ms-3 action-icon view-icon" onClick={() => setShowAddBookType(true)} />
                                    <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleShowEditModal(type)} />
                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => handleShowDeleteConfirmation(type)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* add book insert type */}
            <Modal show={showAddBookType} onHide={() => setShowAddBookType(false)}>
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
                                value={newBookType}
                                onChange={(e) => setNewBookType(e.target.value)}
                                required
                            />
                            <Form.Group className="mb-3" controlId="editIsBlocked">
                                <Form.Label>Is Blocked</Form.Label>
                                <Form.Select
                                    value={newBookType}
                                    onChange={(e) => setNewBookType(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Form.Group>
                        <div className='d-flex justify-content-end '>
                            <Button className='button-color' type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* edit update book type */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Book Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditBookType}>
                        <Form.Group className="mb-3" controlId="editBookTypeName">
                            <Form.Label>Book Type Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter book type name"
                                value={editableBookType.bookTypeName}
                                onChange={(e) => setEditableBookType({ ...editableBookType, bookTypeName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editIsBlocked">
                            <Form.Label>Is Blocked</Form.Label>
                            <Form.Select
                                value={editableBookType.isBlock ? 'Yes' : 'No'}
                                onChange={(e) => setEditableBookType({ ...editableBookType, isBlock: e.target.value === 'Yes' })}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Form.Group>
                        <div className='d-flex justify-content-end'>
                            <Button className='button-color' type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this book type?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBookType}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default BookTypes;

