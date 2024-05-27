/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';

const MembershipFees = () => {
    // get membership fee
    const [memberData, setMemberData] = useState([]);
    // get general member
    const [generalMember, setGeneralMember] = useState([]);
    // add
    const [showAddModal, setShowAddModal] = useState(false);
    // edit
    const [showEditModal, setShowEditModal] = useState(false);
    //delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    //view
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState({});


    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        selectedMemberId: "",
        feeType: "",
        bankName: "",
        chequeNo: "",
        chequeDate: "",
        monthlyDescription: "",
        bookDepositFees: "",
        entryFees: "",
        securityDepositFees: ""
    });

    const [editData, setEditData] = useState({
        membershipId: "",
        invoiceNo: "",
        invoiceDate: "",
        selectedMemberId: "",
        feeType: "",
        bankName: "",
        chequeNo: "",
        chequeDate: "",
        monthlyDescription: "",
        bookDepositFees: "",
        entryFees: "",
        securityDepositFees: ""
    });

    // auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchMemberData();
        fetchGeneralMembers();
    }, [username, accessToken]);

    // get member data
    const fetchMemberData = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/membership-fees`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching member data: ${response.statusText}`);
            }
            const data = await response.json();
            setMemberData(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching member data. Please try again later.');
        }
    };

    // get general - member name
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

    //add function
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //add /post api
    const handleAddSubmit = async () => {
        const payload = {
            memInvoiceNo: formData.invoiceNo,
            memInvoiceDate: formData.invoiceDate,
            memberIdF: formData.selectedMemberId,
            bookDepositFees: parseFloat(formData.bookDepositFees),
            entryFees: parseFloat(formData.entryFees),
            securityDepositFees: parseFloat(formData.securityDepositFees),
            feesType: formData.feeType === "Cash" ? "A" : "B",
            bankName: formData.bankName,
            chequeNo: formData.chequeNo,
            chequeDate: formData.chequeDate,
            membershipDescription: formData.monthlyDescription
        };

        try {
            const response = await fetch(`${BaseURL}/api/membership-fees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Error submitting member fees: ${response.statusText}`);
            }

            toast.success('Member fees added successfully!');
            setShowAddModal(false);
            fetchMemberData();
        } catch (error) {
            console.error(error);
            toast.error('Error submitting member fees. Please try again later.');
        }
    };


    //edit function
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditClick = (item) => {
        setEditData({
            membershipId: item.membershipId,
            invoiceNo: item.memInvoiceNo,
            invoiceDate: item.memInvoiceDate,
            selectedMemberId: item.memberIdF,
            feeType: item.feesType === "A" ? "Cash" : "Cheque",
            bankName: item.bankName,
            chequeNo: item.chequeNo,
            chequeDate: item.chequeDate,
            monthlyDescription: item.membershipDescription,
            bookDepositFees: item.bookDepositFees,
            entryFees: item.entryFees,
            securityDepositFees: item.securityDepositFees
        });
        setShowEditModal(true);
    };

    //edit api
    const handleEditSubmit = async () => {
        const payload = {
            memInvoiceNo: editData.invoiceNo,
            memInvoiceDate: editData.invoiceDate,
            memberIdF: editData.selectedMemberId,
            bookDepositFees: parseFloat(editData.bookDepositFees),
            entryFees: parseFloat(editData.entryFees),
            securityDepositFees: parseFloat(editData.securityDepositFees),
            feesType: editData.feeType === "Cash" ? "A" : "B",
            bankName: editData.bankName,
            chequeNo: editData.chequeNo,
            chequeDate: editData.chequeDate,
            membershipDescription: editData.monthlyDescription
        };

        try {
            const response = await fetch(`${BaseURL}/api/membership-fees/${editData.membershipId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Error updating member fees: ${response.statusText}`);
            }

            toast.success('Member fees updated successfully!');
            setShowEditModal(false);
            fetchMemberData();
        } catch (error) {
            console.error(error);
            toast.error('Error updating member fees. Please try again later.');
        }
    };


    //add total calculate
    const totalFees = parseFloat(formData.bookDepositFees || 0) + parseFloat(formData.entryFees || 0) + parseFloat(formData.securityDepositFees || 0);
    //edit total calculate
    const totalEditFees = parseFloat(editData.bookDepositFees || 0) + parseFloat(editData.entryFees || 0) + parseFloat(editData.securityDepositFees || 0);





    // delete function
    const handleDeleteClick = (membershipId) => {
        setDeleteId(membershipId);
        setShowDeleteModal(true);
    };

    //delete api
    const handleDelete = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/membership-fees/${deleteId.membershipId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error deleting member fees: ${response.statusText}`);
            }

            toast.success('Member fees deleted successfully!');
            setShowDeleteModal(false);
            fetchMemberData();
        } catch (error) {
            console.error(error);
            toast.error('Error deleting member fees. Please try again later.');
        }
    };


    //view
    const handleViewClick = (item) => {
        setViewData(item);
        setShowViewModal(true);
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div>
                    <div className='mt-3'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Member Fees
                        </Button>
                    </div>
                    <div className='table-responsive mt-3 table-height'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Invoice No</th>
                                    <th>Invoice Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberData.map((item, index) => (
                                    <tr key={item.membershipId}>
                                        <td>{index + 1}</td>
                                        <td>{item.memInvoiceNo}</td>
                                        <td>{item.memInvoiceDate}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(item)} />
                                            <Trash className="ms-3 action-icon view-icon" onClick={() => handleDeleteClick(item)} />
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(item)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            {/* add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} >
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Invoice number"
                                        type="text"
                                        name="invoiceNo"
                                        className="small-input"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="invoiceDate"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectedMemberId"
                                        className="small-input"
                                        value={formData.selectedMemberId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.memberId}>
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
                                            <th>Fees Type</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='sr-size'>1</td>
                                            <td>Book Deposit Fees</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="bookDepositFees"
                                                    value={formData.bookDepositFees}
                                                    onChange={handleInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>2</td>
                                            <td>Entry Fees</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="entryFees"
                                                    value={formData.entryFees}
                                                    onChange={handleInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>3</td>
                                            <td>Security Deposit</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="securityDepositFees"
                                                    value={formData.securityDepositFees}
                                                    onChange={handleInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td>{totalFees}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Fee Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="feeType"
                                        className="small-input"
                                        value={formData.feeType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Fees Type</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Cheque</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            {formData.feeType === "Cheque" && (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Col}>
                                            <Form.Label>Bank Name</Form.Label>
                                            <Form.Control
                                                name="bankName"
                                                type="text"
                                                value={formData.bankName}
                                                onChange={handleInputChange}
                                                required
                                                className="small-input"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Cheque No</Form.Label>
                                            <Form.Control
                                                name="chequeNo"
                                                type="text"
                                                value={formData.chequeNo}
                                                onChange={handleInputChange}
                                                required
                                                className="small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Cheque Date</Form.Label>
                                            <Form.Control
                                                name="chequeDate"
                                                type="date"
                                                value={formData.chequeDate}
                                                onChange={handleInputChange}
                                                required
                                                className="custom-date-picker small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                </>
                            )}

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="monthlyDescription"
                                        type="text"
                                        value={formData.monthlyDescription}
                                        onChange={handleInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddSubmit}>
                            Add
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* edit modal */}
            <Modal centered show={showEditModal} onHide={() => setShowEditModal(false)} >
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Invoice number"
                                        type="text"
                                        name="invoiceNo"
                                        className="small-input"
                                        value={editData.invoiceNo}
                                        onChange={handleEditInputChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="invoiceDate"
                                        value={editData.invoiceDate}
                                        onChange={handleEditInputChange}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="selectedMemberId"
                                        className="small-input"
                                        value={editData.selectedMemberId}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="">Select a member</option>
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={member.memberId}>
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
                                            <th>Fees Type</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='sr-size'>1</td>
                                            <td>Book Deposit Fees</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="bookDepositFees"
                                                    value={editData.bookDepositFees}
                                                    onChange={handleEditInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>2</td>
                                            <td>Entry Fees</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="entryFees"
                                                    value={editData.entryFees}
                                                    onChange={handleEditInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>3</td>
                                            <td>Security Deposit</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="securityDepositFees"
                                                    value={editData.securityDepositFees}
                                                    onChange={handleEditInputChange}
                                                    className="small-input"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td>{totalEditFees}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Fee Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="feeType"
                                        className="small-input"
                                        value={editData.feeType}
                                        onChange={handleEditInputChange}
                                        required
                                    >
                                        <option value="">Select Fees Type</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Cheque</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            {editData.feeType === "Cheque" && (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Col}>
                                            <Form.Label>Bank Name</Form.Label>
                                            <Form.Control
                                                name="bankName"
                                                type="text"
                                                value={editData.bankName}
                                                onChange={handleEditInputChange}
                                                required
                                                className="small-input"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Cheque No</Form.Label>
                                            <Form.Control
                                                name="chequeNo"
                                                type="text"
                                                value={editData.chequeNo}
                                                onChange={handleEditInputChange}
                                                required
                                                className="small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Cheque Date</Form.Label>
                                            <Form.Control
                                                name="chequeDate"
                                                type="date"
                                                value={editData.chequeDate}
                                                onChange={handleEditInputChange}
                                                required
                                                className="custom-date-picker small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                </>
                            )}

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="monthlyDescription"
                                        type="text"
                                        value={editData.monthlyDescription}
                                        onChange={handleEditInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleEditSubmit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* delete modal */}
            <Modal centered show={showDeleteModal} onHide={() => setShowDeleteModal(false)} >
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this membership fee?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            No
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Yes, Delete
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>


            {/* view modal */}
            <Modal centered show={showViewModal} onHide={() => setShowViewModal(false)} >
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        placeholder="Invoice number"
                                        type="text"
                                        value={viewData.memInvoiceNo}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={viewData.memInvoiceDate}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={generalMember.find(member => member.memberId === viewData.memberIdF)?.username || ""}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th>Fees Type</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='sr-size'>1</td>
                                            <td>Book Deposit Fees</td>
                                            <td>{viewData.bookDepositFees}</td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>2</td>
                                            <td>Entry Fees</td>
                                            <td>{viewData.entryFees}</td>
                                        </tr>
                                        <tr>
                                            <td className='sr-size'>3</td>
                                            <td>Security Deposit</td>
                                            <td>{viewData.securityDepositFees}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td>{parseFloat(viewData.bookDepositFees || 0) + parseFloat(viewData.entryFees || 0) + parseFloat(viewData.securityDepositFees || 0)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Fee Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewData.feesType === "A" ? "Cash" : "Cheque"}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            {viewData.feesType === "B" && (
                                <>
                                    <Row className="mb-3">
                                        <Form.Group as={Col}>
                                            <Form.Label>Bank Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={viewData.bankName}
                                                readOnly
                                                className="small-input"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Cheque No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={viewData.chequeNo}
                                                readOnly
                                                className="small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} lg={6}>
                                            <Form.Label>Cheque Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={viewData.chequeDate}
                                                readOnly
                                                className="custom-date-picker small-input"
                                            />
                                        </Form.Group>
                                    </Row>
                                </>
                            )}

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={viewData.membershipDescription}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>



        </div>
    );
};

export default MembershipFees;
