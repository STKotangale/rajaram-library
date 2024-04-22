/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthCSS/PermanentMember.css';


const GeneralMember = () => {
    const [generalMember, setGeneralMember] = useState([
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


    const [newGeneralMember, setNewGeneralMember] = useState({
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
    const [showAddGeneralMemberModal, setShowAddGeneralMemberModal] = useState(false);
    // const [newPermanentMemberName, setNewPermanentMemberName] = useState('');

    const [isBlock, setIsBlock] = useState(false);
    const [selectedGeneralMemberId, setSelectedGeneralMemberId] = useState(null);
    const [showEditGeneralMemberModal, setShowEditGeneralMemberModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const fetchGeneralMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/general-member`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching general member: ${response.statusText}`);
            }
            const data = await response.json();
            setGeneralMember(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching general member. Please try again later.');
        }
    };

    useEffect(() => {
        fetchGeneralMember();
    }, []);

    const addGeneralMember = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/general-member`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ GeneralMemberName: newGeneralMember }),
            });
            if (!response.ok) {
                throw new Error(`Error adding general member: ${response.statusText}`);
            }
            const data = await response.json();
            setGeneralMember([...generalMember, data.data]);
            setShowAddGeneralMemberModal(false);
            setNewGeneralMember('');
            toast.success('General member added successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error adding General member. Please try again later.');
        }
    };

    const editGeneralMember = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BaseURL}/api/auth/general-member/${selectedGeneralMemberId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ generalMemberName: newGeneralMember, isBlock: isBlock.toString() }),
            });
            if (!response.ok) {
                throw new Error(`Error editing General member: ${response.statusText}`);
            }
            const updatedGeneralMemberData = await response.json();
            const updatedGeneralMember = generalMember.map(generalMember => {
                if (generalMember.id === selectedGeneralMemberId) {
                    return { ...generalMember,generalMemberName: updatedGeneralMemberData.data.generalMemberName, isBlock: updatedGeneralMemberData.data.isBlock };
                }
                return generalMember;
            });
            setGeneralMember(updatedGeneralMember);
            setShowEditGeneralMemberModal(false);
            setNewGeneralMember('');
            setIsBlock(false);
            toast.success('General member edited successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error editing General member. Please try again later.');
        }
    };

    const deleteGeneralMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/General-member/${selectedGeneralMemberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting General member: ${response.statusText}`);
            }
            setGeneralMember(generalMember.filter(generalMember => generalMember.id !== selectedGeneralMemberId));
            setShowDeleteConfirmation(false);
            toast.success('General member deleted successfully.');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting General member. Please try again later.');
        }
    };

    return (
        <div className="main-content-1">
            <Container >

                <div className='mt-3'>
                    <Button onClick={() => setShowAddGeneralMemberModal(true)} className="button-color">
                        Add General Member
                    </Button>
                </div>

                <div className='mt-3 table-container-general-member'>
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
                            {generalMember.map((member) => (
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
                                            onClick={() => {
                                                setSelectedGeneralMemberId(member.id);
                                                setNewGeneralMember(member.firstName);
                                                setShowEditGeneralMemberModal(true);
                                                setIsBlock(member.isBlocked);
                                            }}
                                        />
                                        <Trash
                                            className="ms-3 action-icon delete-icon"
                                            onClick={() => {
                                                setSelectedGeneralMemberId(member.id);
                                                setShowDeleteConfirmation(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>

            {/* Add permanent member Modal */}
            <Modal show={showAddGeneralMemberModal} onHide={() => setShowAddGeneralMemberModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New General Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addGeneralMember}>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={newGeneralMember.firstName}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, firstName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberMiddleName">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Middle Name"
                                    value={newGeneralMember.middleName}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, middleName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={newGeneralMember.lastName}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, lastName: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newPermGeneralMemberRegisterDate">
                                <Form.Label>Register Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newGeneralMember.registerDate}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, registerDate: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newPGeneralMemberAadharCard">
                                <Form.Label>Aadhar Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Aadhar"
                                    maxLength={12}
                                    value={newGeneralMember.aadharCard}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, aadharCard: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberAddress">
                                <Form.Label>Address </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Address"
                                    value={newGeneralMember.memberAddress}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, memberAddress: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberDateOfBirth">
                                <Form.Label>Date Of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newGeneralMember.dateOfBirth}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, dateOfBirth: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberEducation">
                                <Form.Label> Education</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Education"
                                    value={newGeneralMember.memberEducation}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, memberEducation: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberOccupation">
                                <Form.Label>Occupation</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Occupation"
                                    value={newGeneralMember.memberOccupation}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, memberOccupation: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberMobileNo">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mobile number"
                                    maxLength={10}
                                    value={newGeneralMember.mobileNo}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, mobileNo: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberEmailId">
                                <Form.Label>Email Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Email"
                                    value={newGeneralMember.memberEmailId}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, memberEmailId: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberConfirmDate">
                                <Form.Label>Confirm Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    // placeholder=""
                                    value={newGeneralMember.confirmDate}
                                    onChange={(e) => setNewGeneralMember({ ...newGeneralMember, confirmDate: e.target.value })}
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
            <Modal show={showEditGeneralMemberModal} onHide={() => setShowEditGeneralMemberModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit General Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editGeneralMember}>
                        <Form.Group className="mb-3" controlId="editedGeneralMemberName">
                            <Form.Label>General member Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter edited general member name"
                                value={newGeneralMember}
                                onChange={(e) => setNewGeneralMember(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editedGeneralMemberIsBlocked">
                            <Form.Label>Is Blocked</Form.Label>
                            <Form.Select
                                value={isBlock ? 'Yes' : 'No'}
                                onChange={(e) => setIsBlock(e.target.value === 'Yes')}
                                required
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
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
                <Modal.Body>Are you sure you want to delete this general member?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteGeneralMember}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GeneralMember;
