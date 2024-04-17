/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthProvider';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

const BookLanguages = () => {
    //get all book lang
    const [bookLanguages, setBookLanguages] = useState([]);

    const [isBlock, setIsBlock] = useState(false);

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
            // isBlock: isBlock
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
            isBlock: language.isBlock === 'true' // Convert string to boolean
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


    return (
        <Container>
            <div className=''>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddLanguage(true)} className="button-color">
                        Add Book language
                    </Button>
                </div>
                <div className='mt-3'>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>Language ID</th>
                            <th>Language</th>
                            <th>Is Blocked</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookLanguages.map((language) => (
                            <tr key={language.bookLangId}>
                                <td>{language.bookLangId}</td>
                                <td>{language.bookLangName}</td>
                                <td>{language.isBlock ? 'Yes' : 'No'}</td>
                                <td>
                                    <PencilSquare
                                        className="ms-3 action-icon edit-icon"
                                        onClick={() => handleShowEditModal(language)}
                                    />
                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => handleShowDeleteConfirmation(language.bookLangId)} />

                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
               </div>

                {/* add book insert type */}
                <Modal show={showAddLanguage} onHide={() => setShowAddLanguage(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Book Language</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addLanguage}>
                            <Form.Group className="mb-3" controlId="newLanguage">
                                <Form.Label>Book Language Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter book language name"
                                    value={addBookLangName}
                                    onChange={(e) => setAddBookLangName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/* <Form.Group className="mb-3" controlId="isBlocked">
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
                            <Button className='button-color' type="submit">
                                Submit
                            </Button>
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
                                <Form.Label>Book Language Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter book language name"
                                    value={editableLanguage.bookLangName}
                                    onChange={handleEditLanguageChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="isBlocked">
                                <Form.Label>Is Blocked</Form.Label>
                                <Form.Select
                                    value={editableLanguage.isBlock ? 'Yes' : 'No'} 
                                    onChange={(e) => setEditableLanguage({ ...editableLanguage, isBlock: e.target.value === 'Yes' })}
                                    required
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Select>
                            </Form.Group>
                            <Button type="submit" className="button-color">
                                Save Changes
                            </Button>
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

            </div>
        </Container>
    );
};

export default BookLanguages;
