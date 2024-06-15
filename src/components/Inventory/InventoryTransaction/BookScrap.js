/* eslint-disable react-hooks/exhaustive-deps */
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

const BookScrap = () => {
    //get  book srcap
    const [bookScrap, setBookScrap] = useState([]);
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
        fetchBookScrap();
        fetchPurchaserName();
        fetchAllBooks();
    }, [username, accessToken]);

    //get book srcap
    const fetchBookScrap = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/book-scrap-all`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching book scrap : ${response.statusText}`);
            }
            const data = await response.json();
            const groupedData = groupBy(data, 'stock_id');
            setBookScrap(groupedData);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book srcap . Please try again later.');
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


    // Reset form fields
    const resetFormFields = () => {
        setInvoiceNumber('');
        setInvoiceDate('');
        setSelectedPurchaserId(null);
        setDiscountPercent('');
        setRows(Array.from({ length: 5 }, () => ({ bookId: '', bookName: '', purchaseCopyNo: '', amount: '', details: [] })));
    };

    // const calculateQuantity = () => {
    //     return rows.filter(row => row.bookName && row.purchaseCopyNo).length;
    // };

    const billTotal = parseFloat(calculateBillTotal());

    const calculateTotalAfterDiscount = (total) => {
        const discountValue = parseFloat(discountPercent) || 0;
        return (total - (total * (discountValue / 100))).toFixed(2);
    };
    //show discount price
    const calculateDiscountAmount = () => {
        const billTotal = calculateBillTotal();
        const discountAmount = billTotal * (discountPercent / 100);
        return Math.floor(discountAmount);
    };
    const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(billTotal));

    // const calculateGrandTotal = (total) => {
    //     const grandTotal =totalAfterDiscount
    // };
    const grandTotal = parseFloat((totalAfterDiscount));

    //post api
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedFromDate = formatDateToDDMMYYYY(invoiceDate);
        // const quantity = calculateQuantity();

        const bookDetailsPayload = rows
            .filter(row => row.bookName && row.purchaseCopyNo)
            .map(row => ({
                bookdetailId: row.bookDetailId,
                amount: parseFloat(row.amount)
            }));

        const billTotal = parseFloat(calculateBillTotal());
        const totalAfterDiscount = parseFloat(calculateTotalAfterDiscount(billTotal));
        const grandTotal = parseFloat((totalAfterDiscount));

        const payload = {
            invoiceNO: invoiceNumber,
            invoiceDate: formattedFromDate,
            ledgerId: Number(selectedPurchaserId),
            billTotal: billTotal,
            // bookQty: quantity,
            discountPercent: parseFloat(discountPercent) || 0,
            discountAmount: calculateDiscountAmount(),
            totalAfterDiscount: totalAfterDiscount,
            grandTotal: grandTotal,
            bookDetails: bookDetailsPayload
        };

        try {
            const response = await fetch(`${BaseURL}/api/issue/book-scrap`, {
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
                fetchBookScrap();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error('Error submitting book scrap:', error);
            toast.error('Error submitting book scrap. Please try again.');
        }
    };




    //delete
    const handleDelete = (stockId) => {
        setDeleteStockId(stockId);
        setShowDeleteModal(true);
    };

    //delete api
    const confirmDelete = async () => {
        if (!deleteStockId) return;
    
        // Retrieve the items associated with the deleteStockId
        const selectedItems = bookScrap[deleteStockId];
    
        if (!selectedItems || selectedItems.length === 0) {
            toast.error('No book scrap details found for this stock.');
            return;
        }
    
        // Map over the selectedItems to extract their bookDetailIds
        const bookDetailIds = selectedItems.map(item => item.bookDetailId);
    
        try {
            // POST request to handle the bookDetailIds before deletion
            const postResponse = await fetch(`${BaseURL}/api/bookdetails/update-status-book-scrap`, {
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
                return; // Stop if POST failed
            }
    
            // If the POST request succeeds, proceed with the DELETE request
            const deleteResponse = await fetch(`${BaseURL}/api/issue/${deleteStockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!deleteResponse.ok) {
                const deleteData = await deleteResponse.json();
                toast.error(`Error deleting book scrap: ${deleteData.message}`);
                return; // Stop if DELETE failed
            }
    
            toast.success('Book scrap successfully processed and deleted.');
            setShowDeleteModal(false);
            fetchBookScrap(); // Refresh the list to reflect the changes
        } catch (error) {
            console.error('Error during deletion process:', error);
            toast.error('Error during deletion process. Please try again.');
        }
    };
    


    //show table in stock_id
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
    const totalPages = Math.ceil(Object.keys(bookScrap).length / perPage);

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
    const currentData = Object.entries(bookScrap).slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Scrap
                        </Button>
                    </div>
                    <div className="table-responsive table-height mt-4">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Purchaser Name</th>
                                    <th>Book Scrap No</th>
                                    <th>Book Scrap Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {Object.entries(bookScrap).map(([stock_id, items], index) => ( */}
                                {currentData.map(([stock_id, items], index) => (
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
                                ))
                                }
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
            <Modal centered show={showAddModal} onHide={() => { setShowAddModal(false); resetFormFields()}} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Book Scrap</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Book Scrap No.</Form.Label>
                                    <Form.Control
                                        placeholder="Book scrap number"
                                        type="text"
                                        className="small-input"
                                        value={invoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Book Scrap Date</Form.Label>
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
                                    <Form.Select
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
                                    </Form.Select>
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
                                                    <Form.Select
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
                                                    </Form.Select>
                                                </td>
                                                <td>
                                                    <Form.Select
                                                        as="select"
                                                        value={row.accessionNo}
                                                        onChange={(e) => handlePurchaseCopyChange(index, e.target.value)}
                                                    >
                                                        <option value="">Select accession no</option>
                                                        {row.details && row.details
                                                            .filter(detail => detail.accessionNo !== null)
                                                            .map(detail => (
                                                                <option key={detail.purchaseCopyNo} value={detail.purchaseCopyNo}>
                                                                    {detail.accessionNo}
                                                                </option>
                                                            ))}
                                                    </Form.Select>
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
                        <Modal.Title>Book Scrap Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRowDetails.length > 0 && (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col}>
                                        <Form.Label>Book Scrap No.</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className="small-input"
                                            value={selectedRowDetails[0]?.invoiceNo}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Book Scrap Date</Form.Label>
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
                                                            value={row.book_rate.toFixed(2)}
                                                            readOnly
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td className="right-align">Bill Total</td>
                                                <td className="amount-align">{selectedRowDetails[0]?.billTotal.toFixed(2)}</td>
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

            {/* delete modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this book scrap?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
                    <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default BookScrap;
