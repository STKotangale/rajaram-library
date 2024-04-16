import React, { useEffect, useState } from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../Auth/AuthProvider';

const ShowPurchase = () => {
    const BaseURL = process.env.REACT_APP_BASE_URL;
    const itemsPerPage = 10; // Set the number of items per page
    const [purchases, setPurchases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const { accessToken } = useAuth();

    // Function to fetch purchases
    const fetchPurchases = async (page) => {
        try {
            const response = await fetch(`${BaseURL}/api/purchase/list?page=${page}&limit=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPurchases(data.purchases);
            setTotalPages(Math.ceil(data.totalCount / itemsPerPage)); // Assume API returns totalCount
        } catch (error) {
            console.error('Error fetching purchases:', error.message);
            toast.error('Error fetching purchases');
        }
    };

    useEffect(() => {
        fetchPurchases(currentPage); // Fetch purchases when the component mounts and when currentPage changes
    }, [currentPage]);

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
                        {purchases.map((purchase, index) => (
                            <tr key={index}>
                                <td>{purchase.bookName}</td>
                                <td>{purchase.quantity}</td>
                                <td>{purchase.date}</td>
                                <td>{purchase.price}</td>
                                <td>{purchase.discountPercent}</td>
                                <td>
                                    {/* Action buttons like edit/delete go here */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center">{paginationItems}</Pagination>
            </Container>
        </div>
    );
};

export default ShowPurchase;
