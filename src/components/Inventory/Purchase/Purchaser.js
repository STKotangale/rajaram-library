/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col, Pagination } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Purchaser = () => {
    const [ledger, setLedger] = useState([]);
    const [newLedgerName, setNewLedgerName] = useState('');
    const [selectedLedgerId, setSelectedLedgerId] = useState(null);
    const [showAddLedgerModal, setShowAddLedgerModal] = useState(false);
    const [showEditLedgerModal, setShowEditLedgerModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const fetchLedger = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/ledger`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching ledger: ${response.statusText}`);
            }
            const data = await response.json();
            setLedger(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching ledger. Please try again later.');
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const addLedger = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/ledger`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ledgerName: newLedgerName }),

            });
            if (!response.ok) {
                throw new Error(`Error adding ledger: ${response.statusText}`);
            }
            const newLedger = await response.json();
            setLedger([...ledger, newLedger.data]);
            setShowAddLedgerModal(false);
            setNewLedgerName('');
            toast.success('Ledger added successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error adding ledger. Please try again later.');
        }
    };

    const editLedger = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/ledger/${selectedLedgerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ledgerName: newLedgerName}),
            });
            if (!response.ok) {
                throw new Error(`Error editing ledger: ${response.statusText}`);
            }
            const updatedLedgerData = await response.json();
            const updatedLedger = ledger.map(item => {
                if (item.ledgerID === selectedLedgerId) {
                    return { ...item, ledgerName: updatedLedgerData.data.ledgerName };
                }
                return item;
            });
            setLedger(updatedLedger);
            setShowEditLedgerModal(false);
            setNewLedgerName('');
            toast.success('Ledger edited successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error editing ledger. Please try again later.');
        }
    };

    const deleteLedger = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/ledger/${selectedLedgerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting ledger: ${response.statusText}`);
            }
            setLedger(ledger.filter(item => item.ledgerID !== selectedLedgerId));
            setShowDeleteConfirmation(false);
            toast.success('Ledger deleted successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting ledger. Please try again later.');
        }
    };

    // View modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewLedger, setViewLedger] = useState(null);

    const handleShowViewModal = (ledger) => {
        setViewLedger(ledger);
        setShowViewModal(true);
    };


    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(ledger.length / itemsPerPage);
    const handlePageClick = (page) => setCurrentPage(page);

    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
            {number}
        </Pagination.Item>
    ));

    const indexOfLastLedger = currentPage * itemsPerPage;
    const indexOfFirstLedger = indexOfLastLedger - itemsPerPage;
    const currentLedgers = ledger.slice(indexOfFirstLedger, indexOfLastLedger);

    return (
        <div className="main-content">

            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddLedgerModal(true)} className="button-color">
                        Add Purchaser
                    </Button>
                </div>
                <div className='mt-3'>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Purchaser</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLedgers.map((ledger, index) => (
                                <tr key={ledger.ledgerID}>
                                    <td>{indexOfFirstLedger + index + 1}</td>
                                    <td>{ledger.ledgerName}</td>
                                    <td>
                                        <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => {
                                            setSelectedLedgerId(ledger.ledgerID);
                                            setNewLedgerName(ledger.ledgerName);
                                            setShowEditLedgerModal(true);
                                        }} />
                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => {
                                            setSelectedLedgerId(ledger.ledgerID);
                                            setShowDeleteConfirmation(true);
                                        }} />
                                        <Eye className="ms-3 action-icon delete-icon" onClick={() => handleShowViewModal(ledger)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>{paginationItems}</Pagination>
                </div>


                {/* Add Purchaser Modal */}
                <Modal show={showAddLedgerModal} onHide={() => setShowAddLedgerModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Purchaser</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addLedger}>
                            <Form.Group className="mb-3" controlId="newLedgerName">
                                <Form.Label>Purchaser Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter purchaser name"
                                    value={newLedgerName}
                                    onChange={(e) => setNewLedgerName(e.target.value)}
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

                {/* Edit Purchaser Modal */}
                <Modal show={showEditLedgerModal} onHide={() => setShowEditLedgerModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Purchaser</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editLedger}>
                            <Form.Group className="mb-3" controlId="editedLedgerName">
                                <Form.Label>Ledger Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter edited purchaser name"
                                    value={newLedgerName}
                                    onChange={(e) => setNewLedgerName(e.target.value)}
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
                    <Modal.Body>Are you sure you want to delete this purchaser?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={deleteLedger}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


                {/* View Ledger Modal */}
                <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Purchaser</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Purchaser Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewLedger ? viewLedger.ledgerName : ''}
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

export default Purchaser;
