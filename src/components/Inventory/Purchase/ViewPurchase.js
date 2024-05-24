/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PencilSquare, Trash, Eye, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import PurchaseDetails from './PurchaseDetails';

import '../InventoryCSS/PurchaseBookDashboardData.css'

const ViewPurchase = () => {
    //get 
    const [purchases, setPurchases] = useState([]);
    //add purchase in another page go
    const [showAddPurchase, setShowAddPurchase] = useState(false);
    //edit  
    const [showModal, setShowModal] = useState(false);
    //delete function
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    //edit and delete
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    //view
    const [viewPurchaseModal, setViewPurchaseModal] = useState(false);

    //discount  and gst
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [gstPercentage, setGstPercentage] = useState("");

    //get books
    const [bookName, setBookName] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [rowBooks, setRowBooks] = useState("");

    //auth
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const { username, accessToken } = useAuth();


    // back and submit another page 
    const handlePurchaseSubmit = () => {
        setShowAddPurchase(false);
        fetchPurchases();
    };

    const handleBackButtonClick = () => {
        setShowAddPurchase(false);
    };

    //get purchase
    const fetchPurchases = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/stock`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching purchases: ${response.statusText}`);
            }
            const data = await response.json();
            setPurchases(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching purchases. Please try again later.');
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, [username, accessToken]);

    //edit purchase
    // const handleEditClick = (purchase) => {
    //     const updatedPurchase = {
    //         ...purchase,
    //         purchaseDetails: purchase.purchaseDetails.filter(detail => !detail.deleted)
    //     };
    //     setSelectedPurchase(updatedPurchase);
    //     setShowModal(true);
    //     setDiscountPercentage(purchase.discountPercent || "");
    //     setGstPercentage(purchase.gstPercent || "");
    // };
    const handleEditClick = (purchase) => {
        setSelectedPurchase(purchase);
        setShowModal(true);
        setDiscountPercentage(purchase.discountPercent || "");
        setGstPercentage(purchase.gstPercent || "");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setViewPurchaseModal(false);
    }

    //edit api
    const handleEditPurchase = async (e) => {
        const payload = {
            invoiceNo: selectedPurchase.invoiceNo,
            invoiceDate: selectedPurchase.invoiceDate,
            billTotal: Number(selectedPurchase.billTotal),
            discountPercent: discountPercentage,
            discountAmount: parseFloat(selectedPurchase.discountAmount),
            totalAfterDiscount: parseFloat(selectedPurchase.totalAfterDiscount),
            gstPercent: gstPercentage,
            gstAmount: parseFloat(selectedPurchase.gstAmount),
            grandTotal: parseFloat(selectedPurchase.grandTotal),
            ledgerId: selectedPurchase.ledgerId,
            stockDetails: selectedPurchase.stockDetails.map(detail => ({
                bookIdF: detail.bookId,
                bookQty: parseInt(detail.bookQty),
                bookRate: parseFloat(detail.bookRate),
                bookAmount: parseFloat(detail.bookAmount)
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/stock/${selectedPurchase.stockId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseJson = await response.json();
            console.log('Success:', responseJson);
            toast.success('Purchase saved successfully.');
            fetchPurchases();
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving purchase. Please try again later.');
        }
    };

    // Handle input changes in the edit modal, including book names and other fields
    const handleInputChange = (e, field, index) => {
        let value = e.target.value;

        if (field === 'invoiceDate') {
            value = formatDateToISO(value);
        }

        if (index !== undefined) {
            const updatedDetails = [...selectedPurchase.stockDetails];
            if (field === 'bookQty' || field === 'bookRate') {
                updatedDetails[index][field] = parseInt(value);
                updatedDetails[index].bookAmount = updatedDetails[index].bookRate * updatedDetails[index].bookQty;
            } else if (field === 'bookName') {
                const selectedBook = bookName.find(book => book.bookName === value);
                if (updatedDetails[index].bookIdF) {
                    updatedDetails[index].bookIdF.bookId = selectedBook ? selectedBook.bookId : null;
                    updatedDetails[index].bookIdF.bookName = value;
                } else {
                    updatedDetails[index].bookIdF = {
                        bookId: selectedBook ? selectedBook.bookId : null,
                        bookName: value
                    };
                }
            } else {
                updatedDetails[index][field] = value;
            }
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                stockDetails: updatedDetails
            }));
        } else {
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                [field]: value
            }));
        }
    };


    const formatDateToISO = (dateString) => {
        if (!dateString) return '';
        const localDate = new Date(dateString);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // // claculation in float datatype
    // const formatNumber = (number) => {
    //     return parseFloat(number.toFixed(2)).toString();
    // };

    // Calculate the total bill amount
    const calculateBillTotal = (details) => {
        let allTotal = 0;
        details.forEach(detail => {
            if (detail.bookQty && detail.bookRate) {
                allTotal += parseFloat(detail.bookQty) * parseFloat(detail.bookRate);
            }
        });
        return Math.floor(allTotal);
        // return formatNumber(allTotal);
    };

    // Calculate the discount amount
    const calculateDiscount = (details) => {
        if (discountPercentage === "") return "0.00";
        const billTotal = parseFloat(calculateBillTotal(details));
        const discountAmount = billTotal * (parseFloat(discountPercentage / 100));
        return Math.floor(discountAmount);
        // return formatNumber(discountAmount);
    };

    // Calculate the total after discount
    const calculateTotalAfterDiscount = (details) => {
        const billTotal = parseFloat(calculateBillTotal(details));
        const totalAfterDiscount = billTotal - parseFloat(calculateDiscount(details));
        return Math.floor(totalAfterDiscount);
        // return formatNumber(totalAfterDiscount);
    };

    // Calculate GST amount
    const calculateGst = (details) => {
        if (gstPercentage === "") return "0.00";
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(details));
        const gstAmount = totalAfterDiscount * (parseFloat(gstPercentage) / 100);
        return Math.floor(gstAmount);
        // return formatNumber(gstAmount);
    };

    // Calculate the grand total
    const calculateGrandTotal = (details) => {
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(details));
        const grandTotal = totalAfterDiscount + parseFloat(calculateGst(details));
        return Math.floor(grandTotal);
        // return formatNumber(grandTotal);
    };


    //change discount and gst
    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setDiscountPercentage("");
        } else {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                setDiscountPercentage(numericValue);
            }
        }
        recalculateValues();
    };
    
    const handleGstChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setGstPercentage("");
        } else {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                setGstPercentage(numericValue);
            }
        }
        recalculateValues();
    };

    //recalculate value
    const recalculateValues = () => {
        if (selectedPurchase) {
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                discountAmount: calculateDiscount(prevPurchase.stockDetails),
                gstAmount: calculateGst(prevPurchase.stockDetails),
                totalAfterDiscount: calculateTotalAfterDiscount(prevPurchase.stockDetails),
                grandTotal: calculateGrandTotal(prevPurchase.stockDetails),
                billTotal: calculateBillTotal(prevPurchase.stockDetails)
            }));
        }
    };

    useEffect(() => {
        recalculateValues();
    }, [discountPercentage, gstPercentage, selectedPurchase]);
    //end edit purchase


    //delete function
    const handleDeleteClick = (purchase) => {
        setSelectedPurchase(purchase);
        setShowDeleteConfirmation(true);
    };

    //delete api
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/stock/${selectedPurchase.stockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error deleting purchase: ${response.statusText}`);
            }
            toast.success('Purchase deleted successfully.');
            fetchPurchases();
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
            toast.error('Error deleting purchase. Please try again later.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };


    // book edit under edit book name  change input dropdown
    const handleBookChangeForRow = (index, event) => {
        const name = event.target.value;
        const selectedBook = bookName.find(book => book.bookName === name);
        const updatedRowBooks = [...rowBooks];

        if (selectedBook) {
            updatedRowBooks[index] = { ...updatedRowBooks[index], bookId: selectedBook.bookId };
            updatedRowBooks[index].bookName = name;
        } else {
            updatedRowBooks[index] = { ...updatedRowBooks[index], bookId: null };
            updatedRowBooks[index].bookName = name;
        }
        setRowBooks(updatedRowBooks);
    };

    // Filtered book names based on selectedBooks
    const filteredBookNamesForRow = (rowIndex) => {
        return bookName.filter(book =>
            !selectedBooks.includes(book.bookId) ||
            selectedBooks[rowIndex] === book.bookId
        );
    };

    //get book
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching books: ${response.statusText}`);
            }
            const data = await response.json();
            setBookName(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching books. Please try again later.');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);


    //add row under edit
    const addRow = () => {
        const newRow = {
            bookIdF: {
                bookId: null,
                bookName: '',
            },
            bookQty: '',
            bookRate: '',
            bookAmount: ''
        };
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            stockDetails: [...prevPurchase.stockDetails, newRow]
        }));
    };


    //delete row under edit
    const deleteRow = (index) => {
        const updatedDetails = selectedPurchase.stockDetails.filter((_, i) => i !== index);
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            stockDetails: updatedDetails,
            purchase: updatedDetails

        }));
    };

    //view purchase
    const handleViewClick = (purchase) => {
        setSelectedPurchase(purchase);
        setViewPurchaseModal(true);
        setDiscountPercentage(purchase.discountPercent);
        setGstPercentage(purchase.gstPercent);
    };


    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(purchases.length / perPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // First and last page navigation functions
    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const indexOfLastBookType = currentPage * perPage;
    const indexOfNumber = indexOfLastBookType - perPage;
    const currentData = purchases.slice(indexOfNumber, indexOfLastBookType);



    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                {!showAddPurchase && (
                    <div className='mt-2'>
                        <div className='mt-1'>
                            <Button onClick={() => setShowAddPurchase(true)} className="button-color">
                                Add purchase
                            </Button>
                        </div>
                        <div className="table-responsive table-height mt-4">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Purchaser Name</th>
                                        <th>Invoice No</th>
                                        <th>Invoice Date</th>
                                        <th>Grand Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((purchase, index) => (
                                        <tr key={index}>
                                            <td>{indexOfNumber + index + 1}</td>
                                            {/* <td>{purchase.ledgerIDF?.ledgerName}</td> */}
                                            <td>{purchase.ledgerIDF ? purchase.ledgerIDF.ledgerName : 'N/A'}</td>
                                            <td>{purchase.invoiceNo}</td>
                                            <td>{purchase.invoiceDate}</td>
                                            {/* <td>{new Date(purchase.invoiceDate).toLocaleDateString()}</td> */}
                                            <td>{purchase.grandTotal}</td>
                                            <td>
                                                {/* <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(purchase)} /> */}
                                                <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(purchase)} />
                                                <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(purchase)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="pagination-container">
                            <Button onClick={handleFirstPage} disabled={currentPage === 1}>First Page</Button>
                            <Button onClick={handlePrevPage} disabled={currentPage === 1}> <ChevronLeft /></Button>
                            <div className="pagination-text">Page {currentPage} of {totalPages}</div>
                            <Button onClick={handleNextPage} disabled={currentPage === totalPages}> <ChevronRight /></Button>
                            <Button onClick={handleLastPage} disabled={currentPage === totalPages}>Last Page</Button>
                        </div>
                    </div>
                )}
                {showAddPurchase && (
                    <PurchaseDetails handlePurchaseSubmit={handlePurchaseSubmit} onBackButtonClick={handleBackButtonClick} />
                )}
            </Container>

            {/* Edit Purchase Modal */}
            {selectedPurchase && (
                <Modal show={showModal} onHide={handleCloseModal} centered size='xl'>
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Purchase</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} sm={3} >
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"

                                            value={selectedPurchase.invoiceNo}
                                            onChange={(e) => handleInputChange(e, 'invoiceNo')}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} sm={3}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedPurchase.invoiceDate || ''}
                                            // value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                            onChange={(e) => handleInputChange(e, 'invoiceDate')}
                                            className="custom-date-picker small-input"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} sm={5}>
                                        <Form.Label>Purchaser Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            // value={selectedPurchase.ledgerIDF.ledgerName || ''}
                                            value={selectedPurchase.ledgerIDF ? selectedPurchase.ledgerIDF.ledgerName : 'N/A'}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header sr-size">Sr.No</th>
                                                <th className="table-header book-name-size">Book Name</th>
                                                <th className="table-header quantity-size">Quantity</th>
                                                <th className="table-header rate-size">Rate</th>
                                                <th className="table-header amount-size amount-align">Amount</th>
                                                <th className="table-header action-align">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPurchase.stockDetails.map((detail, index) => (

                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        {/* <Form.Control
                                                        type="text"
                                                        value={detail.bookName}
                                                        onChange={(e) => handleInputChange(e, 'bookName', index)}
                                                    /> */}
                                                        <Form.Group >
                                                            <Form.Control
                                                                as="input"
                                                                list={`bookName-${index}`}
                                                                value={detail.bookIdF ? detail.bookIdF.bookName : ''}
                                                                onChange={(e) => { handleBookChangeForRow(index, e); handleInputChange(e, 'bookName', index) }}
                                                                placeholder="Search or select book name"
                                                            />
                                                            <datalist id={`bookName-${index}`}>
                                                                {filteredBookNamesForRow(index).map((book) => (
                                                                    <option key={book.bookId} value={book.bookName} />
                                                                ))}
                                                            </datalist>
                                                        </Form.Group>
                                                    </td>
                                                    <td>
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={detail.bookQty}
                                                            onChange={(e) => handleInputChange(e, 'bookQty', index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={detail.bookRate}
                                                            onChange={(e) => handleInputChange(e, 'bookRate', index)}
                                                        />
                                                    </td>
                                                    {/* <td className="amount-align">{!isNaN(detail.amount) ? detail.amount : ''}</td> */}
                                                    <td className="amount-align">
                                                        {!isNaN(detail.bookAmount) ? Number(detail.bookAmount).toFixed(2) : ''}
                                                    </td>
                                                    <td>
                                                        <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRow(index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Button onClick={addRow} className="button-color">
                                                        Add Book
                                                    </Button>
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>

                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Bill Total</td>
                                                <td className="amount-align">{selectedPurchase.billTotal}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Discount</td>
                                                <td>
                                                    <div className="discount-container">
                                                        <Form.Control className='right-align discount-input'
                                                            type="number"
                                                            value={discountPercentage}
                                                            onChange={(e) => {
                                                                const newDiscount = parseFloat(e.target.value);
                                                                setDiscountPercentage(newDiscount);
                                                                handleDiscountChange(e);
                                                            }}
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="amount-align">{selectedPurchase.discountAmount}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Total After Discount</td>
                                                <td></td>
                                                <td className="amount-align">{selectedPurchase.totalAfterDiscount}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">GST</td>
                                                <td>
                                                    <div className="gst-container">
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={gstPercentage}
                                                            onChange={(e) => {
                                                                const newGst = parseFloat(e.target.value);
                                                                setGstPercentage(newGst);
                                                                handleGstChange(e);
                                                            }}
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="amount-align">{selectedPurchase.gstAmount}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Grand Total</td>
                                                <td></td>
                                                <td className="amount-align">{selectedPurchase.grandTotal}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleEditPurchase}>
                                Update
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this purchase?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* View Purchase Modal */}
            {selectedPurchase && (
                <Modal show={viewPurchaseModal} onHide={handleCloseModal} centered size='xl'>
                    <div className="bg-light">
                        <Modal.Header closeButton>
                            <Modal.Title>View Purchase</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} sm={3}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedPurchase.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} sm={3}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedPurchase.invoiceDate || ''}
                                            // value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                            readOnly
                                            className="custom-date-picker"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} sm={5}>
                                        <Form.Label>Purchaser Name</Form.Label>
                                        <Form.Control
                                            readOnly
                                            // value={selectedPurchase.ledgerIDF.ledgerName || ''}
                                            value={selectedPurchase.ledgerIDF ? selectedPurchase.ledgerIDF.ledgerName : 'N/A'}
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className="table-header sr-size">Sr.No</th>
                                                <th className="table-header book-name-size">Book Name</th>
                                                <th className="table-header quantity-size">Quantity</th>
                                                <th className="table-header rate-size">Rate</th>
                                                <th className="table-header amount-size amount-align">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPurchase.stockDetails.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={detail.bookIdF ? detail.bookIdF.bookName : ''}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={detail.bookQty}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={detail.bookRate}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="amount-align">{!isNaN(detail.bookAmount) ? detail.bookAmount : ''}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td >Bill Total</td>
                                                <td className="amount-align">{selectedPurchase.billTotal}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Discount</td>
                                                <td>
                                                    <div className="discount-container">
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={selectedPurchase.discountPercent}
                                                            readOnly
                                                        />
                                                        <span>%</span>
                                                    </div>


                                                </td>
                                                <td className="amount-align">{selectedPurchase.discountAmount}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Total After Discount</td>
                                                <td></td>
                                                <td className="amount-align">{selectedPurchase.totalAfterDiscount}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">GST</td>
                                                <td>
                                                    <div className="gst-container">
                                                        <Form.Control className="right-align"
                                                            type="number"
                                                            value={selectedPurchase.gstPercent}
                                                            readOnly
                                                        />
                                                        <span>%</span>
                                                    </div>

                                                </td>
                                                <td className="amount-align">{selectedPurchase.gstAmount}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Grand Total</td>
                                                <td></td>
                                                <td className="amount-align">{selectedPurchase.grandTotal}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ViewPurchase;
