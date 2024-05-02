/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, ListGroup, Image, NavDropdown, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PersonCircle, LockFill, BoxArrowRight, BookFill, HouseDoorFill, Book, Bookshelf, Globe, Archive, GearWideConnected, People, PersonFill, PeopleFill, CartPlus, AddUserCircle, BookHalf } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';
import { useRef } from 'react';

import '../CommonFiles/CommonCSS/AdminDashboard.css';
import '../../components/Inventory/InventoryCSS/PurchaseBookDashboardData.css';

import logoImage from '../../assets/rajalib.png';
import Footer from './Footer';

import DashboardData from './StaticDashboardData';
import ViewPurchase from '../Inventory/Purchase/ViewPurchase';
import BookDetailsTable from '../Inventory/Purchase/BookDetailsTable';
import BookLanguages from '../Inventory/Book/BookLanguages';
import Books from '../Inventory/Book/Books';
import BookTypes from '../Inventory/Book/BookTypes';
import BookAuthor from '../Inventory/Book/BookAuthor';
import BookPublication from '../Inventory/Book/BookPublication';

import Purchaser from '../Inventory/Purchase/Purchaser';

import User from '../Auth/User';
import PermanentMember from '../Auth/PermanentMember';
import GeneralMember from '../Auth/GeneralMember';


const AdminDashboard = () => {
    const navigate = useNavigate();

    const [viewDashboard, setViewDashboard] = useState(true);
    const [fillBookDetails, setFillBookDetails] = useState(false);
    const [books, setBooks] = useState(false);
    const [bookLanguages, setBookLanguages] = useState(false);
    const [bookType, setBookType] = useState(false);
    const [viewPurchase, setViewPurchase] = useState(false);
    const [permanentMember, setPermanentMember] = useState(false);
    const [generalMember, setGeneralMember] = useState(false);
    const [purchaser, setPurchaser] = useState(false);
    const [createUser, setCreateUser] = useState(false);
    const [bookAuthor, setBookAuthor] = useState(false);
    const [bookPublication, setBookPublication] = useState(false);

    //change password
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [credentials, setCredentials] = useState({
        password: '',
        confirmPassword: ''
    });

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);


    const handleHomeClick = () => {
        setViewDashboard(true);
        setFillBookDetails(false);
        setViewPurchase(false);
        setBookLanguages(false);
        setBooks(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleBookDetailsClick = () => {
        setFillBookDetails(true);
        setViewDashboard(false);
        setViewPurchase(false);
        setBookLanguages(false);
        setBooks(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleBookLanguages = () => {
        setBookLanguages(true);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBooks(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };


    const handleBookName = () => {
        setBooks(true);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleBookType = () => {
        setBookType(true);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleShowPurchase = () => {
        setViewPurchase(true);
        setBookType(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };


    const handlePermanentMember = () => {
        setPermanentMember(true);
        setBookType(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };


    const handleGeneralMember = () => {
        setGeneralMember(true);
        setBookType(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setPermanentMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handlePurchaser = () => {
        setPurchaser(true);
        setGeneralMember(false);
        setBookType(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setPermanentMember(false);
        setCreateUser(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleCreateUser = () => {
        setCreateUser(true);
        setPurchaser(false);
        setGeneralMember(false);
        setBookType(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBooks(false);
        setPermanentMember(false);
        setBookAuthor(false);
        setBookPublication(false);
    };

    const handleBookAuthor = () => {
        setBookAuthor(true);
        setBooks(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookPublication(false);
    };

    const handleBookPublication = () => {
        setBookPublication(true);
        setBooks(false);
        setViewPurchase(false);
        setFillBookDetails(false);
        setViewDashboard(false);
        setBookLanguages(false);
        setBookType(false);
        setPermanentMember(false);
        setGeneralMember(false);
        setPurchaser(false);
        setCreateUser(false);
        setBookAuthor(false);
    };

    //change password
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const { password, confirmPassword } = credentials;
        if (password === confirmPassword) {
            console.log('Password changed successfully!');
            setShowChangePasswordModal(false);
            setCredentials({ password: '', confirmPassword: '' });
        } else {
            console.log('Passwords do not match.');
        }
    };

    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };


    // const handleIssueClick = () => {

    // }
    // const handleIssueReturnClick = () => {

    // }
    // const handlePurchaseReturnClick = () => {

    // }


    const [showInventorySubItems, setShowInventorySubItems] = useState(false);

    const toggleInventorySubItems = () => {
        setShowInventorySubItems(!showInventorySubItems);
    };

    const [showMasterSubItems, setShowMasterSubItems] = useState(false);

    const toggleMasterSubItems = () => {
        setShowMasterSubItems(!showMasterSubItems);
    };

    const [showAccountSubItems, setShowAccountSubItems] = useState(false);

    const toggleAccountSubItems = () => {
        setShowAccountSubItems(!showAccountSubItems);
    };


    //sidebar mobile view
    const sidebarRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
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


    return (
        <div className='main-dashboard-member'>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`sidebar-admin ${showSidebar ? 'active' : ''}`}>

                <div className="d-flex sidebar-member" id="wrapper">
                    <div className="admin-sidebar">
                        <div className='mt-3 ms-4'>
                            <Image src={logoImage} className="rajalib-logo" height="50" />
                            <span className="h4 ms-2 mt-4">Rajaram Library</span>
                        </div>
                        <ListGroup variant="flush" className="mt-4 ms-4 custom-list-group">
                            <Col lg={11} className="">
                                <ListGroup.Item className="home-icon" action onClick={() => { handleHomeClick(); setShowSidebar(false); }}>
                                    <HouseDoorFill className="icon" /> Home
                                </ListGroup.Item>

                                <ListGroup.Item className="admin-general-icon mt-2" action onClick={toggleInventorySubItems}>
                                    <Archive className="icon me-2" /> Inventory
                                </ListGroup.Item>
                                {showInventorySubItems && (
                                    <>
                                        <ListGroup.Item className="issue-icon mt-1" action onClick={() => { handleShowPurchase(); setShowSidebar(false); }}>
                                            <CartPlus className="icon" /> Purchase
                                        </ListGroup.Item>
                                        <ListGroup.Item className="book-icon mt-1" actio onClick={() => { handleBookDetailsClick(); setShowSidebar(false); }}>
                                            <BookFill className="icon" /> Book Details
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handleBookLanguages(); setShowSidebar(false); }}>
                                            <Globe className="me-2" /> Book Languages
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handleBookName(); setShowSidebar(false); }}>
                                            <Book className="me-2" /> Book
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handleBookType(); setShowSidebar(false); }}>
                                            <Bookshelf className="me-2" /> Book Types
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handleBookAuthor(); setShowSidebar(false); }}>
                                            <PersonFill className="me-2" /> Book Author
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handleBookPublication(); setShowSidebar(false); }}>
                                            <BookHalf className="me-2" /> Book Publication
                                        </ListGroup.Item>

                                        {/* <ListGroup.Item className="issue-icon mt-1" action onClick={handleIssueClick}>
                                            <ExclamationTriangleFill className="icon" /> Issue
                                        </ListGroup.Item>
                                        <ListGroup.Item className="issue-return-icon mt-1" action onClick={handleIssueReturnClick}>
                                            <ArrowReturnLeft className="icon" /> Issue Return
                                        </ListGroup.Item>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={handlePurchaseReturnClick}>
                                            <CartDashFill className="icon" /> Purchase Return
                                        </ListGroup.Item> */}
                                        {/* <ListGroup.Item className="purchase-icon mt-1" action onClick={handlePurchaseDetailsClick}>
                                            <CartPlusFill className="icon" /> Purchase
                                        </ListGroup.Item> */}
                                    </>
                                )}

                                <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleAccountSubItems}>
                                    <Archive className="icon me-2" /> Account
                                </ListGroup.Item>
                                {showAccountSubItems && (
                                    <>
                                        <ListGroup.Item className="purchase-return-icon mt-1" action onClick={() => { handlePurchaser(); setShowSidebar(false); }}>
                                            <PersonFill className="me-2" /> Purchaser
                                        </ListGroup.Item>
                                    </>
                                )}

                                <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleMasterSubItems}>
                                    <Archive className="icon" /> Master
                                </ListGroup.Item>
                                {showMasterSubItems && (
                                    <>
                                        <ListGroup.Item className="admin-icon mt-2" action>
                                            <PersonCircle className="icon" />Admin
                                        </ListGroup.Item>
                                        <ListGroup.Item className="admin-icon mt-2" action onClick={() => { handleCreateUser(); setShowSidebar(false); }}>
                                            <PersonFill className="icon" />  User
                                        </ListGroup.Item>
                                        <ListGroup.Item className="admin-icon mt-2" action onClick={() => { handlePermanentMember(); setShowSidebar(false); }}>
                                            <PeopleFill className="me-2" /> Permanent Members
                                        </ListGroup.Item>
                                        <ListGroup.Item className="admin-icon mt-2" action onClick={() => { handleGeneralMember(); setShowSidebar(false); }}>
                                            <People className="icon" /> General Member
                                        </ListGroup.Item>
                                    </>
                                )}
                            </Col>
                        </ListGroup>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className='dashboard-member-page-details'>
                <Navbar bg="light" className="mb-4 border-bottom navabar-color dashboard-member-navabar">
                    <div className="sidebar-toggle d-md-none color-black" onClick={toggleSidebar}>
                        ☰
                    </div>
                    {/* <Navbar.Brand href="#Dashboard" className='ms-4'>Welcome Member !.. {username}</Navbar.Brand> */}
                    <Navbar.Brand href="#Dashboard" className='ms-4 welcome-message'>
                        Welcome Member{username && <span className="d-none d-sm-inline"> !.. {username}</span>}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto ">
                        </Nav>
                        <NavDropdown title={<PersonCircle size={30} />} id="navbarScrollingDropdown" className='ms-0' align="end">
                            <NavDropdown.Item onClick={() => setShowChangePasswordModal(true)}>
                                <LockFill className="icon" /> Change Password
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#logout" onClick={handleLogout}>
                                <BoxArrowRight className="icon" /> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar>

                <Container fluid className=" d-flex flex-column justify-content-between admin-main-content">
                    {viewDashboard && <DashboardData />}
                    {fillBookDetails && <BookDetailsTable />}
                    {bookLanguages && <BookLanguages />}
                    {books && <Books />}
                    {bookType && <BookTypes />}
                    {viewPurchase && <ViewPurchase />}
                    {permanentMember && <PermanentMember />}
                    {generalMember && <GeneralMember />}
                    {purchaser && <Purchaser />}
                    {createUser && <User />}
                    {bookAuthor && <BookAuthor />}
                    {bookPublication && <BookPublication />}
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
        </div >
    );
};

export default AdminDashboard;

