import React, { useState } from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';

const ShowPurchase = () => {
    // Static data for demonstration (30 entries for 3 pages of 10 entries each)
    const staticPurchases = new Array(30).fill(null).map((_, index) => ({
        bookName: `Book ${index + 1}`,
        quantity: 10,
        date: '10/10/2024',
        price: 1200,
        discountPercent: 15,
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set number of items per page
    const totalPages = Math.ceil(staticPurchases.length / itemsPerPage); // Calculate total pages

    // Function to handle page click
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // Render pagination items
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageClick(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    // Calculate the index of the first and last purchase to show on the current page
    const indexOfLastPurchase = currentPage * itemsPerPage;
    const indexOfFirstPurchase = indexOfLastPurchase - itemsPerPage;
    const currentPurchases = staticPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);

    return (
        <div className="main-content">
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Book Name</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Discount Percent</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPurchases.map((purchase, index) => (
                            <tr key={index}>
                                <td>{purchase.bookName}</td>
                                <td>{purchase.quantity}</td>
                                <td>{purchase.date}</td>
                                <td>{purchase.price}</td>
                                <td>{purchase.discountPercent}%</td>
                                <td>
                                    <PencilSquare className="ms-3 action-icon edit-icon" />
                                    <Trash className="ms-3 action-icon delete-icon" />
                                    <Eye className="ms-3 action-icon view-icon" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>{paginationItems}</Pagination>
            </Container>
        </div>
    );
};

export default ShowPurchase;
