import React, { useEffect, useState, useRef } from 'react';
import { Container, Navbar, Nav, ListGroup, Image, NavDropdown, Modal, Button, Form, Col } from 'react-bootstrap';
import { PersonCircle, LockFill, BoxArrowRight, BookFill, HouseDoorFill, Book, Bookshelf, Globe, Archive, People, PersonFill, PeopleFill, CartPlus, BookHalf, ExclamationTriangleFill, ArrowReturnLeft, CartDashFill, FileEarmarkX, CurrencyDollar, Calendar, Gear, PlusCircle, Arrow90degRight, FileText, FileTextFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';
import logo from '../../assets/rajalib-removebg-preview.png';

import DashboardData from './StaticDashboardData';

import Issue from '../Inventory/InventoryTransaction/Issue';
import IssueReturn from '../Inventory/InventoryTransaction/IssueReturn';
import ViewPurchase from '../Inventory/InventoryTransaction/ViewPurchase';
import PurchaseReturn from '../Inventory/InventoryTransaction/PurchaseReturn';
import BookLost from '../Inventory/InventoryTransaction/BookLost';
import BookScrap from '../Inventory/InventoryTransaction/BookScrap';
import BookDetailsTable from '../Inventory/InventoryTransaction/BookDetailsTable';

import Accession from '../Inventory/InventoryTransaction/Report/Accession';
import AccessionStatus from '../Inventory/InventoryTransaction/Report/AccessionStatus';
import IssueTransaction1 from '../Inventory/InventoryTransaction/Report/IssueTransaction1';
import IssueTransaction2 from '../Inventory/InventoryTransaction/Report/IssueTransaction2';

import Books from '../Inventory/InventoryMaster/Books';
import BookLanguages from '../Inventory/InventoryMaster/BookLanguages';
import BookTypes from '../Inventory/InventoryMaster/BookTypes';
import BookAuthor from '../Inventory/InventoryMaster/BookAuthor';
import BookPublication from '../Inventory/InventoryMaster/BookPublication';

import MemberReport from '../Inventory/InventoryMaster/Report/MemberReport';
import BookReport from '../Inventory/InventoryMaster/Report/BookReport';
import OnlyDate from '../Inventory/InventoryMaster/Report/OnlyDate';
import OnlyMemberName from '../Inventory/InventoryMaster/Report/OnlyMemberName';
import OnlyBookName from '../Inventory/InventoryMaster/Report/OnlyBookName';
import IssueReport1 from '../Inventory/InventoryMaster/Report/IssueReport1';
import IssueReport2 from '../Inventory/InventoryMaster/Report/IssueReport2';

import Purchaser from '../Inventory/InventoryAccount/Purchaser';
import MembershipFees from '../Inventory/InventoryAccount/MembershipFees';
import LibararyFees from '../Inventory/InventoryAccount/LibararyFees';
import Config from '../Inventory/InventoryAccount/Config';
import MonthlyMembershipFee from '../Inventory/InventoryAccount/MonthlyMembershipFee';

import User from '../Auth/User';
import PermanentMember from '../Auth/PermanentMember';
import GeneralMember from '../Auth/GeneralMember';

import '../CommonFiles/CommonCSS/AdminDashboard.css';
import '../../components/Inventory/InventoryTransaction/CSS/Purchase.css';

const componentMapping = {
    Home: DashboardData,
    bookIssue: Issue,
    bookIssueReturn: IssueReturn,
    Purchase: ViewPurchase,
    bookPurchaseReturn: PurchaseReturn,
    bookLost: BookLost,
    bookScrap: BookScrap,
    BookDetails: BookDetailsTable,

    accessionReport: Accession,
    accessionStatusReport: AccessionStatus,
    issueTransactionReport1: IssueTransaction1,
    issueTransactionReport2: IssueTransaction2,

    Books: Books,
    Languages: BookLanguages,
    BookType: BookTypes,
    bookAuthor: BookAuthor,
    bookPublication: BookPublication,

    memberReport: MemberReport,
    bookNames: BookReport,
    onlyDate: OnlyDate,
    onlyMemberName: OnlyMemberName,
    onlyBookName: OnlyBookName,
    issueMasterReport1: IssueReport1,
    issueMasterReport2: IssueReport2,

    Purchaser: Purchaser,
    libraryFees: LibararyFees,
    config: Config,
    memberFees: MembershipFees,
    monthlyMemberFees: MonthlyMembershipFee,

    PermanentMember: PermanentMember,
    GeneralMember: GeneralMember,
    User: User,
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const [viewState, setViewState] = useState('Home');
    //transction
    const [showInventoryTransactionSubItems, setShowInventoryTransactionSubItems] = useState(false);
    //transction report
    const [showInventoryTransactionReportSubItems, setShowInventoryTransactionReportSubItems] = useState(false);
    const [showInventoryTransactionIssueReportSubItems, setShowInventoryTransactionIssueReportSubItems] = useState(false);
    const [showInventoryTransactionAccessionReportSubItems, setShowInventoryTransactionAccessionReportSubItems] = useState(false);

    //master
    const [showInventoryMasterSubItems, setShowInventoryMasterSubItems] = useState(false);
    //master report
    const [showInventoryMasterReportSubItems, setShowInventoryMasterReportSubItems] = useState(false);
    const [showInventoryMasterIssueReportSubItems, setShowInventoryMasterIssueReportSubItems] = useState(false);
    //account
    const [showAccountSubItems, setShowAccountSubItems] = useState(false);
    //account report
    const [showAccountReportSubItems, setShowAccountReportSubItems] = useState(false);
    //admin
    const [showAdminSubItems, setShowAdminSubItems] = useState(false);
    //admin report
    const [showAdminReportSubItems, setShowAdminReportSubItems] = useState(false);

    //auth
    const { username, accessToken, logout, userId } = useAuth();
    //change password
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [credentials, setCredentials] = useState({ password: '', confirmPassword: '' });

    //mobile view 
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


    const resetFormFields = () => {
        setCredentials({
            password: '',
            confirmPassword: ''
        });
    };


    //change password
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
                resetFormFields();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    //logout
    const handleLogout = () => {
        logout();
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    //call component
    const ComponentToRender = componentMapping[viewState];

    const formatViewState = (viewState) => {
        return viewState
            .replace(/([A-Z])/g, ' $1') // insert a space before all caps
            .trim() // remove leading spaces
            .split(' ') // split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize first letter of each word
            .join(' '); // rejoin into one string
    };



    // const [showAccessionStatusModal, setShowAccessionStatusModal] = useState(false);
    // const handleOpenAccessionStatus = () => {
    //     setShowAccessionStatusModal(true);
    // };

    // const handleCloseAccessionStatus = () => {
    //     setShowAccessionStatusModal(false);
    // };

    return (
        <div className='main-dashboard-member'>
            <div ref={sidebarRef} className={`sidebar-admin ${showSidebar ? 'active' : ''}`}>
                <div className="d-flex sidebar-member" id="wrapper">
                    <div className="admin-sidebar">
                        <div className='mt-3 mb-3 ms-3'>
                            <Image src={logo} className="rajalib-logo" height="50" />
                            <span className="h4 ms-2 mt-4">Rajaram Library</span>
                        </div>
                        <div className='scrollable'>
                            <ListGroup variant="flush" className="mt-3 custom-list-group">
                                <Col lg={10} className="ms-3 list-group">
                                    <ListGroup.Item className="sub-icon" action onClick={() => { setViewState('Home'); setShowSidebar(false); }}>
                                        <HouseDoorFill className="icon" /> Home
                                    </ListGroup.Item>

                                    <ListGroup.Item className="admin-general-icon mt-2" action onClick={() => setShowInventoryTransactionSubItems(!showInventoryTransactionSubItems)}>
                                        <Archive className="icon me-2" /> Inventory Transaction
                                    </ListGroup.Item>
                                    {showInventoryTransactionSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookIssue'); setShowSidebar(false); }}>
                                                <ExclamationTriangleFill className="me-2" /> Issue
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookIssueReturn'); setShowSidebar(false); }}>
                                                <ArrowReturnLeft className="me-2 icon" /> Issue Return
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('Purchase'); setShowSidebar(false); }}>
                                                <CartPlus className="icon me-2" /> Purchase
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookPurchaseReturn'); setShowSidebar(false); }}>
                                                <CartDashFill className="me-2 icon" /> Purchase Return
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookLost'); setShowSidebar(false); }}>
                                                <BookHalf className="me-2 icon" /> Book Lost
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookScrap'); setShowSidebar(false); }}>
                                                <FileEarmarkX className="me-2 icon" /> Book Scrap
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('BookDetails'); setShowSidebar(false); }}>
                                                <BookFill className="icon me-2" /> Book Details
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowInventoryTransactionReportSubItems(!showInventoryTransactionReportSubItems)}>
                                        <Archive className="icon me-2" /> Transaction Report
                                    </ListGroup.Item>
                                    {showInventoryTransactionReportSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setShowInventoryTransactionAccessionReportSubItems(!showInventoryTransactionAccessionReportSubItems) }}>
                                                <PlusCircle className="icon me-2" />Accession
                                            </ListGroup.Item>
                                            {showInventoryTransactionAccessionReportSubItems && (
                                                <div>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('accessionReport'); setShowSidebar(false); }}>
                                                        <FileText className="icon me-2" /> Accession
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('accessionStatusReport'); setShowSidebar(false); }}>
                                                        <FileTextFill  className="icon me-2" /> Accession Status
                                                    </ListGroup.Item>
                                                    {/* <ListGroup.Item className="sub-icon mt-1" action onClick={handleOpenAccessionStatus}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Accession Status
                                                    </ListGroup.Item> */}


                                                </div>
                                            )}

                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => setShowInventoryTransactionIssueReportSubItems(!showInventoryTransactionIssueReportSubItems)}>
                                                <PlusCircle className="icon me-2" /> Issue
                                            </ListGroup.Item>
                                            {showInventoryTransactionIssueReportSubItems && (
                                                <div>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('issueTransactionReport1'); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 1
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('issueTransactionReport2'); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 2
                                                    </ListGroup.Item>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowInventoryMasterSubItems(!showInventoryMasterSubItems)}>
                                        <Archive className="icon me-2" /> Inventory Master
                                    </ListGroup.Item>
                                    {showInventoryMasterSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('Books'); setShowSidebar(false); }}>
                                                <Book className="me-2" /> Book
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('BookType'); setShowSidebar(false); }}>
                                                <Bookshelf className="me-2" /> Book Types
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('Languages'); setShowSidebar(false); }}>
                                                <Globe className="me-2" /> Book Languages
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookAuthor'); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Book Author
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookPublication'); setShowSidebar(false); }}>
                                                <BookHalf className="me-2" /> Book Publication
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowInventoryMasterReportSubItems(!showInventoryMasterReportSubItems)}>
                                        <Archive className="icon me-2" /> Master Report
                                    </ListGroup.Item>
                                    {showInventoryMasterReportSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => setShowInventoryMasterIssueReportSubItems(!showInventoryMasterIssueReportSubItems)}>
                                                <PlusCircle className="icon me-2" /> Issue Report
                                            </ListGroup.Item>
                                            {showInventoryMasterIssueReportSubItems && (
                                                <div>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('issueMasterReport1'); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 1
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('issueMasterReport2'); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 2
                                                    </ListGroup.Item>
                                                </div>
                                            )}

                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('memberReport'); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 1
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('bookNames'); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 2
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('onlyDate'); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 3
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('onlyMemberName'); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 4
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('onlyBookName'); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 5
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowAccountSubItems(!showAccountSubItems)}>
                                        <Archive className="icon me-2" /> Account
                                    </ListGroup.Item>
                                    {showAccountSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('Purchaser'); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Purchaser
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('memberFees'); setShowSidebar(false); }}>
                                                <CurrencyDollar className="me-2" /> Membership Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('monthlyMemberFees'); setShowSidebar(false); }}>
                                                <Calendar className="me-2" /> Monthly Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('libraryFees'); setShowSidebar(false); }}>
                                                <Book className="me-2" /> Library Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { setViewState('config'); setShowSidebar(false); }}>
                                                <Gear className="me-2" /> Config
                                            </ListGroup.Item>
                                        </div>
                                    )}


                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowAccountReportSubItems(!showAccountReportSubItems)}>
                                        <Archive className="icon me-2" /> Account Report
                                    </ListGroup.Item>
                                    {showAccountReportSubItems && (
                                        <div className='ms-2'>

                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={() => setShowAdminSubItems(!showAdminSubItems)}>
                                        <Archive className="icon me-2" /> Admin
                                    </ListGroup.Item>
                                    {showAdminSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { setViewState('User'); setShowSidebar(false); }}>
                                                <PersonFill className="icon me-2" /> User
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { setViewState('PermanentMember'); setShowSidebar(false); }}>
                                                <PeopleFill className="me-2" /> Permanent Members
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { setViewState('GeneralMember'); setShowSidebar(false); }}>
                                                <People className="icon me-2" /> General Member
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3 mb-3" action onClick={() => setShowAdminReportSubItems(!showAdminReportSubItems)}>
                                        <Archive className="icon me-2" /> Admin Report
                                    </ListGroup.Item>
                                    {showAdminReportSubItems && (
                                        <div className='ms-2'>

                                        </div>
                                    )}

                                </Col>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>


            <div className='dashboard-member-page-details'>
                <Navbar className="mb-4 border-bottom navabar-color dashboard-member-navabar">
                    <div className="sidebar-toggle d-md-none color-black mt-1" onClick={toggleSidebar}>
                        ☰
                    </div>
                    <Nav className="ms-4 mt-2">
                        {/* <div className="selected-item">{viewState}</div> */}
                        <div className="selected-item">{formatViewState(viewState)}</div>

                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto "></Nav>
                        <NavDropdown title={<div className="logo-container"><PersonCircle size={30} /></div>} id="navbarScrollingDropdown" className='ms-0 logo-size' align="end">
                            <div className="username-container">
                                <PersonFill className="icon me-2 ms-3" />
                                {username}
                                <hr className="horizontal-line" />
                            </div>
                            <NavDropdown.Item onClick={() => setShowChangePasswordModal(true)}>
                                <LockFill className="icon" /> Change Password
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>
                                <BoxArrowRight className="icon" /> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar>

                <Container fluid className="d-flex flex-column justify-content-between admin-main-content">
                    {ComponentToRender && <ComponentToRender />}

                    {/* {showAccessionStatusModal && (
                        <AccessionStatus show={showAccessionStatusModal} handleClose={handleCloseAccessionStatus} />
                    )} */}

                </Container>

            </div>


            <Modal show={showChangePasswordModal} onHide={() => { setShowChangePasswordModal(false); resetFormFields() }}>
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
                            <Button type="submit" className='button-color'>
                                Change Password
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
