/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, ListGroup, Image, NavDropdown, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PersonCircle, LockFill, BoxArrowRight, BookFill, HouseDoorFill, Book, Bookshelf, Globe, Archive, GearWideConnected, People, PersonFill, PeopleFill, CartPlus, AddUserCircle, BookHalf, ExclamationTriangleFill, ArrowReturnLeft, CartDashFill, FileEarmarkX, CurrencyDollar, Calendar, Gear } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';
import { useRef } from 'react';

import '../CommonFiles/CommonCSS/AdminDashboard.css';
import '../../components/Inventory/InventoryCSS/PurchaseBookDashboardData.css';

// import logoImage from '../../assets/rajalib.png';
import logo from '../../assets/rajalib-removebg-preview.png';

// import Footer from './Footer';

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

import Issue from '../Inventory/Book/Issue';
import IssueReturn from '../Inventory/Book/IssueReturn';
import PurchaseReturn from '../Inventory/Book/PurchaseReturn';
import MembershipFees from '../Fees/MembershipFees';
import BookLost from '../Inventory/Book/BookLost';
import BookScrap from '../Inventory/Book/BookScrap';
import LibararyFees from '../Fees/LibararyFees';
import Config from '../Fees/Config';
import MonthlyMembershipFee from '../Fees/MonthlyMembershipFee';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const BaseURL = process.env.REACT_APP_BASE_URL;

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

    const [bookIssue, setBookIssue] = useState(false);
    const [bookIssueReturn, setBookIssueReturn] = useState(false);
    const [bookPurchaseReturn, setBookPurchaseReturn] = useState(false);

    const [bookLost, setBookLost] = useState(false);
    const [bookScrap, setBookScrap] = useState(false);

    const [libraryFees, setLibraryFees] = useState(false);
    const [memberFees, setMemberFees] = useState(false);
    const [monthlyMemberFees, setMonthlyMemberFees] = useState(false);

    const [config, setConfig] = useState(false);

    //change password
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [credentials, setCredentials] = useState({
        password: '',
        confirmPassword: ''
    });

    const { username, accessToken, logout, userId } = useAuth();

    //get username and access token
    useEffect(() => {

    }, [username, accessToken]);

    //sunitem
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

    //show name in navbar
    const [selectedItemName, setSelectedItemName] = useState('');

    //true and false
    const handleHomeClick = () => {
        setViewDashboard(true);
        setSelectedItemName('Home');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setLibraryFees(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setConfig(false);
    };

    const handleShowPurchase = () => {
        setViewPurchase(true);
        setSelectedItemName('Purchase');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleBookDetailsClick = () => {
        setFillBookDetails(true);
        setSelectedItemName('Book Details');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleBookLanguages = () => {
        setBookLanguages(true);
        setSelectedItemName('Book Languages');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };


    const handleBookName = () => {
        setBooks(true);
        setSelectedItemName('Book');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleBookType = () => {
        setBookType(true);
        setSelectedItemName('Book Type');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handlePermanentMember = () => {
        setPermanentMember(true);
        setSelectedItemName('Permanent Member');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };



    const handleGeneralMember = () => {
        setGeneralMember(true);
        setSelectedItemName('General Member');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handlePurchaser = () => {
        setPurchaser(true);
        setSelectedItemName('Purchaser');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleCreateUser = () => {
        setCreateUser(true);
        setSelectedItemName('User');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleBookAuthor = () => {
        setBookAuthor(true);
        setSelectedItemName('Book Author');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleBookPublication = () => {
        setBookPublication(true);
        setSelectedItemName('Book Publication');
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    };

    const handleIssueClick = () => {
        setBookIssue(true);
        setSelectedItemName('Issue');
        setBookPublication(false);
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
        setBookIssueReturn(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }

    const handleIssueReturnClick = () => {
        setBookIssueReturn(true);
        setSelectedItemName('Issue Return');
        setBookPublication(false);
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
        setBookIssue(false);
        setBookPurchaseReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }


    const handlePurchaseReturnClick = () => {
        setBookPurchaseReturn(true);
        setSelectedItemName('Purchase Return');
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }

    const hendleBookLost = () => {
        setBookLost(true);
        setSelectedItemName('Book Lost');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }

    const hendleBookScrap = () => {
        setBookScrap(true);
        setSelectedItemName('Book Scrap');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }


    const hendleMemberFees = () => {
        setMemberFees(true);
        setSelectedItemName('Member Fees');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }


    const hendleMonthlyMemberFees = () => {
        setMonthlyMemberFees(true);
        setSelectedItemName('Monthly Member Fees');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
    }


    const hendleLibararyFees = () => {
        setLibraryFees(true);
        setSelectedItemName('Libarary Fees');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setConfig(false);
    }


    const hendleConfig = () => {
        setConfig(true);
        setSelectedItemName('Config');
        setBookPurchaseReturn(false);
        setBookPublication(false);
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
        setBookIssue(false);
        setBookIssueReturn(false);
        setBookLost(false);
        setBookScrap(false);
        setMemberFees(false);
        setMonthlyMemberFees(false);
        setLibraryFees(false);
    }

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
    

    //handle logout
    const handleLogout = () => {
        logout();
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
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
                        <div className='mt-3 mb-3 ms-3'>
                            <Image src={logo} className="rajalib-logo" height="50" />
                            <span className="h4 ms-2 mt-4">Rajaram Library</span>
                        </div>
                        <div className='scrollable'>
                            <ListGroup variant="flush" className="mt-3 custom-list-group">
                                <Col lg={10} className="ms-3 list-group">
                                    <ListGroup.Item className="sub-icon" action onClick={() => { handleHomeClick(); setShowSidebar(false); }}>
                                        <HouseDoorFill className="icon" /> Home
                                    </ListGroup.Item>

                                    <ListGroup.Item className="admin-general-icon mt-2" action onClick={toggleInventorySubItems}>
                                        <Archive className="icon me-2" /> Inventory
                                    </ListGroup.Item>
                                    {showInventorySubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleShowPurchase(); setShowSidebar(false); }}>
                                                <CartPlus className="icon me-2" /> Purchase
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookDetailsClick(); setShowSidebar(false); }}>
                                                <BookFill className="icon me-2" /> Book Details
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookLanguages(); setShowSidebar(false); }}>
                                                <Globe className="me-2" /> Book Languages
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookName(); setShowSidebar(false); }}>
                                                <Book className="me-2" /> Book
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookType(); setShowSidebar(false); }}>
                                                <Bookshelf className="me-2" /> Book Types
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookAuthor(); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Book Author
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookPublication(); setShowSidebar(false); }}>
                                                <BookHalf className="me-2" /> Book Publication
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={handleIssueClick}>
                                                <ExclamationTriangleFill className="me-2" /> Issue
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={handleIssueReturnClick}>
                                                <ArrowReturnLeft className="me-2 icon" /> Issue Return
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={handlePurchaseReturnClick}>
                                                <CartDashFill className="me-2 icon" /> Purchase Return
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={hendleBookLost}>
                                                <BookHalf className="me-2 icon" /> Book Lost
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={hendleBookScrap}>
                                                <FileEarmarkX className="me-2 icon" /> Book Scrap
                                            </ListGroup.Item>
                                            {/* <ListGroup.Item className="purchase-icon mt-1" action onClick={handlePurchaseDetailsClick}>
                                            <CartPlusFill className="icon" /> Purchase
                                        </ListGroup.Item> */}
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleAccountSubItems}>
                                        <Archive className="icon me-2" /> Account
                                    </ListGroup.Item>
                                    {showAccountSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handlePurchaser(); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Purchaser
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleMemberFees(); setShowSidebar(false); }}>
                                                <CurrencyDollar  className="me-2" /> Membership Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleMonthlyMemberFees(); setShowSidebar(false); }}>
                                                <Calendar  className="me-2" />Monthly Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleLibararyFees(); setShowSidebar(false); }}>
                                                <Book  className="me-2" /> Libarary Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleConfig(); setShowSidebar(false); }}>
                                                <Gear className="me-2" /> Config
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3 mb-2" action onClick={toggleMasterSubItems}>
                                        <Archive className="icon me-2" /> Master
                                    </ListGroup.Item>
                                    {showMasterSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-2" action>
                                                <PersonCircle className="icon me-2" />Admin
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { handleCreateUser(); setShowSidebar(false); }}>
                                                <PersonFill className="icon me-2" />  User
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { handlePermanentMember(); setShowSidebar(false); }}>
                                                <PeopleFill className="me-2" /> Permanent Members
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-2" action onClick={() => { handleGeneralMember(); setShowSidebar(false); }}>
                                                <People className="icon me-2" /> General Member
                                            </ListGroup.Item>
                                        </div>
                                    )}
                                </Col>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className='dashboard-member-page-details'>
                <Navbar className="mb-4 border-bottom navabar-color dashboard-member-navabar">
                    <div className="sidebar-toggle d-md-none color-black mt-1" onClick={toggleSidebar}>
                        ☰
                    </div>
                    {/* <Navbar.Brand href="#Dashboard" className='ms-4  mt-2 welcome-username'>Welcome Member !.. {username}</Navbar.Brand> */}
                    {/* <Navbar.Brand href="#Dashboard" className='ms-4 welcome-message'>
                        Welcome Member{username && <span className="d-none d-sm-inline"> !.. {username}</span>}
                    </Navbar.Brand> */}
                    <Nav className="ms-4 mt-2">
                        <div className="selected-item">{selectedItemName}</div>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto ">
                        </Nav>
                        <NavDropdown title={<div className="logo-container"><PersonCircle size={30} /></div>} id="navbarScrollingDropdown" className='ms-0 logo-size' align="end">
                            <div className="username-container">
                                <PersonFill className="icon me-2 ms-3" />
                                {username}
                                <hr className="horizontal-line" />
                            </div>
                            {/* <NavDropdown title={<PersonCircle size={30} />} id="navbarScrollingDropdown" className='ms-0 logo-size' align="end"> */}
                            <NavDropdown.Item onClick={() => setShowChangePasswordModal(true)}>
                                <LockFill className="icon" /> Change Password
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>
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

                    {bookIssue && <Issue />}
                    {bookIssueReturn && <IssueReturn />}
                    {bookPurchaseReturn && <PurchaseReturn />}

                    {bookLost && <BookLost />}
                    {bookScrap && <BookScrap />}

                    {libraryFees && <LibararyFees />}
                    {config && <Config />}

                    {memberFees && <MembershipFees />}
                    {monthlyMemberFees && <MonthlyMembershipFee />}


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
                            <Button type="submit">
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

