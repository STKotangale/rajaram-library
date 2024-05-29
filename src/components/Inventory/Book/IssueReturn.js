/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';
import { Trash, Eye } from 'react-bootstrap-icons';

const IssueReturn = () => {
    const [issueReturn, setIssueReturn] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [selectedUsername, setSelectedUsername] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [rows, setRows] = useState([]);
    const [issueReturnNumber, setIssueReturnNumber] = useState('');
    const [issueReturnDate, setIssueReturnDate] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [issueReturnToDelete, setIssueReturnToDelete] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchIssueReturn();
        fetchGeneralMembers();
    }, [username, accessToken]);

    // Fetch issue returns and group by stock_id
    const fetchIssueReturn = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/issueReturns`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching issue return: ${response.statusText}`);
            }
            const data = await response.json();
            const groupedData = groupByStockId(data);
            setIssueReturn(groupedData);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching issue return. Please try again later.');
        }
    };

    // Group data by stock_id
    const groupByStockId = (data) => {
        return data.reduce((acc, item) => {
            if (!acc[item.stock_id]) {
                acc[item.stock_id] = [];
            }
            acc[item.stock_id].push(item);
            return acc;
        }, {});
    };

    // Fetch all general members
    const fetchGeneralMembers = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/general-members`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGeneralMember(data.data);
        } catch (error) {
            console.error("Failed to fetch general members:", error);
            toast.error('Failed to load general members. Please try again later.');
        }
    };

    // Handle member name select
    const handleMemberNameSelect = async (e) => {
        const username = e.target.value;
        setSelectedUsername(username);

        if (username) {
            try {
                const response = await fetch(`${BaseURL}/api/issue/detail/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error fetching issue details: ${response.statusText}`);
                }
                const data = await response.json();
                const bookRows = data.map(item => ({
                    bookId: item.bookId,
                    bookDetailId: item.bookDetailId,
                    bookName: item.bookName,
                    purchaseCopyNo: item.purchaseCopyNo
                }));
                setRows(bookRows);
            } catch (error) {
                console.error('Error fetching issue details:', error.message);
                toast.error('Error fetching issue details. Please try again later.');
            }
        } else {
            setRows([]);
        }
    };

   const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const resetFormFields = () => {
        setIssueReturnNumber('');
        setIssueReturnDate('');
        setSelectedUsername('');
        setRows([]);
        setSelectedRows([]);
    };

    const handleRowSelect = (row) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(row)
                ? prevSelectedRows.filter(r => r !== row)
                : [...prevSelectedRows, row]
        );
    };

    const handleDelete = (issueReturnId) => {
        setIssueReturnToDelete(issueReturnId);
        setShowDeleteModal(true);
    };

    // Post API
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedRows.length === 0) {
            toast.error('Please select at least one row to submit.');
            return;
        }

        const bookDetailsPayload = selectedRows.map(row => ({
            bookId: Number(row.bookId),
            bookDetailIds: Number(row.bookDetailId)
        }));

        const memberId = generalMember.find(member => member.username === selectedUsername)?.memberId;

        const payload = {
            issueNo: issueReturnNumber,
            issueReturnDate: formatDate(issueReturnDate),
            memberId,
            bookDetailsList: bookDetailsPayload
        };

        try {
            const response = await fetch(`${BaseURL}/api/issue/return/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const purchaseDetails = await response.json();
                toast.success(purchaseDetails.message);
                setShowAddModal(false);
                resetFormFields();
                fetchIssueReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Error submitting invoice. Please try again.');
        }
    };

    // Delete confirmation
    const confirmDelete = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/${issueReturnToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                toast.success('Issue return deleted successfully.');
                fetchIssueReturn();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting issue return:', error);
            toast.error('Error deleting issue return. Please try again.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    // Handle viewing detailed information
    const handleViewDetail = (detail) => {
        setSelectedDetail(detail);
        setShowDetailModal(true);
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Issue Return
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Issue Return No</th>
                                    <th>Issue Return Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(issueReturn).map(([stockId, items], index) => (
                                    <tr key={stockId}>
                                        <td>{index + 1}</td>
                                        <td>{items[0].username}</td>
                                        <td>{items[0].invoiceNo}</td>
                                        <td>{items[0].invoiceDate}</td>
                                        <td>
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewDetail(items)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDelete(stockId)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            {/* Add Modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue Return number"
                                        type="text"
                                        className="small-input"
                                        value={issueReturnNumber}
                                        onChange={(e) => setIssueReturnNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={issueReturnDate}
                                        onChange={(e) => setIssueReturnDate(e.target.value)}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="small-input"
                                        value={selectedUsername}
                                        onChange={handleMemberNameSelect}
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.username}>
                                                {member.username}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th>Book Name</th>
                                            <th>Purchase Copy No</th>
                                            <th>Select Issue Return</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index} className={selectedRows.includes(row) ? 'selected-row' : ''}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>{row.bookName}</td>
                                                <td>{row.purchaseCopyNo}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(row)}
                                                        onChange={() => handleRowSelect(row)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal centered show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this issue return?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* view Modal */}
            <Modal centered show={showDetailModal} onHide={() => setShowDetailModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Issue Return Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDetail && (
                        <>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="small-input"
                                        value={selectedDetail[0].invoiceNo}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedDetail[0].invoiceDate}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedDetail[0].username}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>

                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th>Book Name</th>
                                            <th>Purchase Copy No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDetail.map((detail, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>{detail.bookName}</td>
                                                <td>{detail.purchaseCopyNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IssueReturn;
