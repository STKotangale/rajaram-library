/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown, Row, Col } from 'react-bootstrap';
import Login from '../../assets/AvtarLogo.webp';

import { useAuth } from '../Auth/AuthProvider';

import './Sidebar.css';
import './Dashboard.css';


const SideBar = () => {
    const navigate = useNavigate();

    //siderbar open close
    const [showSidebar, setShowSidebar] = useState(false);

    const [showLibraryInfo, setShowLibraryInfo] = useState(true);

    //get username and access token
    const { username, accessToken } = useAuth();
    useEffect(() => {
        console.log('Username:', username);
        console.log('AccessToken:', accessToken);
    }, [username, accessToken]);

    //siderbar open close icon
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    const handleDashboard = () => {
        navigate('/sidebar');
    };

    const handlePurchaseBillClick = () => {
        navigate('/purchasebillpage');
       
    };

    const handleBookDetails = () => {
        navigate('/bookdetailspage');
    };

    return (
        <div className={`main-container ${showSidebar ? 'sidebar-open' : ''}`}>
            <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <ul>
                    <li><span className="heading">RajaLib</span> </li>
                    <li><span onClick={() => { handleDashboard() }} > Dashboard</span></li>
                    <li><span onClick={() => { handlePurchaseBillClick() }}>Purchase Bill</span></li>
                    <li><span onClick={() => {handleBookDetails()  }}>Book Details</span></li>
                </ul>
            </div>

            <div className={`content ${showSidebar ? 'content-shifted' : ''}`}>
                <Navbar bg="dark" variant="dark" expand="lg" style={{ width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
                    <div className="container-fluid">
                        <div className="sidebar-toggle" onClick={toggleSidebar}>
                            ☰
                        </div>

                        <Nav className="me-auto">
                            <Navbar.Brand href="#">Registration and Login System</Navbar.Brand>
                        </Nav>
                        <div className="profileicon">
                            <Dropdown className="custom-dropdown-toggle profile-icon">
                                <Dropdown.Toggle variant="custom" id="dropdown-basic">
                                    <img src={Login} className="loginregistericon" alt="loginregistericon" height="25" width="25" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu-show'>
                                    <Dropdown.Item disabled>{username}</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Navbar>

                <div className="main-content">
                    {showLibraryInfo && (
                        <Container>
                            <Row className="justify-content-md-center mt-5">
                                <Col xs={12} md={10} lg={10}>
                                    <div className="border-dark p-4 border-style text-center">
                                        <div className="welcome-message">
                                            <h1>Welcome to Library Management, {username}!</h1>
                                            <div className='access-text smaller-text token-text'>
                                                Access Token: {accessToken}
                                            </div>
                                        </div>

                                        <div className="library-info mt-3">
                                            <p>
                                                Library management refers to the process of managing library resources effectively to meet the needs of users. It involves various tasks such as acquiring, organizing, cataloging, circulating, and maintaining library materials.
                                            </p>
                                            <p>
                                                Key aspects of library management include collection development, budgeting, space planning, staff management, user services, and technology integration.
                                            </p>
                                            <p>
                                                Effective library management ensures that library resources are accessible, organized, and utilized efficiently to support the educational, informational, and recreational needs of the community.
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
