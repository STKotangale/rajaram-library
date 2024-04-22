/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthCSS/PermanentGeneralMember.css';



const PermanentMember = () => {
    const [permanentMember, setPermanentMember] = useState([
        {
            id: 1,
            firstName: 'John',
            middleName: '',
            lastName: 'Doe',
            registerDate: '2024-04-18',
            aadharCard: '123456789012',
            memberAddress: '123 Main St, City',
            dateOfBirth: '1990-01-01',
            memberEducation: 'Bachelor\'s Degree',
            memberOccupation: 'Engineer',
            mobileNo: '1234567890',
            memberEmailId: 'john@example.com',
            confirmDate: '2024-04-18',
            isBlocked: false
        },
        {
            id: 2,
            firstName: 'Jane',
            middleName: '',
            lastName: 'Smith',
            registerDate: '2024-04-19',
            aadharCard: '987654321098',
            memberAddress: '456 Oak St, Town',
            dateOfBirth: '1995-05-15',
            memberEducation: 'Master\'s Degree',
            memberOccupation: 'Doctor',
            mobileNo: '9876543210',
            memberEmailId: 'jane@example.com',
            confirmDate: '2024-04-19',
            isBlocked: false
        },
    ]);


    const [newPermanentMember, setNewPermanentMember] = useState({
        memberId: '',
        firstName: '',
        middleName: '',
        lastName: '',
        registerDate: '',
        aadharCard: '',
        memberAddress: '',
        dateOfBirth: '',
        memberEducation: '',
        memberOccupation: '',
        mobileNo: '',
        memberEmailId: '',
        confirmDate: '',
        isBlocked: false
    });
    const [showAddPermanentMemberModal, setShowAddPermanentMemberModal] = useState(false);
    // const [newPermanentMemberName, setNewPermanentMemberName] = useState('');

    const [isBlock, setIsBlock] = useState(false);
    const [selectedPermanentMemberId, setSelectedPermanentMemberId] = useState(null);
    const [showEditPermanentMemberModal, setShowEditPermanentMemberModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const fetchPermanentMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/permanent-member`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching permanent member: ${response.statusText}`);
            }
            const data = await response.json();
            setPermanentMember(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching permanent member. Please try again later.');
        }
    };

    useEffect(() => {
        fetchPermanentMember();
    }, []);

    const addPermanentMember = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/permanent-member`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ PermanentMemberName: newPermanentMember }),
            });
            if (!response.ok) {
                throw new Error(`Error adding permanent member: ${response.statusText}`);
            }
            const data = await response.json();
            setPermanentMember([...permanentMember, data.data]);
            setShowAddPermanentMemberModal(false);
            setNewPermanentMember('');
            toast.success('Permanent member added successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error adding permanent member. Please try again later.');
        }
    };


    //edit function
    const [editPermanentMemberData, setEditPermanentMemberData] = useState(null);

    // Function to handle opening edit modal and setting data
    const handleEditOpenPermanentMember = (memberId) => {
        const memberToEdit = permanentMember.find(member => member.id === memberId);
        if (memberToEdit) {
            setEditPermanentMemberData(memberToEdit);
            setShowEditPermanentMemberModal(true);
        }
    };


    const editPermanentMember = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/permanent-member/${selectedPermanentMemberId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ permanentMemberName: newPermanentMember, isBlock: isBlock.toString() }),
            });
            if (!response.ok) {
                throw new Error(`Error editing permanent member: ${response.statusText}`);
            }
            const updatedPermanentMemberData = await response.json();
            const updatedPermanentMember = permanentMember.map(permanentMember => {
                if (permanentMember.id === selectedPermanentMemberId) {
                    return { ...permanentMember, permanentMemberName: updatedPermanentMemberData.data.permanentmemberName, isBlock: updatedPermanentMemberData.data.isBlock };
                }
                return permanentMember;
            });
            setPermanentMember(updatedPermanentMember);
            setShowEditPermanentMemberModal(false);
            setNewPermanentMember('');
            setIsBlock(false);
            toast.success('Permanent member edited successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error editing permanent member. Please try again later.');
        }
    };

    const deletePermanentMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/permanent-member/${selectedPermanentMemberId}`, {
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
        } catch (error) {
            console.error(error);
            toast.error('Error deleting permanent member. Please try again later.');
        }
    };

    // view permanent Member
    const [showViewPermanentMemberModal, setShowViewPermanentMemberModal] = useState(false);
    const [viewPermanentMemberData, setViewPermanentMemberData] = useState(null);


    const handleViewOpenPermanentMember = (memberId) => {
        const memberToView = permanentMember.find(member => member.id === memberId);
        if (memberToView) {
            setViewPermanentMemberData(memberToView);
            setShowViewPermanentMemberModal(true);
        }
    };


    return (
        <div className="main-content-1">
            <Container >

                <div className='mt-3'>
                    <Button onClick={() => setShowAddPermanentMemberModal(true)} className="button-color">
                        Add Permanent Member
                    </Button>
                </div>

                <div className='mt-3 table-container-permanent-member'>
                    <Table striped bordered hover style={{ minWidth: '2400px' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Register Date</th>
                                <th>Aadhar No</th>
                                <th> Address</th>
                                <th>Date of Birth</th>
                                <th> Education</th>
                                <th> Occupation</th>
                                <th>Mobile No</th>
                                <th> Email </th>
                                <th>Confirm Date</th>
                                <th>Is Blocked</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permanentMember.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.firstName}</td>
                                    <td>{member.middleName}</td>
                                    <td>{member.lastName}</td>
                                    <td>{member.registerDate}</td>
                                    <td>{member.aadharCard}</td>
                                    <td>{member.memberAddress}</td>
                                    <td>{member.dateOfBirth}</td>
                                    <td>{member.memberEducation}</td>
                                    <td>{member.memberOccupation}</td>
                                    <td>{member.mobileNo}</td>
                                    <td>{member.memberEmailId}</td>
                                    <td>{member.confirmDate}</td>
                                    <td>{member.isBlocked ? 'Yes' : 'No'}</td>
                                    <td>
                                        <PencilSquare
                                            className="ms-3 action-icon edit-icon"
                                            onClick={() => handleEditOpenPermanentMember(member.id)}
                                        />
                                        <Trash
                                            className="ms-3 action-icon delete-icon"
                                            onClick={() => {
                                                setSelectedPermanentMemberId(member.id);
                                                setShowDeleteConfirmation(true);
                                            }}
                                        />
                                        <Eye
                                            className="ms-3 action-icon view-icon"
                                            onClick={() => handleViewOpenPermanentMember(member.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>

            {/* Add permanent member Modal */}
            <Modal show={showAddPermanentMemberModal} onHide={() => setShowAddPermanentMemberModal(false)} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Permanent Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addPermanentMember}>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={newPermanentMember.firstName}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, firstName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberMiddleName">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Middle Name"
                                    value={newPermanentMember.middleName}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, middleName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberLastName">
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
                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberRegisterDate">
                                <Form.Label>Register Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newPermanentMember.registerDate}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, registerDate: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberAadharCard">
                                <Form.Label>Aadhar Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Aadhar"
                                    maxLength={12}
                                    value={newPermanentMember.aadharCard}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, aadharCard: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberAddress">
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
                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberDateOfBirth">
                                <Form.Label>Date Of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newPermanentMember.dateOfBirth}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, dateOfBirth: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberEducation">
                                <Form.Label> Education</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Education"
                                    value={newPermanentMember.memberEducation}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberEducation: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberOccupation">
                                <Form.Label>Occupation</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Occupation"
                                    value={newPermanentMember.memberOccupation}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberOccupation: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberMobileNo">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mobile number"
                                    maxLength={10}
                                    value={newPermanentMember.mobileNo}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, mobileNo: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberEmailId">
                                <Form.Label>Email Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={newPermanentMember.memberEmailId}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, memberEmailId: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermanentMemberConfirmDate">
                                <Form.Label>Confirm Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    // placeholder=""
                                    value={newPermanentMember.confirmDate}
                                    onChange={(e) => setNewPermanentMember({ ...newPermanentMember, confirmDate: e.target.value })}
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
            </Modal>

            {/* Edit permanent member Modal */}
            <Modal show={showEditPermanentMemberModal} onHide={() => setShowEditPermanentMemberModal(false)} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Permanent Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editPermanentMember}>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={editPermanentMemberData ? editPermanentMemberData.firstName : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, firstName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberMiddleName">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Middle Name"
                                    value={editPermanentMemberData ? editPermanentMemberData.middleName : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, middleName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberLastName">
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
                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberRegisterDate">
                                <Form.Label>Register Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editPermanentMemberData ? editPermanentMemberData.registerDate : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, registerDate: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberAadharCard">
                                <Form.Label>Aadhar Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Aadhar"
                                    maxLength={12}
                                    value={editPermanentMemberData ? editPermanentMemberData.aadharCard : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, aadharCard: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberAddress">
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
                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberDateOfBirth">
                                <Form.Label>Date Of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editPermanentMemberData ? editPermanentMemberData.dateOfBirth : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, dateOfBirth: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberEducation">
                                <Form.Label>Education</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Education"
                                    value={editPermanentMemberData ? editPermanentMemberData.memberEducation : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberEducation: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberOccupation">
                                <Form.Label>Occupation</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Occupation"
                                    value={editPermanentMemberData ? editPermanentMemberData.memberOccupation : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberOccupation: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberMobileNo">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mobile number"
                                    maxLength={10}
                                    value={editPermanentMemberData ? editPermanentMemberData.mobileNo : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, mobileNo: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberEmailId">
                                <Form.Label>Email Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={editPermanentMemberData ? editPermanentMemberData.memberEmailId : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, memberEmailId: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="editedPermanentMemberConfirmDate">
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
                            <Form.Group className="mb-3" as={Col} md={4} controlId="editedPermanentMemberIsBlocked">
                                <Form.Label>Is Blocked</Form.Label>
                                <Form.Select
                                    value={editPermanentMemberData ? (editPermanentMemberData.isBlocked ? 'Yes' : 'No') : ''}
                                    onChange={(e) => setEditPermanentMemberData({ ...editPermanentMemberData, isBlocked: e.target.value === 'Yes' })}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

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

            {/* view permanent member */}
            <Modal show={showViewPermanentMemberModal} onHide={() => setShowViewPermanentMemberModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>View Permanent Member Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewPermanentMemberData && (
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text"
                                        readOnly
                                        defaultValue={viewPermanentMemberData.firstName}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.middleName} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Last Name</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.lastName} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Register Date</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.registerDate} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Aadhar No</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.aadharCard} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Address</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberAddress} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Date of Birth</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.dateOfBirth} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Education</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberEducation} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Occupation</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.memberOccupation} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Mobile No</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.mobileNo} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Email</Form.Label>
                                    <Form.Control type="email" readOnly defaultValue={viewPermanentMemberData.memberEmailId} />
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3">
                                    <Form.Label >Confirm Date</Form.Label>
                                    <Form.Control type="text" readOnly defaultValue={viewPermanentMemberData.confirmDate} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} md={4}  className="mb-3">
                                    <Form.Label >Is Blocked</Form.Label>
                                    <Form.Control type="text"
                                        readOnly
                                        defaultValue={viewPermanentMemberData.isBlocked ? 'Yes' : 'No'}
                                    />
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
            </Modal>

        </div>
    );
};

export default PermanentMember;
