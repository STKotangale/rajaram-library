/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { Container, Table, Pagination, Modal, Button, Form, Col, Row } from 'react-bootstrap';

const BookLanguages = () => {
    //get all book lang
    const [bookLanguages, setBookLanguages] = useState([]);

    //add new book lang
    const [addBookLangName, setAddBookLangName] = useState('');
    const [showAddLanguage, setShowAddLanguage] = useState(false);

    //edit lang
    const [showEditModal, setShowEditModal] = useState(false);
    const [editableLanguage, setEditableLanguage] = useState({ id: null, bookLangName: '', isBlock: null });

    const BaseURL = process.env.REACT_APP_BASE_URL;

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    // Fetch book languages from the API
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

    useEffect(() => {
        fetchBookLanguages();
    }, []);


    const addLanguage = async (event) => {
        event.preventDefault();
        const payload = {
            bookLangName: addBookLangName,
        };
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-languages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Network response was not ok. Status: ${response.status}`);
            const data = await response.json();

            setBookLanguages([...bookLanguages, data.data]);
            setShowAddLanguage(false);
            setAddBookLangName('');
        } catch (error) {
            console.error('Error adding book language:', error.message);
        }
    };

    //edit lang
    const handleShowEditModal = (language) => {
        setEditableLanguage({
            id: language.bookLangId,
            bookLangName: language.bookLangName,
            isBlock: language.isBlock === 'true' 
        });
        setShowEditModal(true);
    };


    const handleEditLanguageChange = (e) => {
        setEditableLanguage({ ...editableLanguage, bookLangName: e.target.value });
    };


    const handleEditLanguageSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-languages/${editableLanguage.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookLangName: editableLanguage.bookLangName, isBlock: editableLanguage.isBlock.toString() })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedLanguage = await response.json();
            const updatedLanguages = bookLanguages.map(lang => lang.bookLangId === updatedLanguage.data.bookLangId ? updatedLanguage.data : lang);
            setBookLanguages(updatedLanguages);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating book language:', error);
        }
    };



    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };


    //delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedLanguageId, setSelectedLanguageId] = useState(null);

    const handleDeleteLanguage = async (languageId) => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-languages/${languageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setBookLanguages(bookLanguages.filter(language => language.bookLangId !== languageId));
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting book language:', error);
        }
    };

    const handleShowDeleteConfirmation = (languageId) => {
        setSelectedLanguageId(languageId);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setSelectedLanguageId(null);
    };


    //view modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewLanguage, setViewLanguage] = useState(null);

    const handleShowViewModal = (language) => {
        setViewLanguage(language);
        setShowViewModal(true);
    };

    //pagination

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(bookLanguages.length / itemsPerPage);
    const handlePageClick = (page) => setCurrentPage(page);

    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
            {number}
        </Pagination.Item>
    ));

    const indexOfLastPurchase = currentPage * itemsPerPage;
    const indexOfFirstPurchase = indexOfLastPurchase - itemsPerPage;
    const currentPurchases = bookLanguages.slice(indexOfFirstPurchase, indexOfLastPurchase);



    return (
        <div className="main-content">
            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddLanguage(true)} className="button-color">
                        Add Book language
                    </Button>
                </div>
                <div className='mt-3'>
                    <Table striped bordered hover className='mt-3'>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Language</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPurchases.map((language, index) => (
                                <tr key={language.bookLangId}>
                                    <td>{indexOfFirstPurchase + index + 1}</td>
                                    <td>{language.bookLangName}</td>
                                    <td>
                                        <PencilSquare
                                            className="ms-3 action-icon edit-icon"
                                            onClick={() => handleShowEditModal(language)}
                                        />
                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => handleShowDeleteConfirmation(language.bookLangId)} />
                                        <Eye className="ms-3 action-icon delete-icon" onClick={() => handleShowViewModal(language)} />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                    <Pagination>{paginationItems}</Pagination>

                </div>

                {/* add book insert type */}
                <Modal show={showAddLanguage} onHide={() => setShowAddLanguage(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Book Language</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addLanguage}>
                            <Form.Group className="mb-3" controlId="newLanguage">
                                <Form.Label>Book Language</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter book language"
                                    value={addBookLangName}
                                    onChange={(e) => setAddBookLangName(e.target.value)}
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


                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Book Language</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditLanguageSubmit}>
                            <Form.Group className="mb-3" controlId="editLanguage">
                                <Form.Label>Book Language</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter book language name"
                                    value={editableLanguage.bookLangName}
                                    onChange={handleEditLanguageChange}
                                    required
                                />
                            </Form.Group>
                            <div className='d-flex justify-content-end'>
                                <Button type="submit" className="button-color">
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>



                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this book language?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                            No
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteLanguage(selectedLanguageId)}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* view modal */}
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Book Language</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Language Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewLanguage ? viewLanguage.bookLangName : ''}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </div >

    );
};

export default BookLanguages;
