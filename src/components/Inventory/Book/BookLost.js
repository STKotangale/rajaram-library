/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';


// Utility function to convert date to dd-mm-yyyy format
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookLost = () => {
    //get  book lost
    const [bookLost, setBookLost] = useState([]);
    //get purchaser name
    const [purchaserName, setPurchaserName] = useState([]);
    const [selectedPurchaserId, setSelectedPurchaserId] = useState(null);
    //get all books
    const [books, setBooks] = useState([]);
    //add 
    const [showAddModal, setShowAddModal] = useState(false);
    //selected book get data
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '', amount: '', details: [] })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [gstPercent, setGstPercent] = useState('');
    //delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStockId, setDeleteStockId] = useState(null);
    //view
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState([]);
    //auth
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchBookLost();
        fetchPurchaserName();
        fetchAllBooks();
    }, [username, accessToken]);

    //get book lost
    const fetchBookLost = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/book-lost-all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book lost : ${response.statusText}`);
            }
            const data = await response.json();
            const groupedData = groupBy(data, 'stock_id');
            setBookLost(groupedData);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book lost . Please try again later.');
        }
    };

    //get purchaser name
    const fetchPurchaserName = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/ledger`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setPurchaserName(data.data);
        } catch (error) {
            console.error("Failed to fetch purchaser name:", error);
            toast.error('Failed to load purchaser name. Please try again later.');
        }
    };

    //get all books
    const fetchAllBooks = async () => {
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
            setBooks(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching books. Please try again later.');
        }
    };

    //selected book get data
    const fetchSelectedBookDetails = async (bookName, index) => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/details/${bookName}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book details: ${response.statusText}`);
            }
            const data = await response.json();
            const updatedRows = [...rows];
            updatedRows[index].details = data.details;
            setRows(updatedRows);
        } catch (error) {
            console.error('Error fetching book details:', error.message);
            toast.error('Error fetching book details. Please try again later.');
        }
    };

    //add function
    const handleBookNameChange = (index, bookName) => {
        const updatedRows = [...rows];
        updatedRows[index].bookName = bookName;
        updatedRows[index].purchaseCopyNo = '';
        updatedRows[index].amount = '';
        updatedRows[index].details = [];
        setRows(updatedRows);

        if (bookName) {
            fetchSelectedBookDetails(bookName, index);
        }
    };

    const handlePurchaseCopyChange = (index, purchaseCopyNo) => {
        const selectedDetail = rows[index].details.find(detail => detail.purchaseCopyNo === Number(purchaseCopyNo));
        const updatedRows = [...rows];
        updatedRows[index].purchaseCopyNo = purchaseCopyNo;
        updatedRows[index].bookDetailId = selectedDetail ? selectedDetail.bookDetailId : null;
        updatedRows[index].amount = selectedDetail ? selectedDetail.bookRate.toFixed(2) : '0.00';
        setRows(updatedRows);
    };

    const addRowAdd = () => {
        setRows([...rows, { bookId: '', bookName: '', purchaseCopyNo: '', amount: '', details: [] }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const calculateBillTotal = () => {
        return rows.reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toFixed(2);
    };

    const calculateTotalAfterDiscount = (total) => {
        const discountValue = parseFloat(discountPercent) || 0;
        return (total - (total * (discountValue / 100))).toFixed(2);
    };

    const calculateTotalAfterGst = (total) => {
        const gstValue = parseFloat(gstPercent) || 0;
        return (total + (total * (gstValue / 100))).toFixed(2);
    };


    // Reset form fields
    const resetFormFields = () => {
        setInvoiceNumber('');
        setInvoiceDate('');
        setSelectedPurchaserId(null);
        setDiscountPercent('');
        setGstPercent('');
        setRows(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '', amount: '', details: [] })));
    };

    //post api
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formattedFromDate = formatDateToDDMMYYYY(invoiceDate);

        const bookDetailsPayload = rows
            .filter(row => row.bookName && row.purchaseCopyNo)
            .map(row => ({
                bookdetailId: row.bookDetailId,
                amount: parseFloat(row.amount)
            }));

        const billTotal = parseFloat(calculateBillTotal());
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(billTotal));
        const grandTotal = parseFloat(calculateTotalAfterGst(totalAfterDiscount));

        const payload = {
            invoiceNO: invoiceNumber,
            invoiceDate: formattedFromDate,
            ledgerId: Number(selectedPurchaserId),
            billTotal: billTotal,
            grandTotal: grandTotal,
            discountPercent: parseFloat(discountPercent) || 0,
            discountAmount:calculateDiscountAmount(),
            gstPercent: parseFloat(gstPercent) || 0,
            gstAmount:calculateGstAmount(),
            totalAfterDiscount: totalAfterDiscount,
            bookDetails: bookDetailsPayload
        };

        try {
            const response = await fetch(`${BaseURL}/api/issue/book-lost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const purchaseDetails = await response.json();
                toast.success(purchaseDetails.message);
                setShowAddModal(false);
                resetFormFields();
                fetchBookLost();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Error submitting invoice. Please try again.');
        }
    };

    const billTotal = parseFloat(calculateBillTotal());
    const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(billTotal));
    const grandTotal = parseFloat(calculateTotalAfterGst(totalAfterDiscount));


      //show discount price
      const calculateDiscountAmount = () => {
        const billTotal = calculateBillTotal();
        const discountAmount = billTotal * (discountPercent / 100);
        return Math.floor(discountAmount);
    };

    const calculateGstAmount = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount(billTotal);
        const gstAmount = totalAfterDiscount * (gstPercent / 100);
        return Math.floor(gstAmount);
    };


    //show table in stock_id
    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };



    //delete
    const handleDelete = (stockId) => {
        setDeleteStockId(stockId);
        setShowDeleteModal(true);
    };

    //delete api
    const confirmDelete = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/${deleteStockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                toast.success('Book lost  deleted successfully.');
                setShowDeleteModal(false);
                fetchBookLost();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error deleting book lost:', error);
            toast.error('Error deleting book lost . Please try again.');
        }
    };

    //view
    const handleViewDetails = (items) => {
        setSelectedRowDetails(items);
        setShowDetailsModal(true);
    };

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Lost
                        </Button>
                    </div>
                    <div className="table-responsive">
                        <Table striped bordered hover className='mt-4'>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Purchaser Name</th>
                                    <th>Invoice No</th>
                                    <th>Invoice Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(bookLost).map(([stock_id, items], index) => (
                                    <tr key={stock_id}>
                                        <td>{index + 1}</td>
                                        <td>{items[0].ledgerName}</td>
                                        <td>{items[0].invoiceNo}</td>
                                        <td>{items[0].invoiceDate}</td>
                                        <td>
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewDetails(items)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDelete(stock_id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>


            {/* add modal */}
            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Book Lost</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No.</Form.Label>
                                    <Form.Control
                                        placeholder="Invoice number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Purchaser Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="small-input"
                                        value={selectedPurchaserId || ""}
                                        onChange={(e) => setSelectedPurchaserId(e.target.value)}
                                    >
                                        <option value="">Select a purchaser</option>
                                        {purchaserName.map(purchaser => (
                                            <option key={purchaser.ledgerID} value={purchaser.ledgerID}>
                                                {purchaser.ledgerName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th>Book Name</th>
                                            <th className="table-header purchase-copy-size">Accession No.</th>
                                            <th className="table-header amount-size amount-align">Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={row.bookName}
                                                        onChange={(e) => handleBookNameChange(index, e.target.value)}
                                                    >
                                                        <option value="">Select a book name</option>
                                                        {books.map(book => (
                                                            <option key={book.bookId} value={book.bookName}>
                                                                {book.bookName}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        as="select"
                                                        value={row.purchaseCopyNo}
                                                        onChange={(e) => handlePurchaseCopyChange(index, e.target.value)}
                                                    >
                                                        <option value="">Select accession no</option>
                                                        {row.details && row.details.map(detail => (
                                                            <option key={detail.purchaseCopyNo} value={detail.purchaseCopyNo}>
                                                                {detail.accessionNo}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={row.amount ? row.amount : '0.00'}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => deleteRowAdd(index)} />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td>
                                                <Button onClick={addRowAdd} className="button-color">
                                                    Add Book
                                                </Button>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="right-align">Bill Total</td>
                                            <td className="amount-align">{billTotal.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td className="right-align">Discount</td>
                                            <td>
                                                <div className="input-with-suffix">
                                                    <Form.Control
                                                        className="right-align"
                                                        type="number"
                                                        placeholder="Discount"
                                                        value={discountPercent}
                                                        onChange={(e) => setDiscountPercent(e.target.value)}
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </td>
                                            <td className="amount-align">{calculateDiscountAmount()}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="right-align">Total After Discount</td>
                                            <td className="amount-align">{totalAfterDiscount.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td className="right-align">GST</td>
                                            <td>
                                                <div className="input-with-suffix">
                                                    <Form.Control
                                                        className="right-align"
                                                        type="number"
                                                        placeholder="GST"
                                                        value={gstPercent}
                                                        onChange={(e) => setGstPercent(e.target.value)}
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </td>
                                            <td className="amount-align">{calculateGstAmount()}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td className="right-align">Grand Total</td>
                                            <td className="amount-align">{grandTotal.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* view modal */}
            <Modal centered show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Book Lost Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRowDetails.length > 0 && (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No.</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedRowDetails[0]?.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={selectedRowDetails[0]?.invoiceDate}
                                            className="small-input"
                                            readOnly
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Purchaser Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedRowDetails[0]?.ledgerName}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th className='sr-size'>Sr. No.</th>
                                                <th>Book Name</th>
                                                <th className="table-header purchase-copy-size">Accession No.</th>
                                                <th className="table-header amount-size amount-align">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRowDetails.map((row, index) => (
                                                <tr key={index}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            className="small-input"
                                                            value={row.bookName}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            className="small-input"
                                                            value={row.accessionNo}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={row.book_amount}
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Bill Total</td>
                                                <td className="amount-align">{selectedRowDetails[0]?.billTotal}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td className="right-align">Discount</td>
                                                <td>
                                                    <div className="input-with-suffix">
                                                        <Form.Control
                                                            className="right-align"
                                                            type="number"
                                                            value={selectedRowDetails[0]?.discountPercent}
                                                            readOnly
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="amount-align">{selectedRowDetails[0]?.discountAmount.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td className="right-align">Total After Discount</td>
                                                <td></td>
                                                <td className="amount-align">{selectedRowDetails[0]?.totalAfterDiscount.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td className="right-align">GST</td>
                                                <td>
                                                    <div className="input-with-suffix">
                                                        <Form.Control
                                                            className="right-align"
                                                            type="number"
                                                            value={selectedRowDetails[0]?.gstPercent}
                                                            readOnly
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="amount-align">{(selectedRowDetails[0]?.gstAmount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td className="right-align">Grand Total</td>
                                                <td></td>
                                                <td className="amount-align">{selectedRowDetails[0]?.grandTotal.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            {/* delete modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this book lost?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
                    <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default BookLost;
