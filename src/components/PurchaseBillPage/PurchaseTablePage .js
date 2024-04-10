import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Navbar, Nav, Dropdown, Form, Button, Row, Col, Table } from 'react-bootstrap';

import Login from '../../assets/AvtarLogo.webp';
import { useAuth } from '../Auth/AuthProvider';

const PurchaseTablePage = () => {
    const navigate = useNavigate();

    //sidebar open close purchse form show
    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    const handleDashboard = () => {
        navigate('/sidebar');
    };

    const handleBookDetails = () => {
        navigate('/bookdetailspage');
    };
    return (
        <div className={`main-container ${showSidebar ? 'sidebar-open' : ''}`}>
            <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <ul>
                    <li><span className="heading">Rajaram Library</span> </li>
                    <li>
                        <span onClick={() => { handleDashboard(); }}>
                            Dashboard
                        </span>
                    </li>
                    <li><span>Purchase Bill</span></li>
                    <li><span onClick={() => { handleBookDetails(); }}>Book Details</span></li>
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

                <Container>
                    <h1 className="text-center mt-5">Purchase Form Table</h1>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Invoice No</th>
                                <th>Invoice Date</th>
                                <th>Ledger Name</th>
                                <th>Book Name</th>
                                <th>No Of Quantity</th>
                                <th>Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                </Container>
            </div>
        </div>


    );
};

export default PurchaseTablePage;
