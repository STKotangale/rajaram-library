/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Eye, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryTransaction/CSS/Purchase.css';

// Utility function to convert date to dd-mm-yyyy format
const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookLost = () => {
    //get book lost
    const [bookLost, setBookLost] = useState([]);
    //get member name
    const [memberName, setMemberName] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    //get all accession details
    const [accessionDetails, setAccessionDetails] = useState([]);
    //add 
    const [showAddModal, setShowAddModal] = useState(false);
    //selected book get data
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({ accessionNo: '', bookName: '', bookRate: '', bookDetailId: '' })));
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().substr(0, 10));
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

    //get all
    useEffect(() => {
        fetchBookLost();
        fetchMemberName();
        fetchAccessionDetails();
        fetchLatestBookLostNo();
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

    //get book lost no.
    const fetchLatestBookLostNo = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/stock/latest-bookLostNo`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching latest book lost number: ${response.statusText}`);
            }
            const data = await response.json();
            setInvoiceNumber(data.nextInvoiceNo);
        } catch (error) {
            console.error('Error fetching latest book lost number:', error);
            toast.error('Error fetching latest book lost number. Please try again later.');
        }
    };

    //get member name
    const fetchMemberName = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/general-members`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setMemberName(data.data);
        } catch (error) {
            console.error("Failed to fetch member name:", error);
            toast.error('Failed to load member name. Please try again later.');
        }
    };

    //get all accession details
    const fetchAccessionDetails = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/acession-details`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching accession details: ${response.statusText}`);
            }
            const data = await response.json();
            setAccessionDetails(data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching accession details. Please try again later.');
        }
    };

    //add function
    const handleAccessionInputChange = (index, event) => {
        const updatedRows = [...rows];
        const accessionNo = event.target.value;
        const matchingBook = accessionDetails.find(detail => detail.accessionNo === accessionNo);
        if (matchingBook) {
            updatedRows[index] = {
                ...updatedRows[index],
                accessionNo: accessionNo,
                bookName: matchingBook.bookName,
                bookDetailId: matchingBook.bookDetailId,
                bookRate: matchingBook.book_rate ? parseFloat(matchingBook.book_rate).toFixed(2) : ''
            };
        } else {
            updatedRows[index] = {
                ...updatedRows[index],
                accessionNo: accessionNo,
                bookName: '',
                bookDetailId: '',
                bookRate: ''
            };
        }
        setRows(updatedRows);
    };

    const addRowAdd = () => {
        setRows([...rows, { accessionNo: '', bookName: '', bookRate: '', bookDetailId: '' }]);
    };

    const deleteRowAdd = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const calculateBillTotal = () => {
        return rows.reduce((total, row) => total + (parseFloat(row.bookRate) || 0), 0).toFixed(2);
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
        setSelectedMemberId(null);
        setDiscountPercent('');
        setRows(Array.from({ length: 5 }, () => ({ accessionNo: '', bookName: '', bookRate: '', bookDetailId: '' })));
    };

    //post api
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedFromDate = formatDateToDDMMYYYY(invoiceDate);

        const bookDetailsPayload = rows
            .filter(row => row.bookName && row.accessionNo)
            .map(row => ({
                bookdetailId: row.bookDetailId,
                amount: parseFloat(row.bookRate)
            }));

        const billTotal = parseFloat(calculateBillTotal());
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(billTotal));
        const grandTotal = parseFloat(calculateTotalAfterGst(totalAfterDiscount));

        const payload = {
            invoiceNO: invoiceNumber,
            invoiceDate: formattedFromDate,
            memberId: Number(selectedMemberId),
            billTotal: billTotal,
            grandTotal: grandTotal,
            discountPercent: parseFloat(discountPercent) || 0,
            discountAmount: calculateDiscountAmount(),
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
                fetchLatestBookLostNo();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting book lost:', error);
            toast.error('Error submitting book lost. Please try again.');
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

    //delete
    const handleDelete = (stockId) => {
        setDeleteStockId(stockId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteStockId) return;

        const selectedItems = bookLost[deleteStockId];

        if (!selectedItems || selectedItems.length === 0) {
            toast.error('No book details found for this stock.');
            return;
        }

        const bookDetailIds = selectedItems.map(item => item.bookDetailId);

        try {
            const postResponse = await fetch(`${BaseURL}/api/bookdetails/update-status-book-lost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(bookDetailIds)
            });

            if (!postResponse.ok) {
                const postData = await postResponse.json();
                toast.error(`Error during pre-deletion process: ${postData.message}`);
                return;
            }

            const deleteResponse = await fetch(`${BaseURL}/api/issue/${deleteStockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!deleteResponse.ok) {
                const deleteData = await deleteResponse.json();
                toast.error(`Error deleting book lost: ${deleteData.message}`);
                return;
            }
            toast.success('Book lost successfully updated and deleted.');
            setShowDeleteModal(false);
            fetchBookLost();
            fetchLatestBookLostNo();
        } catch (error) {
            console.error('Error during deletion process:', error);
            toast.error('Error during deletion process. Please try again.');
        }
    };

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

    //view
    const handleViewDetails = (items) => {
        setSelectedRowDetails(items);
        setShowDetailsModal(true);
    };

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(Object.keys(bookLost).length / perPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const indexOfLastItem = currentPage * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;
    const currentData = Object.entries(bookLost).slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Lost
                        </Button>
                    </div>
                    <div className="table-responsive table-height mt-4">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Book Lost No</th>
                                    <th>Book Lost Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(([stock_id, items], index) => (
                                    <tr key={stock_id}>
                                        <td>{index + 1}</td>
                                        <td>{items[0].username}</td>
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
                    <div className="pagination-container">
                        <Button onClick={handleFirstPage} disabled={currentPage === 1}>First Page</Button>
                        <Button onClick={handlePrevPage} disabled={currentPage === 1}> <ChevronLeft /></Button>
                        <div className="pagination-text">Page {currentPage} of {totalPages}</div>
                        <Button onClick={handleNextPage} disabled={currentPage === totalPages}> <ChevronRight /></Button>
                        <Button onClick={handleLastPage} disabled={currentPage === totalPages}>Last Page</Button>
                    </div>
                </div>
            </Container>

            {/* add modal */}
            <Modal centered show={showAddModal} onHide={() => { setShowAddModal(false); resetFormFields(); }} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Book Lost</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Lost No.</Form.Label>
                                    <Form.Control
                                        placeholder="Book lost number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Book Lost Date</Form.Label>
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
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Select
                                        as="select"
                                        className="small-input"
                                        value={selectedMemberId}
                                        onChange={(e) => setSelectedMemberId(e.target.value)}
                                    >
                                        <option value="">Select a member</option>
                                        {memberName.map(member => (
                                            <option key={member.memberId} value={member.memberId}>
                                                {member.username}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th className="table-header purchase-copy-size">Accession No.</th>
                                            <th>Book Name</th>
                                            <th className="table-header amount-size amount-align">Book Rate</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>
                                                    <Form.Control
                                                        list={`accessionNumbers-${index}`}
                                                        value={row.accessionNo}
                                                        onChange={(e) => handleAccessionInputChange(index, e)}
                                                        placeholder="Enter or Select Accession Number"
                                                    />
                                                    <datalist id={`accessionNumbers-${index}`}>
                                                        {Array.isArray(accessionDetails) && accessionDetails.map(detail => (
                                                            <option key={detail.bookDetailId} value={detail.accessionNo} />
                                                        ))}
                                                    </datalist>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={row.bookName}
                                                        readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        value={row.bookRate ? row.bookRate : '0.00'}
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
                                            <td className="amount-align">{calculateDiscountAmount().toFixed(2)}</td>
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
                                            <td></td>
                                            <td className="right-align">Grand Total</td>
                                            <td className="amount-align">{grandTotal}</td>
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
                        <Button className='button-color' onClick={handleSubmit}>
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
                                        <Form.Label>Book Lost No.</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedRowDetails[0]?.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Book Lost Date</Form.Label>
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
                                        <Form.Label>Member Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedRowDetails[0]?.username}
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
                                                <td className="right-align">Grand Total</td>
                                                <td></td>
                                                <td className="amount-align">{selectedRowDetails[0]?.grandTotal}</td>
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

            {/*Delete modal */}
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
