/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../Auth/AuthProvider';


import './CommonCSS/CardDashboard.css'

const DashboardData = () => {
  // const [registeredUsers, setRegisteredUsers] = useState(0);
  // const [books, setBooks] = useState(0);
  // const [totalBookCopies, setTotalBookCopies] = useState(0);

  //auth
  // const BaseURL = process.env.REACT_APP_BASE_URL;
  const { username, accessToken } = useAuth();

  useEffect(() => {
    // fetchUserData();
    // fetchBookData();
    // fetchTotalCopy();
  }, [username, accessToken]);


// //user get
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`${BaseURL}/api/auth/users`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setRegisteredUsers(data.length);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     //book get
//     const fetchBookData = async () => {
//       try {
//         const response = await fetch(`${BaseURL}/api/book/all`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setBooks(data.data.length);
//       } catch (error) {
//         console.error('Error fetching book data:', error);
//       }
//     };


//     const fetchTotalCopy = async () => {
//       try {
//         const response = await fetch(`${BaseURL}/api/bookdetails`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         const totalCopies = data.reduce((acc, book) => acc + (book.purchaseCopyNo ? 1 : 0), 0);
//         setTotalBookCopies(totalCopies);
//       } catch (error) {
//         console.error('Error fetching book total copies:', error);
//       }
//     };


  const data = [
    { title: 'Registered users', value: 12, cssClass: 'card-registered-users teal-card' },
    { title: 'Total Book', value: 54, cssClass: 'card-total-books blue-card' },
    { title: 'Total Book Copy\'s', value: 388, cssClass: 'card-total-copies red-card' },
    { title: 'Book Issue ', value: 1, cssClass: 'card-issue-book green-card' },
    { title: 'Book Return ', value: 5, cssClass: 'card-return-book orange-card' },
  ];
  return (
    <div className="main-content-dashboard-data">
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {data.map((item, idx) => (
            <Col key={idx} xs={6} className="custom-col rounded">
              <Card className={`dashboard-card ${item.cssClass}`}>
                <Card.Body>
                  <Card.Title className="card-title">{item.value}</Card.Title>
                  <Card.Text className="card-text">{item.title}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default DashboardData;
