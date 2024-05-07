/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookPublication = () => {
    //get
    const [bookPublication, setBookPublication] = useState([]);
    //add
    const [showAddBookPublicationModal, setShowAddBookPublicationModal] = useState(false);
    const [newBookPublication, setNewBookPublication] = useState({
        publicationName: '',
        address: '',
        contactPerson: '',
        contactNo1: '',
        contactNo2: '',
        emailId: ''
    });
    //edit
    const [showEditBookPublicationModal, setShowEditBookPublicationModal] = useState(false);
    //delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    //edit and delete
    const [selectedBookPublicationId, setSelectedBookPublicationId] = useState(null);
    //view
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewPublication, setViewPublication] = useState(null);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

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

    useEffect(() => {
        fetchBookPublication();
    }, []);

    //reset fields
    const resetFormFields = () => {
        setNewBookPublication({
            publicationName: '',
            address: '',
            contactPerson: '',
            contactNo1: '',
            contactNo2: '',
            emailId: ''
        });
    };

    //add / post api
    const addBookPublication = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/book-publications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBookPublication),
            });
            if (!response.ok) {
                throw new Error(`Error adding book publication: ${response.statusText}`);
            }
            const newPublication = await response.json();
            setBookPublication([...bookPublication, newPublication.data]);
            setShowAddBookPublicationModal(false);
            toast.success('Book publication added successfully.');
            resetFormFields();
            fetchBookPublication();

        } catch (error) {
            console.error(error);
            toast.error('Error adding book publication. Please try again later.');
        }
    };

    //edit api
    const editBookPublication = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/book-publications/${selectedBookPublicationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBookPublication),
            });
            if (!response.ok) {
                throw new Error(`Error editing book publication: ${response.statusText}`);
            }
            const updatedPublicationData = await response.json();
            const updatedPublication = bookPublication.map(publication => {
                if (publication.id === selectedBookPublicationId) {
                    return updatedPublicationData.data;
                }
                return publication;
            });
            setBookPublication(updatedPublication);
            setShowEditBookPublicationModal(false);
            toast.success('Book publication edited successfully.');
            fetchBookPublication();
        } catch (error) {
            console.error(error);
            toast.error('Error editing book publication. Please try again later.');
        }
    };

    //delete api
    const deleteBookPublication = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book-publications/${selectedBookPublicationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting book publication: ${response.statusText}`);
            }
            setBookPublication(bookPublication.filter(publication => publication.id !== selectedBookPublicationId));
            setShowDeleteConfirmation(false);
            toast.success('Book publication deleted successfully.');
            fetchBookPublication();

        } catch (error) {
            console.error(error);
            toast.error('Error deleting book publication. Please try again later.');
        }
    };

    // View modal
    const handleShowViewModal = (publication) => {
        setViewPublication(publication);
        setShowViewModal(true);
    };




    return (
        <div className="main-content">

            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddBookPublicationModal(true)} className="button-color">
                        Add Book Publication
                    </Button>
                </div>
                <div className='mt-3'>
                    <div className="table-responsive">

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Publication Name</th>
                                    <th>Address</th>
                                    <th>Contact No</th>
                                    <th>Email ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookPublication.map((publication, index) => (
                                    <tr key={publication.publicationId}>
                                        <td>{index + 1}</td>
                                        <td>{publication.publicationName}</td>
                                        <td>{publication.address}</td>
                                        <td>{publication.contactNo1}</td>
                                        <td>{publication.emailId}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => {
                                                setSelectedBookPublicationId(publication.publicationId);
                                                setNewBookPublication({
                                                    publicationName: publication.publicationName,
                                                    address: publication.address,
                                                    contactNo1: publication.contactNo1,
                                                    contactNo2: publication.contactNo2,
                                                    emailId: publication.emailId
                                                });
                                                setShowEditBookPublicationModal(true);
                                            }} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => {
                                                setSelectedBookPublicationId(publication.publicationId);
                                                setShowDeleteConfirmation(true);
                                            }} />
                                            <Eye className="ms-3 action-icon delete-icon" onClick={() => handleShowViewModal(publication)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>


                {/* Add Book Publication Modal */}
                <Modal show={showAddBookPublicationModal} onHide={() => setShowAddBookPublicationModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Book Publication</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addBookPublication}>
                            <Form.Group className="mb-3" controlId="addBookPublication">
                                <Form.Label>Publication Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter publication name"
                                    value={newBookPublication.publicationName}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, publicationName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookPublicationContactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Contact person"
                                    value={newBookPublication.contactPerson}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, contactPerson: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookPublicationAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={newBookPublication.address}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, address: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookPublicationContact1">
                                <Form.Label>Contact No 1</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 1"
                                    value={newBookPublication.contactNo1}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookPublication({ ...newBookPublication, contactNo1: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookPublicationContact2">
                                <Form.Label>Contact No 2</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 2"
                                    value={newBookPublication.contactNo2}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookPublication({ ...newBookPublication, contactNo2: value })
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookPublicationEmail">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email ID"
                                    value={newBookPublication.emailId}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, emailId: e.target.value })}
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

                {/* Edit Book Publication Modal */}
                <Modal show={showEditBookPublicationModal} onHide={() => { setShowEditBookPublicationModal(false); resetFormFields() }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Book Publication</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editBookPublication}>
                            <Form.Group className="mb-3" controlId="editBookPublicationName">
                                <Form.Label>Publication Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter publication name"
                                    value={newBookPublication.publicationName}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, publicationName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookPublicationAddress">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Contact person"
                                    value={newBookPublication.contactPerson}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, contactPerson: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookPublicationAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={newBookPublication.address}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, address: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookPublicationContact1">
                                <Form.Label>Contact No 1</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 1"
                                    value={newBookPublication.contactNo1}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookPublication({ ...newBookPublication, contactNo1: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookPublicationContact2">
                                <Form.Label>Contact No 2</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 1"
                                    value={newBookPublication.contactNo2}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookPublication({ ...newBookPublication, contactNo2: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookPublicationemailId">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={newBookPublication.emailId}
                                    onChange={(e) => setNewBookPublication({ ...newBookPublication, emailId: e.target.value })}
                                    required
                                />
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
                    <Modal.Body>Are you sure you want to delete this book publication?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={deleteBookPublication}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


                {/* View Publication Modal */}
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Book Publication</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className='mt-2'>
                                <Form.Label>Publication Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.publicationName : ''}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className='mt-2'>
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.contactPerson : ''}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className='mt-2' >
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.address : ''}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className='mt-2' >
                                <Form.Label>Contact No 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.contactNo1 : ''}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className='mt-2' >
                                <Form.Label>Contact No 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.contactNo2 : ''}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group className='mt-2' >
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={viewPublication ? viewPublication.emailId : ''}
                                    readOnly
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </div>
    );
};

export default BookPublication;
