import React, { useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';

import { useAuth } from '../Auth/AuthProvider';

const DashboardData = () => {
  //get username and access token
  const { username, accessToken } = useAuth();

  useEffect(() => {

  }, [username, accessToken]);

  const data = [
    { title: 'Registered users', value: 17, cssClass: 'card-registered-users' },
    { title: 'Total Book', value: 100, cssClass: 'card-total-books' },
    { title: 'Total Book Copy\'s', value: 400, cssClass: 'card-total-copies' },
    { title: 'Book Issue ', value: 1, cssClass: 'card-issue-book' },
    { title: 'Book Return ', value: 5, cssClass: 'card-return-book' },
  ];

  return (
    <div className="main-content-dashboard-data">
      <Container>
        <Row className="mb-4">
          <Col>
          {/* <div className="welcome-message">Welcome, {username}!</div> */}
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="g-4">
          {data.map((item, idx) => (
            <Col key={idx}>
              <Card className={`dashboard-card ${item.cssClass}`}>
                <Card.Body>
                  <Card.Title>{item.value}</Card.Title>
                  <Card.Text>{item.title}</Card.Text>
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
