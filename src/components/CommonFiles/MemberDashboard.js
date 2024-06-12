/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, ListGroup, Image, NavDropdown, Modal, Button, Form, Col } from 'react-bootstrap';
import { PersonCircle, LockFill, BoxArrowRight, HouseDoorFill, BookFill, PersonFill, CalendarFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';

import '../CommonFiles/CommonCSS/MemberDashboard.css';
import '../../components/Inventory/InventoryTransaction/CSS/Purchase.css';
import '../MemberDash/CSS/MemberDash.css';

import logoImage from '../../assets/rajalib.png';

import { useRef } from 'react';
import Dashboard from '../MemberDash/Dashboard';
import BookList from '../MemberDash/BookList';
import OnlineBooking from '../MemberDash/OnlineBooking';

const MemberDashboard = () => {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const [selectedItemName, setSelectedItemName] = useState('');

    const [viewDashboard, setViewDashboard] = useState(true);
    const [memberDateWise, setMemberDateWise] = useState(false);
    const [onlineBooking, setOnlineBooking] = useState(false);


    // change password
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [credentials, setCredentials] = useState({
        password: '',
        confirmPassword: ''
    });

    const { username, accessToken, userId, logout } = useAuth();

    // get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSidebar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleHomeClick = () => {
        setViewDashboard(true);
        setSelectedItemName('Home');
        setMemberDateWise(false);
        setOnlineBooking(false);
    };

    const handleBookListClick = () => {
        setMemberDateWise(true);
        setSelectedItemName('Book List');
        setViewDashboard(false);
        setOnlineBooking(false);
    };


    const handleOnlineBookingClick = () => {
        setOnlineBooking(true);
        setSelectedItemName('Online Booking');
        setViewDashboard(false);
        setMemberDateWise(false);
    };

    // change password
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();
        const { password, confirmPassword } = credentials;
        if (password !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        try {
            const response = await fetch(`${BaseURL}/api/general-members/update-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ userId, password, confirmPassword }),
            });

            if (response.ok) {
                toast.success('Password changed successfully.');
                setShowChangePasswordModal(false);
                setCredentials({ password: '', confirmPassword: '' });
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    // handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className='main-dashboard-member'>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <div className="d-flex sidebar-member" id="wrapper">
                    <div className="member-sidebar">
                        <div className='mt-3 mb-3 ms-3'>
                            <Image src={logoImage} className="rajalib-logo" height="50" />
                            <span className="h4 ms-2 mt-4">Rajaram Library</span>
                        </div>
                        <div className='scrollable'>
                            <ListGroup variant="flush" className="mt-5 ms-3 custom-list-group">
                                <Col lg={11} className="">
                                    <ListGroup.Item className="sub-icon list-group-item list-group-item-action" action onClick={() => { handleHomeClick(); setShowSidebar(false); }}>
                                        <HouseDoorFill className="icon-member" /> Home
                                    </ListGroup.Item>
                                    <ListGroup.Item className="sub-icon list-group-item list-group-item-action" action onClick={() => { handleBookListClick(); setShowSidebar(false); }}>
                                        <BookFill className="icon-member" /> Book List
                                    </ListGroup.Item>
                                    <ListGroup.Item className="sub-icon list-group-item list-group-item-action" action onClick={() => { handleOnlineBookingClick(); setShowSidebar(false); }}>
                                        <CalendarFill className="icon-member" /> Online Booking
                                    </ListGroup.Item>
                                </Col>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className='dashboard-member-page-details'>
                {/* Sidebar toggle button for mobile view */}
                <Navbar expand="lg" className="mb-4 border-bottom navabar-color dashboard-member-navabar">
                    <div className="sidebar-toggle d-md-none color-black" onClick={toggleSidebar}>
                        ☰
                    </div>
                    <Nav className="ms-4 mt-2">
                        <div className="selected-item">{selectedItemName}</div>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto ">
                        </Nav>
                        <NavDropdown title={<PersonCircle size={30} />} id="navbarScrollingDropdown" className='ms-4' align="end">
                            <div className="username-container">
                                <PersonFill className="icon me-2 ms-3" />
                                {username}
                                <hr className="horizontal-line" />
                            </div>
                            <NavDropdown.Item onClick={() => setShowChangePasswordModal(true)}>
                                <LockFill className="icon" /> Change Password
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#logout" onClick={handleLogout}>
                                <BoxArrowRight className="icon" /> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid className=" d-flex flex-column justify-content-between main-member-content">
                    {viewDashboard && <Dashboard />}
                    {memberDateWise && <BookList />}
                    {onlineBooking && <OnlineBooking />}

                </Container>
                {/* <Footer /> */}
            </div>

            {/* Change Password Modal */}
            <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mt-2" controlId="formBasicPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-4" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                name="confirmPassword"
                                value={credentials.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-4">
                            <Button className="button-color" type="submit">
                                Change Password
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MemberDashboard;
