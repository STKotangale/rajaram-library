/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthCSS/PermanentGeneralMember.css';

const PermanentMember = () => {
    //get
    const [permanentMember, setPermanentMember] = useState([]);
    //add
    const [showAddPermanentMemberModal, setShowAddPermanentMemberModal] = useState(false);
    const [newPermanentMember, setNewPermanentMember] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        registerDate: '',
        adharCard: '',
        memberAddress: '',
        dateOfBirth: '',
        memberEducation: '',
        memberOccupation: '',
        mobileNo: '',
        emailId: '',
        confirmDate: '',
        libParMembNo: '',
    });
    //edit function
    const [showEditPermanentMemberModal, setShowEditPermanentMemberModal] = useState(false);
    const [editPermanentMemberData, setEditPermanentMemberData] = useState({});
    //delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedPermanentMemberId, setSelectedPermanentMemberId] = useState(null);
    //view 
    const [showViewPermanentMemberModal, setShowViewPermanentMemberModal] = useState(false);
    const [viewPermanentMemberData, setViewPermanentMemberData] = useState(null);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    //get api
    const fetchPermanentMembers = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/permanent-members`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("emailId", data)
            setPermanentMember(data.data);
        } catch (error) {
            console.error("Failed to fetch permanent members:", error);
            toast.error('Failed to load permanent members. Please try again later.');
        }
    };

    useEffect(() => {
        fetchPermanentMembers();
    }, []);

    // Reset form fields
    const resetFormFields = () => {
        // Reset form fields
        setNewPermanentMember({
            firstName: '',
            middleName: '',
            lastName: '',
            registerDate: '',
            adharCard: '',
            memberAddress: '',
            dateOfBirth: '',
            memberEducation: '',
            memberOccupation: '',
            mobileNo: '',
            emailId: '',
            confirmDate: '',
            libParMembNo: '',
        });
    };

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const parseDate = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    //add api
    const addPermanentMember = async (e) => {
        e.preventDefault();
        try {
            const mobileNo = parseInt(newPermanentMember.mobileNo);

            const payload = {
                ...newPermanentMember,
                mobileNo,
                registerDate: formatDate(newPermanentMember.registerDate),
                dateOfBirth: formatDate(newPermanentMember.dateOfBirth),
                confirmDate: formatDate(newPermanentMember.confirmDate)
            };

            const response = await fetch(`${BaseURL}/api/permanent-members`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Error adding permanent member: ${response.statusText}`);
            }
            const data = await response.json();
            setPermanentMember([...permanentMember, data.data]);
            toast.success('Permanent member added successfully.');
            setShowAddPermanentMemberModal(false);
            resetFormFields();
        } catch (error) {
            console.error(error);
            toast.error('Error adding permanent member. Please try again later.');
        }
    };

    const handleEditOpenPermanentMember = (member) => {
        const formattedData = {
            ...member,
            registerDate: formatDate(member.registerDate),
            dateOfBirth: formatDate(member.dateOfBirth),
            confirmDate: formatDate(member.confirmDate)
        };
        setEditPermanentMemberData(formattedData);
        setShowEditPermanentMemberModal(true);
    };

    const editPermanentMember = async (e) => {
        e.preventDefault();
        try {
            if (!editPermanentMemberData || !editPermanentMemberData.memberId) {
                throw new Error('No memberId provided for editing.');
            }
            const { memberId, ...requestData } = editPermanentMemberData;

            const payload = {
                ...requestData,
                registerDate: parseDate(requestData.registerDate),
                dateOfBirth: parseDate(requestData.dateOfBirth),
                confirmDate: parseDate(requestData.confirmDate)
            };

            const response = await fetch(`${BaseURL}/api/permanent-members/${memberId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error editing permanent member: ${response.statusText}`);
            }
            const updatedPermanentMemberData = await response.json();
            const updatedPermanentMembers = permanentMember.map(member => {
                if (member.memberId === updatedPermanentMemberData.data.memberId) {
                    return updatedPermanentMemberData.data;
                }
                return member;
            });
            setPermanentMember(updatedPermanentMembers);
            toast.success('Permanent member edited successfully.');
            setShowEditPermanentMemberModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Error editing permanent member. Please try again later.');
        }
    };

    //delete api
    const deletePermanentMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/permanent-members/${selectedPermanentMemberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting permanent member: ${response.statusText}`);
            }
            setPermanentMember(permanentMember.filter(permanentMember => permanentMember.id !== selectedPermanentMemberId));
            setShowDeleteConfirmation(false);
            toast.success('Permanent member deleted successfully.');
            fetchPermanentMembers();

        } catch (error) {
            console.error(error);
            toast.error('Error deleting permanent member. Please try again later.');
        }
    };

    //view
    const handleViewOpenPermanentMember = (member) => {
        console.log("data==", member)
        setViewPermanentMemberData(member);
        setShowViewPermanentMemberModal(true);
    };

    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(permanentMember.length / perPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // First and last page navigation functions
    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const indexOfLastBookType = currentPage * perPage;
    const indexOfNumber = indexOfLastBookType - perPage;
    const currentData = permanentMember.slice(indexOfNumber, indexOfLastBookType);
    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddPermanentMemberModal(true)} className="button-color">
                        Add Permanent Member
                    </Button>
                </div>
                <div className='mt-3 table-container-general-member-1'>
                    <div className="table-responsive table-height">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Register Date</th>
                                    <th>Mobile No</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((member, index) => (
                                    <tr key={member.memberId}>
                                        <td>{indexOfNumber + index + 1}</td>
                                        <td>{member.firstName}</td>
                                        <td>{member.middleName}</td>
                                        <td>{member.lastName}</td>
                                        <td>{member.registerDate}</td>
                                        <td>{member.mobileNo}</td>
                                        <td>
                                            <PencilSquare
                                                className="ms-3 action-icon edit-icon"
                                                onClick={() => handleEditOpenPermanentMember(member)}
                                            />
                                            <Trash
                                                className="ms-3 action-icon delete-icon"
                                                onClick={() => {
                                                    setSelectedPermanentMemberId(member.memberId);
                                                    setShowDeleteConfirmation(true);
                                                }}
                                            />
                                            <Eye
                                                className="ms-3 action-icon view-icon"
                                                onClick={() => handleViewOpenPermanentMember(member)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="pagination-container">
                        <Button onClick={handleFirstPage} disabled={currentPage === 1}>First Page</Button>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}> <ChevronLeft /></Button>
                        <div className="pagination-text">Page {currentPage} of {totalPages}</div>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages}> <ChevronRight /></Button>
                        <Button onClick={handleLastPage} disabled={currentPage === totalPages}>Last Page</Button>
                    </div>
                </div>
            </Container>

            {/* Add permanent member Modal */}
            <Modal show={showAddPermanentMemberModal} onHide={() => setShowAddPermanentMemberModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Permanent Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={addPermanentMember}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        value={newPermanentMember.firstName}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, firstName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberMiddleName">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Middle Name"
                                        value={newPermanentMember.middleName}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, middleName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        value={newPermanentMember.lastName}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, lastName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberMobileNo">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={newPermanentMember.mobileNo}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value) && value.length <= 10) {
                                                setNewPermanentMember({ ...newPermanentMember, mobileNo: value });
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberAadharCard">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Aadhar"
                                        maxLength={12}
                                        pattern="\d{12}"
                                        value={newPermanentMember.adharCard}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setNewPermanentMember({ ...newPermanentMember, adharCard: value })
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberEmailId">
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="emailId"
                                        value={newPermanentMember.emailId}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, emailId: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberEducation">
                                    <Form.Label> Education</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Education"
                                        value={newPermanentMember.memberEducation}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberEducation: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberOccupation">
                                    <Form.Label>Occupation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Occupation"
                                        value={newPermanentMember.memberOccupation}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberOccupation: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberAddress">
                                    <Form.Label>Address </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        value={newPermanentMember.memberAddress}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberAddress: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberDateOfBirth">
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newPermanentMember.dateOfBirth}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, dateOfBirth: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberRegisterDate">
                                    <Form.Label>Register Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newPermanentMember.registerDate}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, registerDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberConfirmDate">
                                    <Form.Label>Confirm Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newPermanentMember.confirmDate}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, confirmDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberlibParMembNo">
                                    <Form.Label>Libaray Member No </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Member No"
                                        value={newPermanentMember.libParMembNo}
                                        onChange={(e) => setNewPermanentMember({ ...newPermanentMember, libParMembNo: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            {/* Edit permanent member Modal */}
            {/* <Modal show={showEditPermanentMemberModal} onHide={() => setShowEditPermanentMemberModal(false)} dialogClassName="modal-lg"> */}
            <Modal show={showEditPermanentMemberModal} onHide={() => { setShowEditPermanentMemberModal(false); resetFormFields(); }} size='xl '>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Permanent Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editPermanentMember}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        value={editPermanentMemberData ? editPermanentMemberData.firstName : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, firstName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberMiddleName">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Middle Name"
                                        value={editPermanentMemberData ? editPermanentMemberData.middleName : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, middleName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        value={editPermanentMemberData ? editPermanentMemberData.lastName : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, lastName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberMobileNo">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Mobile number"
                                        value={editPermanentMemberData ? editPermanentMemberData.mobileNo : ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setEditPermanentMemberData({ ...editPermanentMemberData, mobileNo: value })
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberAadharCard">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Aadhar"
                                        value={editPermanentMemberData ? editPermanentMemberData.adharCard : ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setEditPermanentMemberData({ ...editPermanentMemberData, adharCard: value })
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberEmailId">
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="emailId"
                                        value={editPermanentMemberData.emailId}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, emailId: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberEducation">
                                    <Form.Label>Education</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Education"
                                        value={editPermanentMemberData ? editPermanentMemberData.memberEducation : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberEducation: e.target.value })}
                                        required
                                    />

                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberOccupation">
                                    <Form.Label>Occupation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Occupation"
                                        value={editPermanentMemberData ? editPermanentMemberData.memberOccupation : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberOccupation: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        value={editPermanentMemberData ? editPermanentMemberData.memberAddress : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberAddress: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberDateOfBirth">
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editPermanentMemberData ? editPermanentMemberData.dateOfBirth : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, dateOfBirth: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberRegisterDate">
                                    <Form.Label>Register Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editPermanentMemberData ? editPermanentMemberData.registerDate : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, registerDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="editedPermanentMemberConfirmDate">
                                    <Form.Label>Confirm Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editPermanentMemberData ? editPermanentMemberData.confirmDate : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, confirmDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" lg={4} as={Col} controlId="newPermanentMemberlibParMembNo">
                                    <Form.Label>Libaray Member No </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Member No"
                                        value={editPermanentMemberData ? editPermanentMemberData.libParMembNo : ''}
                                        onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, libParMembNo: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'>
                                <Button className='button-color' type="submit">
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>


            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this permanent member?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deletePermanentMember}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* view Modal */}
            <Modal show={showViewPermanentMemberModal} onHide={() => setShowViewPermanentMemberModal(false)} size="xl">
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View Permanent Member Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {viewPermanentMemberData && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.firstName} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.middleName} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.lastName} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Mobile No</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.mobileNo} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Aadhar No</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.adharCard} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" readOnly defaultValue={viewPermanentMemberData.emailId} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Education</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberEducation} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Occupation</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberOccupation} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberAddress} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.dateOfBirth} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Register Date</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.registerDate} />
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Confirm Date</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.confirmDate} />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Member No</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.libParMembNo} />
                                    </Form.Group>
                                </Row>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewPermanentMemberModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default PermanentMember;
