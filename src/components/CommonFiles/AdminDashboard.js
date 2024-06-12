/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, ListGroup, Image, NavDropdown, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PersonCircle, LockFill, BoxArrowRight, BookFill, HouseDoorFill, Book, Bookshelf, Globe, Archive, GearWideConnected, People, PersonFill, PeopleFill, CartPlus, AddUserCircle, BookHalf, ExclamationTriangleFill, ArrowReturnLeft, CartDashFill, FileEarmarkX, CurrencyDollar, Calendar, Gear, PlusCircle, Arrow90degRight, Arrow90degLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Auth/AuthProvider';
import { useRef } from 'react';

import '../CommonFiles/CommonCSS/AdminDashboard.css';
import '../../components/Inventory/InventoryTransaction/CSS/Purchase.css';

// import logoImage from '../../assets/rajalib.png';
import logo from '../../assets/rajalib-removebg-preview.png';

// import Footer from './Footer';

import DashboardData from './StaticDashboardData';



//Inventory Transaction
import Issue from '../Inventory/InventoryTransaction/Issue';
import IssueReturn from '../Inventory/InventoryTransaction/IssueReturn';
import ViewPurchase from '../Inventory/InventoryTransaction/ViewPurchase';//purchase
import PurchaseReturn from '../Inventory/InventoryTransaction/PurchaseReturn';
import BookLost from '../Inventory/InventoryTransaction/BookLost';
import BookScrap from '../Inventory/InventoryTransaction/BookScrap';
import BookDetailsTable from '../Inventory/InventoryTransaction/BookDetailsTable';
//Inventory Report
import Accession from '../Inventory/InventoryTransaction/Report/Accession';
import AccessionStatus from '../Inventory/InventoryTransaction/Report/AccessionStatus';
import IssueTransaction1 from '../Inventory/InventoryTransaction/Report/IssueTransaction1';
import IssueTransaction2 from '../Inventory/InventoryTransaction/Report/IssueTransaction2';

//Inventory Master
import Books from '../Inventory/InventoryMaster/Books';
import BookLanguages from '../Inventory/InventoryMaster/BookLanguages';
import BookTypes from '../Inventory/InventoryMaster/BookTypes';
import BookAuthor from '../Inventory/InventoryMaster/BookAuthor';
import BookPublication from '../Inventory/InventoryMaster/BookPublication';
//Inventory Report
import MemberReport from '../Inventory/InventoryMaster/Report/MemberReport';
import BookReport from '../Inventory/InventoryMaster/Report/BookReport';
import OnlyDate from '../Inventory/InventoryMaster/Report/OnlyDate';
import OnlyMemberName from '../Inventory/InventoryMaster/Report/OnlyMemberName';
import OnlyBookName from '../Inventory/InventoryMaster/Report/OnlyBookName';
import IssueReport1 from '../Inventory/InventoryMaster/Report/IssueReport1';
import IssueReport2 from '../Inventory/InventoryMaster/Report/IssueReport2';


//Inventory Account
import Purchaser from '../Inventory/InventoryAccount/Purchaser';
import MembershipFees from '../Inventory/InventoryAccount/MembershipFees';
import LibararyFees from '../Inventory/InventoryAccount/LibararyFees';
import Config from '../Inventory/InventoryAccount/Config';
import MonthlyMembershipFee from '../Inventory/InventoryAccount/MonthlyMembershipFee';


import User from '../Auth/User';
import PermanentMember from '../Auth/PermanentMember';
import GeneralMember from '../Auth/GeneralMember';








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


    //transaction report
    const [accessionReport, setAccessionReport] = useState(false);
    const [accessionStatusReport, setAccessionStatusReport] = useState(false);

    const [issueTransactionReport1, setIssueTransactionReport1] = useState(false);
    const [issueTransactionReport2, setIssueTransactionReport2] = useState(false);

    //master report
    const [memberReport, setMemberReport] = useState(false);
    const [bookNames, setBookNames] = useState(false);
    const [onlyDate, setOnlyDate] = useState(false);
    const [onlyMemberName, setOnlyMemberName] = useState(false);
    const [onlyBookName, setOnlyBookName] = useState(false);

    const [issueMasterReport1, setIssueMasterReport1] = useState(false);
    const [issueMasterReport2, setIssueMasterReport2] = useState(false);

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

    //transaction
    const [showInventoryTransactionSubItems, setShowInventoryTransactionSubItems] = useState(false);
    const toggleInventoryTransactionSubItems = () => {
        setShowInventoryTransactionSubItems(!showInventoryTransactionSubItems);
    };

    //report transaction
    const [showInventoryTransactionReportSubItems, setShowInventoryTransactionReportSubItems] = useState(false);
    const toggleInventoryTransactionReportSubItems = () => {
        setShowInventoryTransactionReportSubItems(!showInventoryTransactionReportSubItems);
    };
    //accession  transaction report
    const [showTransactionAccession, setShowTransactionAccession] = useState(false);
    const toggleTransactionAccession = () => {
        setShowTransactionAccession(!showTransactionAccession);
    };
    //issue  transaction report
    const [showTransactionIssue, setShowTransactionIssue] = useState(false);
    const toggleTransactionIssue = () => {
        setShowTransactionIssue(!showTransactionIssue);
    };

    //master
    const [showInventoryMasterSubItems, setShowInventoryMasterSubItems] = useState(false);
    const toggleInventoryMasterSubItems = () => {
        setShowInventoryMasterSubItems(!showInventoryMasterSubItems);
    };

    //report master
    const [showInventoryMasterReportSubItems, setShowInventoryMasterReportSubItems] = useState(false);
    const toggleInventoryMasterReportSubItems = () => {
        setShowInventoryMasterReportSubItems(!showInventoryMasterReportSubItems);
    };
    //issue  master report
    const [showIssues, setShowIssues] = useState(false);
    const toggleIssues = () => {
        setShowIssues(!showIssues);
    };

    //Account
    const [showAccountSubItems, setShowAccountSubItems] = useState(false);
    const toggleAccountSubItems = () => {
        setShowAccountSubItems(!showAccountSubItems);
    };

    //Admin
    const [showAdminSubItems, setShowAdminSubItems] = useState(false);
    const toggleAdminSubItems = () => {
        setShowAdminSubItems(!showAdminSubItems);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMonthlyMemberFees(false);
        setLibraryFees(false);
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleMemberReport = () => {
        setMemberReport(true);
        setSelectedItemName('Member Report');
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
        setConfig(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }


    const handleBookReport = () => {
        setBookNames(true);
        setSelectedItemName('Book Report');
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
        setConfig(false);
        setMemberReport(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleOnlyDateReport = () => {
        setOnlyDate(true);
        setSelectedItemName('Only Date Report');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleOnlyMemberReport = () => {
        setOnlyMemberName(true);
        setSelectedItemName('Only Member Report');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleOnlyBookReport = () => {
        setOnlyBookName(true);
        setSelectedItemName('Only Book Name Report');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleMasterIssue1 = () => {
        setIssueMasterReport1(true);
        setSelectedItemName('Issue 1');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

    const handleMasterIssue2 = () => {
        setIssueMasterReport2(true);
        setSelectedItemName('Issue 2');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }


    const handleAccession = () => {
        setAccessionReport(true);
        setSelectedItemName('Accession');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionStatusReport(false);
    }

    const handleAccessionStatus = () => {
        setAccessionStatusReport(true);
        setSelectedItemName('Accession Status');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
    }


    const handleTransactionIssue1 = () => {
        setIssueTransactionReport1(true);
        setSelectedItemName('Issue 1');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport2(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
    }

     const handleTransactionIssue2 = () => {
        setIssueTransactionReport2(true);
        setSelectedItemName('Issue 2');
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
        setConfig(false);
        setMemberReport(false);
        setBookNames(false);
        setOnlyDate(false);
        setOnlyMemberName(false);
        setOnlyBookName(false);
        setIssueMasterReport1(false);
        setIssueMasterReport2(false);
        setIssueTransactionReport1(false);
        setAccessionReport(false);
        setAccessionStatusReport(false);
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

                                    {/* Transaction */}
                                    <ListGroup.Item className="admin-general-icon mt-2" action onClick={toggleInventoryTransactionSubItems}>
                                        <Archive className="icon me-2" /> Inventory Transaction
                                    </ListGroup.Item>
                                    {showInventoryTransactionSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={handleIssueClick}>
                                                <ExclamationTriangleFill className="me-2" /> Issue
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={handleIssueReturnClick}>
                                                <ArrowReturnLeft className="me-2 icon" /> Issue Return
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleShowPurchase(); setShowSidebar(false); }}>
                                                <CartPlus className="icon me-2" /> Purchase
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
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookDetailsClick(); setShowSidebar(false); }}>
                                                <BookFill className="icon me-2" /> Book Details
                                            </ListGroup.Item>
                                            {/* <ListGroup.Item className="purchase-icon mt-1" action onClick={handlePurchaseDetailsClick}>
                                            <CartPlusFill className="icon" /> Purchase
                                        </ListGroup.Item> */}
                                        </div>
                                    )}

                                    {/* report transaction*/}
                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleInventoryTransactionReportSubItems}>
                                        <Archive className="icon me-2" />Transaction Report
                                    </ListGroup.Item>
                                    {showInventoryTransactionReportSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={toggleTransactionAccession}>
                                                <PlusCircle className="icon me-2" />Accession
                                            </ListGroup.Item>
                                            {showTransactionAccession && (
                                                <>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleAccession(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Accession
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleAccessionStatus(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Accession Status
                                                    </ListGroup.Item>
                                                </>
                                            )}
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={toggleTransactionIssue}>
                                                <PlusCircle className="icon me-2" />Issue
                                            </ListGroup.Item>
                                            {showTransactionIssue && (
                                                <>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleTransactionIssue1(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 1
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleTransactionIssue2(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 2
                                                    </ListGroup.Item>
                                                </>
                                            )}



                                        </div>
                                    )}

                                    {/* Master */}
                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleInventoryMasterSubItems}>
                                        <Archive className="icon me-2" /> Inventory Master
                                    </ListGroup.Item>
                                    {showInventoryMasterSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookName(); setShowSidebar(false); }}>
                                                <Book className="me-2" /> Book
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookType(); setShowSidebar(false); }}>
                                                <Bookshelf className="me-2" /> Book Types
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookLanguages(); setShowSidebar(false); }}>
                                                <Globe className="me-2" /> Book Languages
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookAuthor(); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Book Author
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookPublication(); setShowSidebar(false); }}>
                                                <BookHalf className="me-2" /> Book Publication
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    {/* report master*/}
                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleInventoryMasterReportSubItems}>
                                        <Archive className="icon me-2" />Master Report
                                    </ListGroup.Item>
                                    {showInventoryMasterReportSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={toggleIssues}>
                                                <PlusCircle className="icon me-2" /> Issue Report
                                            </ListGroup.Item>

                                            {showIssues && (
                                                <>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleMasterIssue1(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 1
                                                    </ListGroup.Item>
                                                    <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleMasterIssue2(); setShowSidebar(false); }}>
                                                        <ExclamationTriangleFill className="icon me-2" /> Issue 2
                                                    </ListGroup.Item>
                                                </>
                                            )}

                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleMemberReport(); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 1
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleBookReport(); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 2
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleOnlyDateReport(); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 3
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleOnlyMemberReport(); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 4
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handleOnlyBookReport(); setShowSidebar(false); }}>
                                                <Arrow90degRight className="icon me-2" /> Pattern 5
                                            </ListGroup.Item>

                                        </div>
                                    )}

                                    {/* Account */}
                                    <ListGroup.Item className="admin-general-icon mt-3" action onClick={toggleAccountSubItems}>
                                        <Archive className="icon me-2" /> Account
                                    </ListGroup.Item>
                                    {showAccountSubItems && (
                                        <div className='ms-2'>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { handlePurchaser(); setShowSidebar(false); }}>
                                                <PersonFill className="me-2" /> Purchaser
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleMemberFees(); setShowSidebar(false); }}>
                                                <CurrencyDollar className="me-2" /> Membership Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleMonthlyMemberFees(); setShowSidebar(false); }}>
                                                <Calendar className="me-2" />Monthly Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleLibararyFees(); setShowSidebar(false); }}>
                                                <Book className="me-2" /> Libarary Fees
                                            </ListGroup.Item>
                                            <ListGroup.Item className="sub-icon mt-1" action onClick={() => { hendleConfig(); setShowSidebar(false); }}>
                                                <Gear className="me-2" /> Config
                                            </ListGroup.Item>
                                        </div>
                                    )}

                                    <ListGroup.Item className="admin-general-icon mt-3 mb-2" action onClick={toggleAdminSubItems}>
                                        <Archive className="icon me-2" /> Admin
                                    </ListGroup.Item>
                                    {showAdminSubItems && (
                                        <div className='ms-2'>
                                            {/* <ListGroup.Item className="sub-icon mt-2" action>
                                                <PersonCircle className="icon me-2" />Admin
                                            </ListGroup.Item> */}
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

                    {memberReport && <MemberReport />}
                    {bookNames && <BookReport />}
                    {onlyDate && <OnlyDate />}
                    {onlyMemberName && <OnlyMemberName />}
                    {onlyBookName && <OnlyBookName />}

                    {issueMasterReport1 && <IssueReport1 />}
                    {issueMasterReport2 && <IssueReport2 />}

                    {accessionReport && <Accession />}
                    {accessionStatusReport && <AccessionStatus />}
                    {issueTransactionReport1 && <IssueTransaction1 />}
                    {issueTransactionReport2 && <IssueTransaction2 />}


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

