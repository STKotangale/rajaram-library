/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Auth/AuthProvider';
import { Container, Table } from 'react-bootstrap';

const Dashboard = () => {
  const BaseURL = process.env.REACT_APP_BASE_URL;
  const { userId, accessToken } = useAuth(); 

  useEffect(() => {
    const fetchMemberBookInfo = async () => {
      if (!userId || !accessToken) return; 
      try {
        const response = await fetch(`${BaseURL}/api/general-members/memberBookInfo/${userId}`, {
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
  }, [userId, accessToken, BaseURL]);

  const [memberBookInfo, setMemberBookInfo] = useState([]);

  return (
    <div className="main-content">
      <Container className="small-screen-table">
        <div className="mt-3">
          <div className="table-responsive table-height">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Book Name</th>
                  <th>Copy No.</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {memberBookInfo.map((book, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{book.bookName}</td>
                    <td>{book.purchaseCopyNo}</td>
                    <td>{book.issueDate}</td>
                    <td>{book.returnDate}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="pagination-container"></div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
