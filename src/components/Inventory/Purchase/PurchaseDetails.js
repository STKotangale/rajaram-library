/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';

import { useAuth } from '../../Auth/AuthProvider';

const PurchaseDetails = ({ onSubmit, onBackButtonClick }) => {

    const BaseURL = process.env.REACT_APP_BASE_URL;
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '', quantity: '', rate: '', amount: '' })));
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(0);
    // Function to handle search query change
    const [searchQuery] = useState('');
    //get ledger name
    const [ledgerName, setLedgerName] = useState([]);
    const [selectedLedgerName, setSelectedLedgerName] = useState("");
    const [selectedLedgerId, setSelectedLedgerId] = useState('');
    // get  date 
    const [invoiceDate, setInvoiceDate] = useState();
    const [invoiceNumber, setInvoiceNumber] = useState(() => {
        return sessionStorage.getItem('invoiceNumber') || 'TIN1';
    });

    const { username, accessToken } = useAuth();

    //get username and access token
    useEffect(() => {
        sessionStorage.setItem('invoiceNumber', invoiceNumber);

    }, [username, accessToken, invoiceNumber]);

    // useEffect(() => {
    // }, [invoiceNumber]);

    //ledger name
    const handleLedgerChange = (event) => {
        const name = event.target.value;
        setSelectedLedgerName(name);
        const ledger = ledgerName.find(l => l.ledgerName === name);
        if (ledger) {
            setSelectedLedgerId(ledger.ledgerId);
        } else {
            setSelectedLedgerId("");
        }
    };

    useEffect(() => {
        const fetchLedgerNames = async () => {
            try {
                if (!accessToken) {
                    throw new Error('Access token not found');
                }
                const response = await fetch(`${BaseURL}/api/ledger/list`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized - Access token may be invalid or expired');
                    } else {
                        throw new Error(`Failed to fetch party names - ${response.status}`);
                    }
                }
                const ledgerNameId = await response.json();
                setLedgerName(ledgerNameId);
            } catch (error) {
                console.error('Error fetching party names:', error.message);
            }
        };
        fetchLedgerNames();
    }, []);

    //bill total
    const calculateBillTotal = () => {
        let allTotal = 0;
        rows.forEach(row => {
            if (row.quantity && row.rate) {
                allTotal += parseFloat(row.quantity) * parseFloat(row.rate);
            }
        });
        return allTotal;
    };

    //discount change
    const handleDiscountChange = (e) => {
        const value = e.target.value.trim();
        if (value === '' || !isNaN(parseFloat(value))) {
            setDiscountPercentage(value === '' ? '' : parseFloat(value));
        }
    };

    //show discount price
    const calculateDiscount = () => {
        const billTotal = calculateBillTotal();
        const discountAmount = billTotal * (discountPercentage / 100);
        return Math.floor(discountAmount);
    };

    //calculate after discount
    const calculateTotalAfterDiscount = () => {
        const billTotal = calculateBillTotal();
        const totalAfterDiscount = billTotal - (billTotal * (discountPercentage / 100));
        return Math.floor(totalAfterDiscount);
    };


    //gst  
    const handleGstChange = (e) => {
        const value = e.target.value.trim();
        if (value === '' || !isNaN(parseFloat(value))) {
            setGstPercentage(value === '' ? '' : parseFloat(value));
        }
    };

    const calculateGst = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount();
        const gstAmount = totalAfterDiscount * (gstPercentage / 100);
        return Math.floor(gstAmount);
    };

    //grand total
    const calculateGrandTotal = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount();
        const grandTotal = totalAfterDiscount + (totalAfterDiscount * (gstPercentage / 100));
        return Math.floor(grandTotal);
    };

    //add row
    const addRow = () => {
        setRows([...rows, { bookName: '', quantity: '', rate: '', amount: '' }]);
    };

    //handle submit

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedLedgerName.trim()) {
            toast.error('Please select ledger name !');
            return;
        }
        const isBookFilled = rows.some(row => row.bookName.trim() !== '');
        if (!isBookFilled) {
            toast.error('Please enter at least one book.');
            return;
        }
        const filteredRows = rows.filter(row => row.bookName.trim() !== '' && row.quantity.trim() !== '' && row.rate.trim() !== '');
        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            ledgerId: selectedLedgerId,
            billTotal: calculateBillTotal(),
            discountPercent: discountPercentage,
            discountAmount: calculateDiscount(),
            totalAfterDiscount: calculateTotalAfterDiscount(),
            gstPercent: gstPercentage,
            gstAmount: calculateGst(),
            grandTotal: calculateGrandTotal(),
            purchaseDetails: filteredRows.map(row => ({
                bookName: row.bookName,
                qty: parseFloat(row.quantity),
                rate: parseFloat(row.rate),
                amount: row.quantity && row.rate ? parseFloat(row.quantity) * parseFloat(row.rate) : 0
            }))
        };
        try {
            if (!accessToken) {
                toast.error('Access token not found. Please log in again.');
                return;
            }
            const response = await fetch(`${BaseURL}/api/purchase`, {
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
                onSubmit();

                // // Increment the invoice number
                // const numberPart = parseInt(invoiceNumber.substring(3)) + 1;
                // setInvoiceNumber(`TIN${numberPart}`);

                // Reset form fields
                setInvoiceDate('');
                setSelectedLedgerId('');
                setDiscountPercentage(0);
                setGstPercentage(0);
                setSelectedLedgerName('');
                const resetRows = rows.map(row => ({
                    ...row,
                    bookName: '',
                    quantity: '',
                    rate: '',
                }));
                setRows(resetRows);
            }
        } catch (error) {
            console.error('Error submitting invoice:', error);
            toast.error('Service Temporarily Unavailable or Error submitting invoice. Please try again.');
            console.error('Error message:', error.message);
        }
    };

    //handle change
    const handleRowChange = (index, e) => {
        const { name, value } = e.target;
        const newRows = [...rows];
        newRows[index][name] = value;
        setRows(newRows);
    };

    //  invoice date change
    const handleInvoiceDateChange = (e) => {
        setInvoiceDate(e.target.value);
    };

    //delete row
    const deleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };

    // fillter name
    const filteredLedgerName = ledgerName.filter(ledger =>
        ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="main-content">
            <Container>
                <Row className="purchase-main">
                    <Col xs={12} md={10} lg={10}>
                        <h1 className="mt-4">Purchase</h1>
                        <div className="mt-5 border-style-1">
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={invoiceDate}
                                            onChange={handleInvoiceDateChange}
                                            className="custom-date-picker"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Ledger Name</Form.Label>
                                        <Form.Control
                                            as="input"
                                            list="ledgerNames"
                                            value={selectedLedgerName}
                                            onChange={handleLedgerChange}
                                            placeholder="Search or select ledger name"
                                        />
                                        <datalist id="ledgerNames">
                                            {filteredLedgerName.map((ledger) => (
                                                <option key={ledger.ledgerId} value={ledger.ledgerName} />
                                            ))}
                                        </datalist>
                                    </Form.Group>
                                </Row>

                                <Table striped bordered hover className="table-bordered-dark mt-5">
                                    <thead>
                                        <tr>
                                            <th className="table-header">Sr.No</th>
                                            <th className="table-header">Book Name</th>
                                            <th className="table-header">No Of Quantity</th>
                                            <th className="table-header">Rate</th>
                                            <th className="table-header">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        name="bookName"
                                                        value={row.bookName}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="quantity"
                                                        value={row.quantity}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        name="rate"
                                                        value={row.rate}
                                                        onChange={(e) => handleRowChange(index, e)}
                                                    />
                                                </td>
                                                <td>
                                                    {(row.quantity && row.rate) ? (parseFloat(row.quantity) * parseFloat(row.rate)) : ''}

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
                                            <td>
                                                <Button className="button-color" onClick={() => deleteRow(rows.length - 1)}>
                                                    Delete Book
                                                </Button>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Bill Total</td>
                                            <td>{calculateBillTotal()}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>Discount</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter discount"
                                                    value={discountPercentage}
                                                    onChange={handleDiscountChange}
                                                />
                                            </td>
                                            <td>{calculateDiscount()}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>Total After Discount</td>
                                            <td></td>
                                            <td>{calculateTotalAfterDiscount()}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>GST</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter GST"
                                                    value={gstPercentage}
                                                    onChange={handleGstChange}
                                                />
                                            </td>
                                            <td>{calculateGst()}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Grand Total</td>
                                            <td>{calculateGrandTotal()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div className="d-flex justify-content-end">
                                    <div className='ms-3'>
                                        <Button onClick={onBackButtonClick}>Back</Button>
                                    </div>
                                    <div className='ms-3'>
                                    <Button className="button-color" type="submit">
                                        Submit
                                    </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PurchaseDetails;
