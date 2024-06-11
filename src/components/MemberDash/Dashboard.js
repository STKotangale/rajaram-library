/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Button,Container, Table } from 'react-bootstrap';
import { ChevronLeft, ChevronRight} from 'react-bootstrap-icons';

const Dashboard = () => {
  const [memberBookInfo, setMemberBookInfo] = useState([]);

  const BaseURL = process.env.REACT_APP_BASE_URL;
  const { userId, accessToken, memberId } = useAuth();

  useEffect(() => {
    const fetchMemberBookInfo = async () => {
      if (!userId || !accessToken || !memberId) return;
      try {
        const response = await fetch(`${BaseURL}/api/general-members/memberBookInfo/${memberId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching member book info: ${response.statusText}`);
        }
        const data = await response.json();
        setMemberBookInfo(data);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching member book info. Please try again later.');
      }
    };

    fetchMemberBookInfo();
  }, [memberId, userId, accessToken, BaseURL]);


  //pagination function
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(memberBookInfo.length / perPage);

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
  const indexOfNumber = indexOfLastBookType - perPage;
  const currentData = memberBookInfo.slice(indexOfNumber, indexOfLastBookType);

  return (
    <div className="main-content">
      <Container className="small-screen-table">
        <div className="mt-3">
          <div className="table-responsive table-height-member-dashboard">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Book Name</th>
                  <th>Accession No</th>
                  <th>Purchase Copy No.</th>
                  <th>Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((book, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{book.bookName}</td>
                    <td>{book.accessionNo}</td>
                    <td>{book.purchaseCopyNo}</td>
                    <td>{book.issueDate}</td>
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
  );
};

export default Dashboard;
