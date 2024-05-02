/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Pagination } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookAuthor = () => {
    //get
    const [bookAuthors, setBookAuthors] = useState([]);
    //add
    const [showAddBookAuthorModal, setShowAddBookAuthorModal] = useState(false);
    const [newBookAuthor, setNewBookAuthor] = useState({
        authorName: '',
        address: '',
        contactNo1: '',
        contactNo2: '',
        emailId: ''
    });
    //edit
    const [showEditBookAuthorModal, setShowEditBookAuthorModal] = useState(false);
    // delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    //edit and delete
    const [selectedBookAuthorId, setSelectedBookAuthorId] = useState(null);
    // View modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewAuthor, setViewAuthor] = useState(null);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    //get api
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
            toast.error('Error fetching book authors. Please try again later.');
        }
    };

    useEffect(() => {
        fetchBookAuthors();
    }, []);

    //reset field
    const resetFormFields = () => {
        setNewBookAuthor({
            authorName: '',
            address: '',
            contactNo1: '',
            contactNo2: '',
            emailId: ''
        });
    };
    //add or post api
    const addBookAuthor = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/book-authors`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBookAuthor),
            });
            if (!response.ok) {
                throw new Error(`Error adding book author: ${response.statusText}`);
            }
            const newAuthor = await response.json();
            setBookAuthors([...bookAuthors, newAuthor.data]);
            setShowAddBookAuthorModal(false);
            toast.success('Book author added successfully.');
            resetFormFields();
            fetchBookAuthors();
        } catch (error) {
            console.error(error);
            toast.error('Error adding book author. Please try again later.');
        }
    };

    //edit api
    const editBookAuthor = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/book-authors/${selectedBookAuthorId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBookAuthor),
            });
            if (!response.ok) {
                throw new Error(`Error editing book author: ${response.statusText}`);
            }
            const updatedAuthorData = await response.json();
            const updatedAuthors = bookAuthors.map(author => {
                if (author.id === selectedBookAuthorId) {
                    return updatedAuthorData.data;
                }
                return author;
            });
            setBookAuthors(updatedAuthors);
            setShowEditBookAuthorModal(false);
            setNewBookAuthor({
                authorName: '',
                address: '',
                contactNo1: '',
                contactNo2: '',
                emailId: ''
            });
            toast.success('Book author edited successfully.');
            fetchBookAuthors();

        } catch (error) {
            console.error(error);
            toast.error('Error editing book author. Please try again later.');
        }
    };

    //delete api
    const deleteBookAuthor = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/book-authors/${selectedBookAuthorId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting book author: ${response.statusText}`);
            }
            setBookAuthors(bookAuthors.filter(author => author.id !== selectedBookAuthorId));
            setShowDeleteConfirmation(false);
            toast.success('Book author deleted successfully.');
            fetchBookAuthors();

        } catch (error) {
            console.error(error);
            toast.error('Error deleting book author. Please try again later.');
        }
    };

    // View modal
    const handleShowViewModal = (author) => {
        setViewAuthor(author);
        setShowViewModal(true);
    };


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(bookAuthors.length / itemsPerPage);
    const handlePageClick = (page) => setCurrentPage(page);

    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
            {number}
        </Pagination.Item>
    ));

    const indexOfLastAuthor = currentPage * itemsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - itemsPerPage;
    const currentAuthors = bookAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);

    return (
        <div className="main-content">

            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddBookAuthorModal(true)} className="button-color">
                        Add Book Author
                    </Button>
                </div>
                <div className='mt-3'>
                    <div className="table-responsive">

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Author Name</th>
                                    <th>Address</th>
                                    <th>Contact No </th>
                                    <th>Email ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAuthors.map((author, index) => (
                                    <tr key={author.authorId}>
                                        <td>{indexOfFirstAuthor + index + 1}</td>
                                        <td>{author.authorName}</td>
                                        <td>{author.address}</td>
                                        <td>{author.contactNo1}</td>
                                        <td>{author.emailId}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => {
                                                setSelectedBookAuthorId(author.authorId);
                                                setNewBookAuthor({
                                                    authorName: author.authorName,
                                                    address: author.address,
                                                    contactNo1: author.contactNo1,
                                                    contactNo2: author.contactNo2,
                                                    emailId: author.emailId
                                                });
                                                setShowEditBookAuthorModal(true);
                                            }} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => {
                                                setSelectedBookAuthorId(author.authorId);
                                                setShowDeleteConfirmation(true);
                                            }} />
                                            <Eye className="ms-3 action-icon delete-icon" onClick={() => handleShowViewModal(author)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Pagination>{paginationItems}</Pagination>
                </div>


                {/* Add Book Author Modal */}
                <Modal show={showAddBookAuthorModal} onHide={() => setShowAddBookAuthorModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Book Author</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addBookAuthor}>
                            <Form.Group className="mb-3" controlId="addBookAuthor">
                                <Form.Label>Author Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter author name"
                                    value={newBookAuthor.authorName}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, authorName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookAuthorAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={newBookAuthor.address}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, address: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookAuthorContact1">
                                <Form.Label>Contact No 1</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 1"
                                    value={newBookAuthor.contactNo1}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookAuthor({ ...newBookAuthor, contactNo1: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookAuthorContact2">
                                <Form.Label>Contact No 2</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 2"
                                    value={newBookAuthor.contactNo2}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookAuthor({ ...newBookAuthor, contactNo2: value })
                                        }
                                    }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addBookAuthorEmail">
                                <Form.Label>Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email ID"
                                    value={newBookAuthor.emailId}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, emailId: e.target.value })}
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

                {/* Edit Book Author Modal */}
                <Modal show={showEditBookAuthorModal} onHide={() =>{ setShowEditBookAuthorModal(false); resetFormFields();}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Book Author</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editBookAuthor}>
                            <Form.Group className="mb-3" controlId="editBookAuthorName">
                                <Form.Label>Author Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter author name"
                                    value={newBookAuthor.authorName}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, authorName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookAuthorAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address"
                                    value={newBookAuthor.address}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, address: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editBookAuthorContact1">
                                <Form.Label>Contact No 1</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter contact number 1"
                                    value={newBookAuthor.contactNo1}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {

                                            setNewBookAuthor({ ...newBookAuthor, contactNo1: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editBookAuthorContact2">
                                <Form.Label>Contact No 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter contact number 1"
                                    value={newBookAuthor.contactNo2}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 10 && /^\d*$/.test(value)) {
                                            setNewBookAuthor({ ...newBookAuthor, contactNo2: value })
                                        }
                                    }}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editBookAuthoremailId">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={newBookAuthor.emailId}
                                    onChange={(e) => setNewBookAuthor({ ...newBookAuthor, emailId: e.target.value })}
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
                    <Modal.Body>Are you sure you want to delete this book author?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={deleteBookAuthor}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


                {/* View Author Modal */}
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Book Author</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group>
                                    <Form.Label>Author Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewAuthor ? viewAuthor.authorName : ''}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewAuthor ? viewAuthor.address : ''}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group >
                                    <Form.Label>Contact No 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewAuthor ? viewAuthor.contactNo1 : ''}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Contact No 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewAuthor ? viewAuthor.contactNo2 : ''}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group >
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewAuthor ? viewAuthor.emailId : ''}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </div>
    );
};

export default BookAuthor;


