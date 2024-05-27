/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';

const MonthlyMembershipFee = () => {
    //get all data
    const [monthlyMembershipData, setMonthlyMembershipData] = useState([]);
    //get general member
    const [generalMember, setGeneralMember] = useState([]);
    //get monthly fee
    const [monthlyFee, setMonthlyFee] = useState(0);
    //add
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [totalDays, setTotalDays] = useState(0);
    const [totalFee, setTotalFee] = useState(0);
    //delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //view
    const [showViewModal, setShowViewModal] = useState(false);
    //edit /delete
    const [selectedIssueId, setSelectedIssueId] = useState(null);


    // Single state object to manage form data
    const [formData, setFormData] = useState({
        invoiceNo: "",
        invoiceDate: "",
        fromDate: "",
        toDate: "",
        selectedMemberId: "",
        feeType: "",
        bankName: "",
        chequeNo: "",
        chequeDate: "",
        monthlyDescription: ""
    });

    // Auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchMonthlyData();
        fetchGeneralMembers();
        fetchMonthlyFee();
    }, [username, accessToken]);


    // Fetch monthly membership data
    const fetchMonthlyData = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/monthly-member-fees`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching monthly membership fees: ${response.statusText}`);
            }
            const data = await response.json();
            setMonthlyMembershipData(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching monthly membership fees. Please try again later.');
        }
    };

    // Fetch general members
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

    // Fetch monthly fee
    const fetchMonthlyFee = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/fees`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const monthlyFeeData = data.find(fee => fee.feesName === "Monthly Fees");
            setMonthlyFee(monthlyFeeData.feesAmount);
        } catch (error) {
            console.error("Failed to fetch monthly fee:", error);
            toast.error('Failed to load monthly fee. Please try again later.');
        }
    };


    // add function

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "fromDate" || name === "toDate") {
            calculateTotalDaysAndFee(name === "fromDate" ? value : formData.fromDate, name === "toDate" ? value : formData.toDate);
        }
    };

    const calculateTotalDaysAndFee = (fromDate, toDate) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        if (!isNaN(from) && !isNaN(to) && from <= to) {
            const timeDiff = Math.abs(to - from);
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setTotalDays(daysDiff);
            setTotalFee(daysDiff * (monthlyFee / 30));
        } else {
            setTotalDays(0);
            setTotalFee(0);
        }
    };

    const resetField = () => {
        setFormData({
            invoiceNo: "",
            invoiceDate: "",
            fromDate: "",
            toDate: "",
            selectedMemberId: "",
            feeType: "",
            bankName: "",
            chequeNo: "",
            chequeDate: "",
            monthlyDescription: "",
        });
        setTotalDays(0);
        setTotalFee(0);
    };

    // post api 
    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const feeTypePayload = formData.feeType === "Cash" ? "a" : "b";

        const payload = {
            memMonInvoiceNo: formData.invoiceNo,
            memMonInvoiceDate: formData.invoiceDate,
            memberIdF: parseInt(formData.selectedMemberId),
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            totalDays: totalDays,
            totalMonths: totalDays / 30,
            feesAmount: totalFee,
            feesType: feeTypePayload,
            bankName: formData.bankName || "",
            chequeNo: formData.chequeNo || "",
            chequeDate: formData.chequeDate || "",
            monthlyDescription: formData.monthlyDescription
        };

        try {
            const response = await fetch(`${BaseURL}/api/monthly-member-fees`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Monthly membership fee added successfully!');
            setShowAddModal(false);
            resetField();
            fetchMonthlyData();
        } catch (error) {
            console.error('Failed to add monthly membership fee:', error);
            toast.error('Failed to add monthly membership fee. Please try again later.');
        }
    };

    //edit api
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const feeTypePayload = formData.feeType === "Cash" ? "a" : "b";

        const payload = {
            memMonInvoiceNo: formData.invoiceNo,
            memMonInvoiceDate: formData.invoiceDate,
            memberIdF: parseInt(formData.selectedMemberId),
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            totalDays: totalDays,
            totalMonths: totalDays / 30,
            feesAmount: totalFee,
            feesType: feeTypePayload,
            bankName: formData.bankName || "",
            chequeNo: formData.chequeNo || "",
            chequeDate: formData.chequeDate || "",
            monthlyDescription: formData.monthlyDescription
        };

        try {
            const response = await fetch(`${BaseURL}/api/monthly-member-fees/${selectedIssueId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Monthly membership fee updated successfully!');
            setShowEditModal(false);
            resetField();
            fetchMonthlyData();
        } catch (error) {
            console.error('Failed to update monthly membership fee:', error);
            toast.error('Failed to update monthly membership fee. Please try again later.');
        }
    };

    // Handle edit icon click
    const handleEditClick = (issueItem) => {
        setSelectedIssueId(issueItem.memberMonthlyId); // Set selected ID
        setShowEditModal(true);
        // Set formData with selected issueItem data for editing
        setFormData({
            invoiceNo: issueItem.memMonInvoiceNo,
            invoiceDate: issueItem.memMonInvoiceDate,
            fromDate: issueItem.fromDate,
            toDate: issueItem.toDate,
            selectedMemberId: issueItem.memberIdF.toString(),
            feeType: issueItem.feesType === "a" ? "Cash" : "Cheque",
            bankName: issueItem.bankName,
            chequeNo: issueItem.chequeNo,
            chequeDate: issueItem.chequeDate,
            monthlyDescription: issueItem.monthlyDescription
        });
        calculateTotalDaysAndFee(issueItem.fromDate, issueItem.toDate);
    };



    // Handle delete icon click
    const handleDeleteClick = (memberMonthlyId) => {
        setSelectedIssueId(memberMonthlyId);
        setShowDeleteModal(true);
    };

    // Function to confirm deletion and call API
    const confirmDelete = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/monthly-member-fees/${selectedIssueId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            toast.success('Monthly membership fee deleted successfully!');
            setShowDeleteModal(false);
            fetchMonthlyData();
        } catch (error) {
            console.error('Failed to delete monthly membership fee:', error);
            toast.error('Failed to delete monthly membership fee. Please try again later.');
        }
    };





    // Handle view icon click
    const handleViewClick = (issueItem) => {
        setFormData({
            invoiceNo: issueItem.memMonInvoiceNo,
            invoiceDate: issueItem.memMonInvoiceDate,
            fromDate: issueItem.fromDate,
            toDate: issueItem.toDate,
            selectedMemberId: issueItem.memberIdF.toString(),
            feeType: issueItem.feesType === "a" ? "Cash" : "Cheque",
            bankName: issueItem.bankName,
            chequeNo: issueItem.chequeNo,
            chequeDate: issueItem.chequeDate,
            monthlyDescription: issueItem.monthlyDescription
        });

        // Calculate totalDays and totalFee based on fromDate and toDate
        calculateTotalDaysAndFee(issueItem.fromDate, issueItem.toDate);

        setShowViewModal(true);
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Monthly Membership Fees
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Issue No</th>
                                    <th>Issue Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyMembershipData.map((issueItem, index) => (
                                    <tr key={issueItem.memberMonthlyId}>
                                        <td>{index + 1}</td>
                                        <td>{issueItem.memMonInvoiceNo}</td>
                                        <td>{issueItem.memMonInvoiceDate}</td>
                                        <td>
                                            <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(issueItem)}>Edit</PencilSquare>
                                            <Trash className="ms-3 action-icon edit-icon" onClick={() => handleDeleteClick(issueItem.memberMonthlyId)} />
                                            <Eye className="ms-3 action-icon edit-icon" onClick={() => handleViewClick(issueItem)}>View</Eye>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>

            {/* Add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Monthly Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        placeholder="Invoice number"
                                        type="text"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={formData.fromDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={formData.toDate}
                                        onChange={handleInputChange}
                                        required
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
                                        required
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
                                <div>
                                    <h4>Fee Details</h4>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Detail</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monthly Fees</td>
                                            <td>{monthlyFee}</td>
                                        </tr>
                                        <tr>
                                            <td>Day/Month</td>
                                            <td>{totalDays}</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>{totalFee.toFixed(2)}</td>
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

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Add
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>


            {/* Edit modal */}
            <Modal centered show={showEditModal} onHide={() => { setShowEditModal(false); resetField() }} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Monthly Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        placeholder="Invoice number"
                                        type="text"
                                        value={formData.invoiceNo}
                                        onChange={handleInputChange}
                                        required
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={formData.fromDate}
                                        onChange={handleInputChange}
                                        required
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={formData.toDate}
                                        onChange={handleInputChange}
                                        required
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
                                        required
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
                                <div>
                                    <h4>Fee Details</h4>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Detail</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monthly Fees</td>
                                            <td>{monthlyFee}</td>
                                        </tr>
                                        <tr>
                                            <td>Day/Month</td>
                                            <td>{totalDays}</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>{totalFee.toFixed(2)}</td>
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

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>


            {/* delete modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Monthly Membership Fee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this monthly membership fee?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* View modal */}
            <Modal centered show={showViewModal} onHide={() => { setShowViewModal(false); resetField() }} size='lg'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Monthly Membership Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        name="invoiceNo"
                                        type="text"
                                        value={formData.invoiceNo}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        name="invoiceDate"
                                        type="date"
                                        value={formData.invoiceDate}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        name="fromDate"
                                        type="date"
                                        value={formData.fromDate}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        name="toDate"
                                        type="date"
                                        value={formData.toDate}
                                        readOnly
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
                                        readOnly
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
                                <div>
                                    <h4>Fee Details</h4>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Detail</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monthly Fees</td>
                                            <td>{monthlyFee}</td>
                                        </tr>
                                        <tr>
                                            <td>Day/Month</td>
                                            <td>{totalDays}</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>{totalFee.toFixed(2)}</td>
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
                                        readOnly
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
                                                readOnly
                                                className="small-input"
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Cheque No</Form.Label>
                                            <Form.Control
                                                name="chequeNo"
                                                type="text"
                                                value={formData.chequeNo}
                                                readOnly
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
                                        name="monthlyDescription"
                                        type="text"
                                        value={formData.monthlyDescription}
                                        readOnly
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>



        </div>
    );
};

export default MonthlyMembershipFee;
