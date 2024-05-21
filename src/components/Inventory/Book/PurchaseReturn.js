/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryCSS/PurchaseBookDashboardData.css';

const PurchaseReturn = () => {
    const [purchaseReturn, setPurchaseReturn] = useState([]);
    const [purchaserName, setPurchaserName] = useState([]);
    const [selectedPurchaserId, setSelectedPurchaserId] = useState(null);
    const [books, setBooks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '', amount: '', details: [] })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [discount, setDiscount] = useState('');
    const [gst, setGst] = useState('');

    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        fetchPurchaseReturn();
        fetchPurchaserName();
        fetchAllBooks();
    }, [username, accessToken]);

    const fetchPurchaseReturn = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/purchase-return-all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching purchase return: ${response.statusText}`);
            }
            const data = await response.json();
            setPurchaseReturn(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching purchase return. Please try again later.');
        }
    };

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
            console.error("Failed to fetch purchaser:", error);
            toast.error('Failed to load purchaser. Please try again later.');
        }
    };

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
        const discountValue = parseFloat(discount) || 0;
        return (total - (total * (discountValue / 100))).toFixed(2);
    };

    const calculateTotalAfterGst = (total) => {
        const gstValue = parseFloat(gst) || 0;
        return (total + (total * (gstValue / 100))).toFixed(2);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            invoiceDate: invoiceDate,
            ledgerId: Number(selectedPurchaserId),
            billTotal: billTotal,
            grandTotal: grandTotal,
            discount: parseFloat(discount) || 0,
            totalAfterDiscount: totalAfterDiscount,
            bookDetails: bookDetailsPayload
        };

        try {
            const response = await fetch(`${BaseURL}/api/issue/purchase-return`, {
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
                fetchPurchaseReturn();
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

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Purchase Return
                        </Button>
                    </div>
                    <div className="table-responsive">
                        {/* <Table striped bordered hover className='mt-4'>
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
                                {purchaseReturn.map((purchaser, index) => (
                                    <tr key={purchaser.purchaserId}>
                                        <td>{index + 1}</td>
                                        <td>{purchaser.ledgerName}</td>
                                        <td>{purchaser.invoiceNo}</td>
                                        <td>{purchaser.invoiceDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table> */}
                    </div>
                </div>
            </Container>

            <Modal centered show={showAddModal} onHide={() => setShowAddModal(false)} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Purchase Return</Modal.Title>
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
                                            <th className="table-header purchase-copy-size">Purchase Copy No.</th>
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
                                                        <option value="">Select a copy no</option>
                                                        {row.details && row.details.map(detail => (
                                                            <option key={detail.purchaseCopyNo} value={detail.purchaseCopyNo}>
                                                                {detail.purchaseCopyNo}
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
                                                        value={discount}
                                                        onChange={(e) => setDiscount(e.target.value)}
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </td>
                                            <td className="amount-align">{isNaN(billTotal * (parseFloat(discount) / 100)) ? "0.00" : (billTotal * (parseFloat(discount) / 100)).toFixed(2)}</td>
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
                                                        value={gst}
                                                        onChange={(e) => setGst(e.target.value)}
                                                    />
                                                    <span>%</span>
                                                </div>
                                            </td>
                                            <td className="amount-align">{isNaN(totalAfterDiscount * (parseFloat(gst) / 100)) ? "0.00" : (totalAfterDiscount * (parseFloat(gst) / 100)).toFixed(2)}</td>
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
                            Add
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
};

export default PurchaseReturn;
