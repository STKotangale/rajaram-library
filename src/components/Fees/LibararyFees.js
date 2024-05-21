/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthProvider';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Eye, PencilSquare, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LibararyFees = () => {
    //get
    const [library, setLibrary] = useState([]);
   
    //auth
    const { accessToken } = useAuth();
    const BaseURL = process.env.REACT_APP_BASE_URL;

    //get api
    const fetchLibraryFees = async () => {
        try {
            const response = await fetch(`${BaseURL}/api/auth/book-types`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Error fetching library fees: ${response.statusText}`);
            }
            const data = await response.json();
            setLibrary(data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching library fees. Please try again later.');
        }
    };

    useEffect(() => {
        fetchLibraryFees();
    }, []);

    //reset fields
    const resetFormFields = () => {

    };

 
    //pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const totalPages = Math.ceil(library.length / perPage);

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
    const indexOfFirstBookType = indexOfLastBookType - perPage;
    const currentBookTypes = library.slice(indexOfFirstBookType, indexOfLastBookType);


    return (
        <div className='padding-class'>
            <div className="main-content">
                <Container className='small-screen-table'>
                    <div>
                        
                        <div className='table-responsive mt-3 table-height'>

                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Fees Type</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBookTypes.map((bookType, index) => (
                                        <tr key={bookType.bookTypeId}>
                                            <td>{indexOfFirstBookType + index + 1}</td>
                                            <td>{bookType.bookTypeName}</td>
                                            <td>{bookType.bookTypeName}</td>
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
            </div>
        </div>

    );
};

export default LibararyFees;
