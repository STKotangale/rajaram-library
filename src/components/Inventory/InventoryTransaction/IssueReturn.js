/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';
import '../InventoryTransaction/CSS/Purchase.css';
import { Trash, Eye, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const IssueReturn = () => {
    const [issueReturn, setIssueReturn] = useState([]);
    const [generalMember, setGeneralMember] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    // const [rows, setRows] = useState([]);
    const [rows, setRows] = useState(Array.from({ length: 5 }, () => ({
        bookId: '',
        bookdetailId: '',
        stockDetailId: '',
        bookName: '',
        accessionNo: '',
        invoiceDate: '',
        daysKept: 0,
        finePerDays: 0,
        fineDays: 0,
        fineAmount: 0,
        fineManuallyChanged: false
    })));
    const [issueReturnNumber, setIssueReturnNumber] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [selectedMemberName, setSelectedMemberName] = useState(""); 
    const [selectedMemberLibNo, setSelectedMemberLibNo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { username, accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [issueReturnDate, setIssueReturnDate] = useState(new Date().toISOString().substr(0, 10));

    const [issueReturnIdToDelete, setIssueReturnIdToDelete] = useState(null);

    useEffect(() => {
        fetchIssueReturn();
        fetchGeneralMembers();
        fetchLatestIssueReturnNo();
    }, [username, accessToken]);

    const fetchIssueReturn = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/issueReturns`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching issue return: ${response.statusText}`);
            }
            const data = await response.json();
            const groupedData = groupByStockId(data);
            setIssueReturn(groupedData);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching issue return. Please try again later.');
        }
    };

    //get Issue Return No number
    const fetchLatestIssueReturnNo = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/stock/latest-issueReturnNo`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching latest issue return number: ${response.statusText}`);
            }
            const data = await response.json();
            setIssueReturnNumber(data.nextInvoiceNo);
        } catch (error) {
            console.error('Error fetching latest issue return number:', error);
            toast.error('Error fetching latest issue return number. Please try again later.');
        }
    };

    const groupByStockId = (data) => {
        return data.reduce((acc, item) => {
            if (!acc[item.stock_id]) {
                acc[item.stock_id] = [];
            }
            acc[item.stock_id].push(item);
            return acc;
        }, {});
    };

    const fetchGeneralMembers = async () => {
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
            setGeneralMember(data.data);
        } catch (error) {
            console.error("Failed to fetch general members:", error);
            toast.error('Failed to load general members. Please try again later.');
        }
    };

    const handleDateSelect = (e) => {
        const date = e.target.value;
        setIssueReturnDate(date);

        if (selectedMemberId && date) {
            fetchIssueReturnDetails(selectedMemberId, date);
        } else {
        }
    };

    // const handleMemberSelect = (e) => {
    //     const fullName = e.target.value;
    //     setSelectedMemberName(fullName);
    //     const selectedMember = generalMember.find(member =>
    //         `${member.firstName} ${member.middleName} ${member.lastName}` === fullName
    //     );

    //     if (selectedMember) {
    //         setSelectedMemberId(selectedMember.memberId);
    //         setRows([]);
    //         if (issueReturnDate) {
    //             fetchIssueReturnDetails(selectedMember.memberId, issueReturnDate);
    //         }
    //     } else {
    //         setSelectedMemberId('');
    //         setRows([]);
    //     }
    // };

    const handleMemberSelect = (e) => {
        const fullName = e.target.value;
        setSelectedMemberName(fullName);
        const selectedMember = generalMember.find(member =>
            `${member.firstName} ${member.middleName} ${member.lastName}` === fullName
        );
        if (selectedMember) {
            setSelectedMemberId(selectedMember.memberId);
            setRows([]);
            setErrorMessage('');
            if (issueReturnDate) {
                fetchIssueReturnDetails(selectedMember.memberId, issueReturnDate);
            }
            setSelectedMemberLibNo(selectedMember.libGenMembNo);

        } else {
            setSelectedMemberId('');
            setRows([]);
            setErrorMessage('');
            setSelectedMemberLibNo('');
        }
    };


    const handleFinePerDayChange = (index, value) => {
        setRows(prevRows =>
            prevRows.map((row, idx) =>
                idx === index ? { ...row, finePerDays: Number(value), fineManuallyChanged: false, fineAmount: Number(value) * row.fineDays } : row
            )
        );
    };

    const handleFineAmountChange = (index, value) => {
        setRows(prevRows =>
            prevRows.map((row, idx) =>
                idx === index ? { ...row, fineAmount: Number(value), fineManuallyChanged: true } : row
            )
        );
    };

    const fetchIssueReturnDetails = async (memberId, date) => {
        try {
            const response = await fetch(`${BaseURL}/api/issue/detail/${memberId}/${formatDate(date)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching issue details: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.length === 0) {
                setErrorMessage('This username has no issue details or does not exist.');
            } else {
                const bookRows = data.map(item => ({
                    bookId: item.bookId,
                    bookdetailId: item.bookdetailId,
                    stockDetailId: item.stockDetailId,
                    bookName: item.bookName,
                    accessionNo: item.accessionNo,
                    invoiceDate: item.invoiceDate,
                    daysKept: item.daysKept,
                    finePerDays: item.finePerDays,
                    fineDays: item.fineDays,
                    fineAmount: item.fineAmount,
                    fineManuallyChanged: false, // Add this flag
                }));
                setRows(bookRows);
            }
        } catch (error) {
            console.error('Error fetching issue details:', error.message);
            toast.error('Error fetching issue details. Please try again later.');
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleRowSelect = (row) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(row)
                ? prevSelectedRows.filter(r => r !== row)
                : [...prevSelectedRows, row]
        );
    };

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const resetFormFields = () => {
        // setRows([]);
        setRows(Array.from({ length: 5 }, () => ({
            bookId: '',
            bookdetailId: '',
            stockDetailId: '',
            bookName: '',
            accessionNo: '',
            invoiceDate: '',
            daysKept: 0,
            finePerDays: 0,
            fineDays: 0,
            fineAmount: 0,
            fineManuallyChanged: false
        })));
        setSelectedRows([]);
        setSelectedDetail(null);
        setSelectedMemberName('');
        setSelectedMemberLibNo('');
        setSelectedRowIndex(null);
    };


    const calculateTotal = () => {
        return selectedRows.reduce((acc, current) => acc + current.fineAmount, 0);
    };

    //post api
    const handleSubmit = async (event) => {

        event.preventDefault();
        const selectedBookDetails = rows.filter(row => selectedRows.includes(row));
        const payload = {
            issueNo: issueReturnNumber,
            issueReturnDate: formatDate(issueReturnDate),
            memberId: generalMember.find(member => member.memberId === parseInt(selectedMemberId))?.memberId,
            bookDetailsList: selectedBookDetails.map(row => ({
                bookDetailIds: row.bookdetailId,
                bookId: row.bookId,
                stockDetailId: row.stockDetailId,
                issuedate: (row.invoiceDate),
                fineDays: row.fineDays,
                finePerDays: row.finePerDays,
                fineAmount: row.fineManuallyChanged ? row.fineAmount : row.finePerDays * row.fineDays // Use manually entered fine amount if present
                // fineAmount: fineAmounts[row.bookDetailId]
            }))
        };

        // Check if there are any selected rows
        if (selectedBookDetails.length === 0) {
            toast.error('No books selected.');
            return;
        }

        try {
            const response = await fetch(`${BaseURL}/api/issue/return/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Issue return submitted successfully.');
                setShowAddModal(false);
                resetFormFields();
                fetchIssueReturn();
                fetchLatestIssueReturnNo();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to submit issue return.');
            }
        } catch (error) {
            console.error('Error submitting issue return:', error);
            toast.error('Error submitting issue return. Please try again.');
        }
    };

    const handleDelete = (issueReturnId) => {
        setIssueReturnIdToDelete(issueReturnId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const issueReturnDetails = issueReturn[issueReturnIdToDelete];
            const bookDetailIds = issueReturnDetails.map(detail => detail.bookDetailsList.map(book => book.bookDetailIds)).flat();

            const response = await fetch(`${BaseURL}/api/bookdetails/update-status-issue-return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(bookDetailIds)
            });

            if (response.ok) {
                // If the update is successful, delete the issue return
                await fetch(`${BaseURL}/api/issue/${issueReturnIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                toast.success('Issue return deleted successfully.');
                fetchIssueReturn();
                fetchLatestIssueReturnNo();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update book details status.');
            }
        } catch (error) {
            console.error('Error deleting issue return:', error);
            toast.error('Error deleting issue return. Please try again.');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleViewDetail = (detail) => {
        setSelectedDetail(detail);
        setShowDetailModal(true);
    };
    const calculateDetailTotal = () => {
        if (!selectedDetail) return 0;
        return selectedDetail[0].bookDetailsList.reduce((acc, current) => acc + current.fineAmount, 0);
    };


    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;

    // Convert object to array for pagination
    const issueReturnArray = Object.entries(issueReturn).map(([key, value]) => ({ key, value }));
    const totalPages = Math.ceil(issueReturnArray.length / perPage);

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
    const currentData = issueReturnArray.slice(indexOfFirstItem, indexOfLastItem);



    return (
        <div className="main-content">
            <Container className='small-screen-table'>
                <div className='mt-2'>
                    <div className='mt-1'>
                        <Button onClick={() => setShowAddModal(true)} className="button-color">
                            Add Book Issue Return
                        </Button>
                    </div>
                    <div className="table-responsive table-height mt-4">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Member Name</th>
                                    <th>Issue Return No</th>
                                    <th>Issue Return Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(({ key, value }, index) => (
                                    <tr key={key}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{value[0].username}</td>
                                        <td>{value[0].invoiceNo}</td>
                                        <td>{value[0].invoiceDate}</td>
                                        <td>
                                            <Eye className="ms-3 action-icon view-icon" onClick={() => handleViewDetail(value)} />
                                            <Trash className="ms-3 action-icon delete-icon" onClick={() => handleDelete(key)} />
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

            <Modal centered show={showAddModal} onHide={() => { setShowAddModal(false); resetFormFields() }} size='xl'>
                <div className="bg-light">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue Return</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return No</Form.Label>
                                    <Form.Control
                                        placeholder="Issue return number"
                                        type="text"
                                        className="small-input"
                                        value={issueReturnNumber}
                                        onChange={(e) => setIssueReturnNumber(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={issueReturnDate}
                                        onChange={handleDateSelect}
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedMemberName}
                                        onChange={handleMemberSelect}
                                        list="memberNameList"
                                        placeholder="Enter or select a member"
                                    />
                                    <datalist id="memberNameList">
                                        {generalMember.map(member => (
                                            <option key={member.memberId} value={`${member.firstName} ${member.middleName} ${member.lastName}`}>
                                                {`${member.firstName} ${member.middleName} ${member.lastName}`}
                                            </option>
                                        ))}
                                    </datalist>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>LibGenMembNo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        readOnly
                                        value={selectedMemberLibNo}
                                    />
                                </Form.Group>
                                {errorMessage && (
                                    <div className="error-message text-danger mt-3">{errorMessage}</div>
                                )}
                            </Row>
                            <div className="table-responsive">
                                {errorMessage ? null : (
                                    <Table striped bordered hover className="table-bordered-dark">
                                        <thead>
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Book Name</th>
                                                <th>Accession No</th>
                                                <th>Issue Date</th>
                                                <th>Fine Per Day</th>
                                                <th>Total Day</th>
                                                <th>Extra Day</th>
                                                <th>Fine Amount</th>
                                                <th>Select Issue Return</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {rows.map((row, index) => (
                                                <tr key={index} className={selectedRows.includes(row) ? 'selected-row' : ''}>
                                                    <td className='sr-size'>{index + 1}</td>
                                                    <td>{row.bookName}</td>
                                                    <td>{row.accessionNo}</td>
                                                    <td>{row.invoiceDate}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={row.finePerDays}
                                                            onChange={(e) => handleFinePerDayChange(row.bookDetailId, e.target.value)}
                                                            style={{ width: '60px' }}
                                                        />
                                                    </td>
                                                    <td>{row.daysKept}</td>
                                                    <td>{row.fineDays}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            style={{ width: '80px' }}
                                                            className="form-control form-control-sm"
                                                            value={fineAmounts[row.bookDetailId]}
                                                            onChange={(e) => handleFineAmountChange(row.bookDetailId, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <input
                                                                type="checkbox"
                                                                className=""
                                                                checked={selectedRows.includes(row)}
                                                                onChange={() => handleRowSelect(row)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))} */}
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{row.bookName}</td>
                                                    <td>{row.accessionNo}</td>
                                                    <td>{row.invoiceDate}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            value={row.finePerDays}
                                                            onChange={(e) => handleFinePerDayChange(index, e.target.value)}
                                                            style={{ width: '60px' }}
                                                            onFocus={() => setSelectedRowIndex(index)}
                                                        />
                                                    </td>
                                                    <td>{row.daysKept}</td>
                                                    <td>{row.fineDays}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            style={{ width: '80px' }}
                                                            className="form-control form-control-sm"
                                                            value={row.fineAmount.toFixed(2)}
                                                            onChange={(e) => handleFineAmountChange(index, e.target.value)}
                                                            onFocus={() => setSelectedRowIndex(index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows.includes(row)}
                                                                onChange={() => handleRowSelect(row)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>Total</td>
                                                <td>{calculateTotal().toFixed(2)}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                )}
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

            <Modal centered show={showDeleteModal} onHide={() => { setShowDeleteModal(false); resetFormFields() }}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this issue return?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={showDetailModal} onHide={() => setShowDetailModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Issue Return Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDetail && (
                        <>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="small-input"
                                        value={selectedDetail[0].invoiceNo}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Issue Return Date</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedDetail[0].invoiceDate}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedDetail[0].username}
                                        readOnly
                                        className="custom-date-picker small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover className="table-bordered-dark">
                                    <thead>
                                        <tr>
                                            <th className='sr-size'>Sr. No.</th>
                                            <th>Book Name</th>
                                            <th>Accession No</th>
                                            <th>Issue Date</th>
                                            <th>Fine Per Day</th>
                                            <th>Fine Days</th>
                                            <th>Fine Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDetail[0].bookDetailsList.map((detail, index) => (
                                            <tr key={index}>
                                                <td className='sr-size'>{index + 1}</td>
                                                <td>{detail.BookName}</td>
                                                <td>{detail.AcessionNo}</td>
                                                <td>{detail.issuedate}</td>
                                                <td>{detail.finePerDays}</td>
                                                <td>{detail.fineDays}</td>
                                                <td>{detail.fineAmount}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>Total</td>
                                            <td>{calculateDetailTotal()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IssueReturn;
