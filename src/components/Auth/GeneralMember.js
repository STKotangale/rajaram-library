/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthCSS/PermanentGeneralMember.css';


const GeneralMember = () => {
    //get
    const [generalMember, setGeneralMember] = useState([]);
    //add
    const [showAddGeneralMemberModal, setShowAddGeneralMemberModal] = useState(false);
    const [newGeneralMember, setNewGeneralMember] = useState({
        username: '',
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
        memberEmailId: '',
        confirmDate: '',
        password: '',
    });
    //edit 
    const [showEditGeneralMemberModal, setShowEditGeneralMemberModal] = useState(false);
    const [editGeneralMemberData, setEditGeneralMemberData] = useState({});
    //delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedGeneralMemberId, setSelectedGeneralMemberId] = useState(null);
    //view modal
    const [showViewGeneralMemberModal, setShowViewGeneralMemberModal] = useState(false);
    const [viewGeneralMemberData, setViewGeneralMemberData] = useState(null);
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;


    //get api
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
    useEffect(() => {
        fetchGeneralMembers();
    }, []);


    //add post api
    const addGeneralMember = async (e) => {
        e.preventDefault();
        try {
            const mobileNo = parseInt(newGeneralMember.mobileNo);

            const response = await fetch(`${BaseURL}/api/general-members`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newGeneralMember, mobileNo }),
            });

            if (!response.ok) {
                throw new Error(`Error adding general member: ${response.statusText}`);
            }
            const data = await response.json();
            setGeneralMember([...generalMember, data.data]);
            setShowAddGeneralMemberModal(false);
            // Reset form fields
            setNewGeneralMember({
                username: '',
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
                memberEmailId: '',
                confirmDate: '',
                password: '',
            });
            toast.success('General member added successfully.');
            fetchGeneralMembers();
        } catch (error) {
            console.error(error);
            toast.error('Error adding general member. Please try again later.');
        }
    };


    //edit function
    const handleEditOpenGeneralMember = (member_id) => {
        const memberToEdit = generalMember.find(member => member.member_id === member_id);
        if (memberToEdit) {
            setEditGeneralMemberData(memberToEdit);
            setShowEditGeneralMemberModal(true);
        }
    };

    // //edit api
    // const editGeneralMember = async (e) => {
    //     e.preventDefault();
    //     try {
    //         if (!editGeneralMemberData || !editGeneralMemberData.memberId) {
    //             throw new Error('No memberId provided for editing.');
    //         }
    //         const { isBlock, ...requestData } = editGeneralMemberData;

    //         const response = await fetch(`${BaseURL}/api/general-members/${editGeneralMemberData.memberId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(requestData),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error editing general member: ${response.statusText}`);
    //         }
    //         const updatedGeneralMemberData = await response.json();
    //         const updatedGeneralMembers = generalMember.map(member => {
    //             if (member.memberId === updatedGeneralMemberData.data.memberId) {
    //                 return updatedGeneralMemberData.data;
    //             }
    //             return member;
    //         });
    //         setGeneralMember(updatedGeneralMembers);
    //         setShowEditGeneralMemberModal(false);
    //         toast.success('General member edited successfully.');
    //         fetchGeneralMembers();
    //     } catch (error) {
    //         console.error(error);
    //         toast.error('Error editing general member. Please try again later.');
    //     }
    // };


    //edit api
    const editGeneralMember = async (e) => {
        e.preventDefault();
        try {
            if (!editGeneralMemberData || !editGeneralMemberData.member_id) {
                throw new Error('No memberId provided for editing.');
            }
            const { member_id, ...requestData } = editGeneralMemberData;

            const payload = {
                firstName: requestData.first_name,
                middleName: requestData.middle_name,
                lastName: requestData.last_name,
                registerDate: requestData.register_date,
                adharCard: requestData.adhar_card,
                memberAddress: requestData.member_address,
                dateOfBirth: requestData.date_of_birth,
                memberEducation: requestData.member_education,
                memberOccupation: requestData.member_occupation,
                mobileNo: requestData.mobile_no,
                memberEmailId: requestData.email,
                confirmDate: requestData.confirm_date,
                isBlock: requestData.isBlock,
                username: requestData.username,
                password: requestData.password
            };
            const response = await fetch(`${BaseURL}/api/general-members/${member_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error editing general member: ${response.statusText}`);
            }
            const updatedGeneralMemberData = await response.json();
            const updatedGeneralMembers = generalMember.map(member => {
                if (member.member_id === updatedGeneralMemberData.data.member_id) {
                    return updatedGeneralMemberData.data;
                }
                return member;
            });
            setGeneralMember(updatedGeneralMembers);
            setShowEditGeneralMemberModal(false);
            toast.success('General member edited successfully.');
            fetchGeneralMembers();
        } catch (error) {
            console.error(error);
            toast.error('Error editing general member. Please try again later.');
        }
    };


    //delete api
    const deleteGeneralMember = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/general-members/${selectedGeneralMemberId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error deleting general member: ${response.statusText}`);
            }
            setGeneralMember(generalMember.filter(generalMember => generalMember.id !== selectedGeneralMemberId));
            setShowDeleteConfirmation(false);
            toast.success('General member deleted successfully.');
            fetchGeneralMembers();

        } catch (error) {
            console.error(error);
            toast.error('Error deleting general member. Please try again later.');
        }
    };


    //view
    const handleViewOpenGeneralMember = (member) => {
        setViewGeneralMemberData(member);
        setShowViewGeneralMemberModal(true);
    };


    return (
        <div className="main-content">
            <Container>
                <div className='mt-3'>
                    <Button onClick={() => setShowAddGeneralMemberModal(true)} className="button-color">
                        Add General Member
                    </Button>
                </div>
                <div className='mt-3 table-container-general-member-1'>
                    <Table striped bordered hover >
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
                            {generalMember.map((member, index) => (
                                <tr key={member.member_id}>
                                    <td>{index + 1}</td>
                                    <td>{member.first_name}</td>
                                    <td>{member.middle_name}</td>
                                    <td>{member.last_name}</td>
                                    <td>{member.register_date}</td>
                                    <td>{member.mobile_no}</td>
                                    <td>
                                        <PencilSquare
                                            className="ms-3 action-icon edit-icon"
                                            onClick={() => handleEditOpenGeneralMember(member.member_id)}
                                        />
                                        <Trash
                                            className="ms-3 action-icon delete-icon"
                                            onClick={() => {
                                                setSelectedGeneralMemberId(member.member_id);
                                                setShowDeleteConfirmation(true);
                                            }}
                                        />
                                        <Eye
                                            className="ms-3 action-icon view-icon"
                                            onClick={() => handleViewOpenGeneralMember(member)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>


            {/* Add General member Modal */}
            <Modal show={showAddGeneralMemberModal} onHide={() => setShowAddGeneralMemberModal(false)} size='xl' bg='light'>
                <div className="bg-light">
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
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberMobileNo">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={newGeneralMember.mobileNo}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 10 && /^\d*$/.test(value)) {
                                                setNewGeneralMember({ ...newGeneralMember, mobileNo: value });
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberAadharCard">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Aadhar"
                                        maxLength={12}
                                        pattern="\d{12}"
                                        value={newGeneralMember.adharCard}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setNewGeneralMember({ ...newGeneralMember, adharCard: value });
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberEmailId">
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control
                                        type="Email"
                                        placeholder="Email"
                                        value={newGeneralMember.memberEmailId}
                                        onChange={(e) => setNewGeneralMember({ ...newGeneralMember, memberEmailId: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
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
                                <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberRegisterDate">
                                    <Form.Label>Register Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newGeneralMember.registerDate}
                                        onChange={(e) => setNewGeneralMember({ ...newGeneralMember, registerDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="newGeneralMemberConfirmDate">
                                    <Form.Label>Confirm Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newGeneralMember.confirmDate}
                                        onChange={(e) => setNewGeneralMember({ ...newGeneralMember, confirmDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} lg={4} controlId="newGeneralMemberUsename">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        value={newGeneralMember.username}
                                        onChange={(e) => setNewGeneralMember({ ...newGeneralMember, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} lg={4} controlId="newGeneralMemberPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={newGeneralMember.password}
                                        onChange={(e) => setNewGeneralMember({ ...newGeneralMember, password: e.target.value })}
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


            {/* Edit General member Modal */}
            <Modal show={showEditGeneralMemberModal} onHide={() => setShowEditGeneralMemberModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit General Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={editGeneralMember}>
                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        value={editGeneralMemberData ? editGeneralMemberData.first_name : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, first_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberMiddleName">
                                    <Form.Label>Middle Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Middle Name"
                                        value={editGeneralMemberData ? editGeneralMemberData.middle_name : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, middle_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        value={editGeneralMemberData ? editGeneralMemberData.last_name : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, last_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberMobileNo">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={editGeneralMemberData ? editGeneralMemberData.mobile_no : ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setEditGeneralMemberData({ ...editGeneralMemberData, mobile_no: value })
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberAadharCard">
                                    <Form.Label>Aadhar Number</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Aadhar"
                                        value={editGeneralMemberData ? editGeneralMemberData.adhar_card : ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 12 && /^\d*$/.test(value)) {
                                                setEditGeneralMemberData({ ...editGeneralMemberData, adhar_card: value })
                                            }
                                        }}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberEmailId">
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        value={editGeneralMemberData ? editGeneralMemberData.email : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberEducation">
                                    <Form.Label>Education</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Education"
                                        value={editGeneralMemberData ? editGeneralMemberData.member_education : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, member_education: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberOccupation">
                                    <Form.Label>Occupation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Occupation"
                                        value={editGeneralMemberData ? editGeneralMemberData.member_occupation : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, member_occupation: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        value={editGeneralMemberData ? editGeneralMemberData.member_address : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, member_address: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberDateOfBirth">
                                    <Form.Label>Date Of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editGeneralMemberData ? editGeneralMemberData.date_of_birth : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, date_of_birth: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberRegisterDate">
                                    <Form.Label>Register Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editGeneralMemberData ? editGeneralMemberData.register_date : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, register_date: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} controlId="editedGeneralMemberConfirmDate">
                                    <Form.Label>Confirm Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editGeneralMemberData ? editGeneralMemberData.confirm_date : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, confirm_date: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="mb-3" as={Col} lg={4} controlId="editedGeneralMemberUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editGeneralMemberData ? editGeneralMemberData.username : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" as={Col} lg={4} controlId="editedGeneralMemberPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={editGeneralMemberData ? editGeneralMemberData.password : ''}
                                        onChange={(e) => setEditGeneralMemberData({ ...editGeneralMemberData, password: e.target.value })}
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

            {/* View general Modal */}
            <Modal show={showViewGeneralMemberModal} onHide={() => setShowViewGeneralMemberModal(false)} size="xl">
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>View General Member Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {viewGeneralMemberData && (
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.first_name} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.middle_name} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.last_name} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Mobile No</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.mobile_no} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Aadhar No</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.adhar_card} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" readOnly defaultValue={viewGeneralMemberData.email} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.date_of_birth} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Register Date</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.register_date} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Confirm Date</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.confirm_date} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Education</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.member_education} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Occupation</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.member_occupation} />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.member_address} />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} lg={4} className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" readOnly defaultValue={viewGeneralMemberData.username} />
                                    </Form.Group>
                                </Row>
                            </Form>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewGeneralMemberModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default GeneralMember;
