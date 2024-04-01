import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Dropdown, Form, Button, Row, Col, Table } from 'react-bootstrap';
import Login from '../assets/Login.webp';



const HomePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [partyName, setPartyName] = useState('');
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ bookName: '', quantity: '', rate: '', amount: '' })));
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(0);
    const BaseURL = process.env.REACT_APP_BASE_URL;

    //get username and access token
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
        }
    }, []);

    //handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('You have been logged out.');
        navigate('/');
    };

    //show token  and hide token
    const handleViewToken = () => {
        setShowToken(!showToken);
    };


    //bill total
    const calculateBillTotal = () => {
        let allTotal = 0;
        rows.forEach(row => {
            if (row.quantity && row.rate) {
                allTotal += parseFloat(row.quantity) * parseFloat(row.rate); //allTotal + =quantity*rate
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

    // //show discount price
    const calculateDiscount = () => {
        const billTotal = calculateBillTotal();
        const discountAmount = billTotal * (discountPercentage / 100); //Discount amount=allTotal * (dicount in % / 100)
        return Math.floor(discountAmount);
    };

    //calculate after discount
    const calculateTotalAfterDiscount = () => {
        const billTotal = calculateBillTotal();
        const totalAfterDiscount = billTotal - (billTotal * (discountPercentage / 100)); //total after discount = total bill - discount amount
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
        const gstAmount = totalAfterDiscount * (gstPercentage / 100); //gst amount = total after discount * (gst % / 100)
        return Math.floor(gstAmount);
    };

    //grand total
    const calculateGrandTotal = () => {
        const totalAfterDiscount = calculateTotalAfterDiscount();
        const grandTotal = totalAfterDiscount + (totalAfterDiscount * (gstPercentage / 100)); //grant toatl = total after discount + gst amount
        return Math.floor(grandTotal);
    };

    //add row
    const addRow = () => {
        setRows([...rows, { bookName: '', quantity: '', rate: '', amount: '' }]);
    };


    // invoice number
    const initializeInvoiceNumber = () => {
        const lastInvoiceNumber = localStorage.getItem('lastInvoiceNumber');
        if (!lastInvoiceNumber) return 'TIN1';

        const match = lastInvoiceNumber.match(/(TIN)(\d+)/i);
        if (match && match.length === 3) {
            const prefix = match[1];
            const currentNumber = parseInt(match[2], 10) + 1;
            return `${prefix}${currentNumber}`;
        }
        return 'TIN1';
    };
    const [invoiceNumber, setInvoiceNumber] = useState(initializeInvoiceNumber);

    //handle submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!partyName.trim()) {
            event.preventDefault();
            toast.error('Please fill party name !');
            return;
        }
        const isBookFilled = rows.some(row => row.bookName.trim() !== '');
        if (!isBookFilled) {
            event.preventDefault();
            toast.error('Please enter at least one book.');
            return;
        }
        const filteredRows = rows.filter(row => row.bookName.trim() !== '' && row.quantity.trim() !== '' && row.rate.trim() !== '');

        const payload = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            partyName: partyName,
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
        console.log("data", payload);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Access token not found. Please log in again.');
                return;
            }
            const response = await fetch(`${BaseURL}/api/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const responseData = await response.json();
                toast.success(responseData.message);
                localStorage.setItem('lastInvoiceNumber', invoiceNumber);
                window.location.reload();
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


    // get today date 
    const [invoiceDate, setInvoiceDate] = useState(getTodayDate());

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return `${year}-${month}-${day}`;
    }

    // Function to handle invoice date change
    const handleInvoiceDateChange = (e) => {
        setInvoiceDate(e.target.value);
    };

    //delete row
    const deleteRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows);
    };
   
    return (
        <div className='nav-bar'>
            <Navbar bg="dark" variant="dark" expand="lg">
                <div className="container-fluid">
                    <Navbar.Brand href="#">Registration and Login System</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarSupportedContent" />
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto"></Nav>
                        <Dropdown className="custom-dropdown-toggle">
                            <Dropdown.Toggle variant="custom" id="dropdown-basic">
                                <img src={Login} className="loginregistericon" alt="Ledger Estate" height="25" width="25" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ right: 0, left: 'auto' }}>
                                <Dropdown.Item disabled>{username}</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </div>
            </Navbar>

            <button onClick={handleViewToken} style={{ backgroundColor: 'cadetblue', color: 'white', border: 'none', padding: '10px', width: '100%' }}>
                {showToken ? 'Hide Token' : 'Show Token'}
                {showToken && (
                    <div>
                        Access Token: {accessToken}
                    </div>
                )}
            </button>

            <Container>
                <Row className="justify-content-md-center mt-5">
                    <Col xs={12} md={10} lg={10}>

                        <div className="border-dark p-2" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}>
                            <div className="text-center">
                                <h3 className="heading-with-line">PURCHASE</h3>
                            </div>
                        </div>

                        <div className="border-dark p-4" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' }}>
                            <Form onSubmit={handleSubmit}>

                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={invoiceNumber}
                                            readOnly
                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Invoice Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={invoiceDate}
                                            min={getTodayDate()}
                                            max={getTodayDate()}
                                            onChange={handleInvoiceDateChange}
                                            className="custom-date-picker"
                                        />
                                    </Form.Group>

                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} sm={6}>
                                        <Form.Label>Party Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter party name"
                                            value={partyName}
                                            onChange={(e) => setPartyName(e.target.value)}

                                        />
                                    </Form.Group>
                                </Row>

                                <Table striped bordered hover>
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
                                                    placeholder="Enter GST (%)"
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
                                            <td>Grand Total:</td>
                                            <td>{calculateGrandTotal()}</td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <div style={{ marginTop: '10px' }} className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <Button variant="primary" onClick={addRow} style={{ marginRight: '10px' }}>
                                            Add Row
                                        </Button>

                                        {rows.length > 5 &&
                                            <Button variant="danger" onClick={() => deleteRow(rows.length - 1)}>
                                                Delete Row
                                            </Button>
                                        }
                                    </div>

                                    <Button variant="success" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div className="container">
                <div className="row"></div>
            </div>
        </div>
    );
};

export default HomePage;
