/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
// import PurchaseDetails from './PurchaseDetails';

const ViewPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    //edit 
    const [showModal, setShowModal] = useState(false);

    const [discountPercentage, setDiscountPercentage] = useState("");
    const [gstPercentage, setGstPercentage] = useState("");

    //view
    const [viewPurchaseModal, setViewPurchaseModal] = useState(false);

    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const itemsPerPage = 10;

    const BaseURL = process.env.REACT_APP_BASE_URL;
    const { username, accessToken } = useAuth();

    useEffect(() => {
        fetchPurchases();
    }, [username, accessToken]);

    //get purchase
    const fetchPurchases = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching purchases: ${response.statusText}`);
            }
            const data = await response.json();
            setPurchases(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching purchases. Please try again later.');
        }
    };

    //view purchase
    const handleViewClick = (purchase) => {
        setSelectedPurchase(purchase);
        setViewPurchaseModal(true);
        setDiscountPercentage(purchase.discountPercent);
        setGstPercentage(purchase.gstPercent);
    };

    //edit purchase
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
            ledgerId: selectedPurchase.ledger_id,
            purchaseDetails: selectedPurchase.purchaseDetails.map(detail => ({
                bookName: detail.bookName,
                qty: parseInt(detail.qty),
                rate: parseFloat(detail.rate),
                amount: parseFloat(detail.amount)
            }))
        };
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedPurchase.purchaseId}`, {
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

    const handleInputChange = (e, field, index) => {
        let value = e.target.value;
        if (field === 'invoiceDate') {
            value = formatDateToISO(value);
        }
        if (index !== undefined) {
            const updatedDetails = [...selectedPurchase.purchaseDetails];
            if (field === 'qty' || field === 'rate') {
                updatedDetails[index][field] = parseInt(value);
                updatedDetails[index].amount = updatedDetails[index].rate * updatedDetails[index].qty;
            } else {
                updatedDetails[index][field] = value;
            }
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                purchaseDetails: updatedDetails
            }));
            return;
        }
        setSelectedPurchase(prevPurchase => ({
            ...prevPurchase,
            [field]: value
        }));
    };


    //date format
    const formatDateToISO = (dateString) => {
        if (!dateString) return '';
        const localDate = new Date(dateString);
        return localDate.toISOString();
    };


    // claculation in float datatype
    const formatNumber = (number) => {
        return parseFloat(number.toFixed(2)).toString();
    };

    // Calculate the total bill amount
    const calculateBillTotal = (details) => {
        let allTotal = 0;
        details.forEach(detail => {
            if (detail.qty && detail.rate) {
                allTotal += parseFloat(detail.qty) * parseFloat(detail.rate);
            }
        });
        return formatNumber(allTotal);
    };

    // Calculate the discount amount
    const calculateDiscount = (details) => {
        if (discountPercentage === "") return "0.00";
        const billTotal = parseFloat(calculateBillTotal(details));
        const discountAmount = billTotal * (parseFloat(discountPercentage / 100));
        return formatNumber(discountAmount);
    };

    // Calculate the total after discount
    const calculateTotalAfterDiscount = (details) => {
        const billTotal = parseFloat(calculateBillTotal(details));
        const totalAfterDiscount = billTotal - parseFloat(calculateDiscount(details));
        return formatNumber(totalAfterDiscount);
    };

    // Calculate GST amount
    const calculateGst = (details) => {
        if (gstPercentage === "") return "0.00";
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(details));
        const gstAmount = totalAfterDiscount * (parseFloat(gstPercentage) / 100);
        return formatNumber(gstAmount);
    };

    // Calculate the grand total
    const calculateGrandTotal = (details) => {
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(details));
        const grandTotal = totalAfterDiscount + parseFloat(calculateGst(details));
        return formatNumber(grandTotal);
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


    const recalculateValues = () => {
        if (selectedPurchase) {
            setSelectedPurchase(prevPurchase => ({
                ...prevPurchase,
                discountAmount: calculateDiscount(prevPurchase.purchaseDetails),
                gstAmount: calculateGst(prevPurchase.purchaseDetails),
                totalAfterDiscount: calculateTotalAfterDiscount(prevPurchase.purchaseDetails),
                grandTotal: calculateGrandTotal(prevPurchase.purchaseDetails),
                billTotal: calculateBillTotal(prevPurchase.purchaseDetails)
            }));
        }
    };


    useEffect(() => {
        recalculateValues();
    }, [discountPercentage, gstPercentage, selectedPurchase]);



    //delete function
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDeleteClick = (purchase) => {
        setSelectedPurchase(purchase);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/${selectedPurchase.purchaseId}`, {
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


    //pagination
    const totalPages = Math.ceil(purchases.length / itemsPerPage);
    const handlePageClick = (page) => setCurrentPage(page);

    const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
            {number}
        </Pagination.Item>
    ));

    const indexOfLastPurchase = currentPage * itemsPerPage;
    const indexOfFirstPurchase = indexOfLastPurchase - itemsPerPage;
    const currentPurchases = purchases.slice(indexOfFirstPurchase, indexOfLastPurchase);


    // const [showAddPurchase, setShowAddPurchase] = useState(false);


    return (
        <div className="main-content">
            <Container>
                {/* <div className='mt-2'>
                    <div className='mt-3'>
                        <Button onClick={() => setShowAddPurchase(true)} className="button-color">
                            Add purchase
                        </Button>
                    </div>
                    {showAddPurchase && <PurchaseDetails />}
                </div> */}

                <Table striped bordered hover className='mt-4'>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Ledger Name</th>
                            <th>Invoice No</th>
                            <th>Invoice Date</th>
                            <th>Grand Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPurchases.map((purchase, index) => (
                            <tr key={index}>
                                <td>{indexOfFirstPurchase + index + 1}</td>
                                <td>{purchase.ledger_name}</td>
                                <td>{purchase.invoiceNo}</td>
                                <td>{new Date(purchase.invoiceDate).toLocaleDateString()}</td>
                                <td>{purchase.grandTotal}</td>
                                <td>
                                    <PencilSquare className="ms-3 action-icon edit-icon" onClick={() => handleEditClick(purchase)} />
                                    <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDeleteClick(purchase)} />
                                    <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewClick(purchase)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>{paginationItems}</Pagination>
            </Container>

            {/* Edit Purchase Modal */}
            {selectedPurchase && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Purchase</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedPurchase.invoiceNo}
                                        onChange={(e) => handleInputChange(e, 'invoiceNo')}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                        onChange={(e) => handleInputChange(e, 'invoiceDate')}
                                        className="custom-date-picker"
                                    />

                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Ledger Name</Form.Label>
                                    <Form.Control
                                        readOnly
                                        value={selectedPurchase.ledger_name || ''}
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </Row>

                            <Table striped bordered hover className="table-bordered-dark">
                                <thead>
                                    <tr>
                                        <th className="table-header">Sr.No</th>
                                        <th className="table-header">Book Name</th>
                                        <th className="table-header">Quantity</th>
                                        <th className="table-header">Rate</th>
                                        <th className="table-header">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPurchase.purchaseDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={detail.bookName}
                                                    onChange={(e) => handleInputChange(e, 'bookName', index)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={detail.qty}
                                                    onChange={(e) => handleInputChange(e, 'qty', index)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={detail.rate}
                                                    onChange={(e) => handleInputChange(e, 'rate', index)}
                                                />
                                            </td>
                                            <td>{!isNaN(detail.amount) ? detail.amount : ''}</td>

                                        </tr>
                                    ))}

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>Bill Total</td>
                                        <td>{selectedPurchase.billTotal}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Discount</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={discountPercentage}
                                                onChange={(e) => {
                                                    const newDiscount = parseFloat(e.target.value);
                                                    setDiscountPercentage(newDiscount);
                                                    handleDiscountChange(e);
                                                }}
                                            />
                                        </td>
                                        <td>{selectedPurchase.discountAmount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Total After Discount</td>
                                        <td></td>
                                        <td>{selectedPurchase.totalAfterDiscount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>GST</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={gstPercentage}
                                                onChange={(e) => {
                                                    const newGst = parseFloat(e.target.value);
                                                    setGstPercentage(newGst);
                                                    handleGstChange(e);
                                                }}
                                            />
                                        </td>
                                        <td>{selectedPurchase.gstAmount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Grand Total</td>
                                        <td></td>
                                        <td>{selectedPurchase.grandTotal}</td>
                                    </tr>
                                </tbody>
                            </Table>
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
                <Modal show={viewPurchaseModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>View Purchase</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedPurchase.invoiceNo}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Invoice Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={selectedPurchase.invoiceDate ? selectedPurchase.invoiceDate.substring(0, 10) : ''}
                                        readOnly
                                        className="custom-date-picker"
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Ledger Name</Form.Label>
                                    <Form.Control
                                        readOnly
                                        value={selectedPurchase.ledger_name || ''}
                                    />
                                </Form.Group>
                            </Row>

                            <Table striped bordered hover className="table-bordered-dark">
                                <thead>
                                    <tr>
                                        <th className="table-header">Sr.No</th>
                                        <th className="table-header">Book Name</th>
                                        <th className="table-header">Quantity</th>
                                        <th className="table-header">Rate</th>
                                        <th className="table-header">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPurchase.purchaseDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={detail.bookName}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={detail.qty}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    value={detail.rate}
                                                    readOnly
                                                />
                                            </td>
                                            <td>{!isNaN(detail.amount) ? detail.amount : ''}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>Bill Total</td>
                                        <td>{selectedPurchase.billTotal}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Discount (%)</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={selectedPurchase.discountPercent}
                                                readOnly
                                            />
                                        </td>
                                        <td>{selectedPurchase.discountAmount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Total After Discount</td>
                                        <td></td>
                                        <td>{selectedPurchase.totalAfterDiscount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>GST (%)</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={selectedPurchase.gstPercent}
                                                readOnly
                                            />
                                        </td>
                                        <td>{selectedPurchase.gstAmount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>Grand Total</td>
                                        <td></td>
                                        <td>{selectedPurchase.grandTotal}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}



        </div>
    );
};

export default ViewPurchase;
