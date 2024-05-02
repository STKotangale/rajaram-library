import React, { useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from '../Auth/AuthProvider';


import './CommonCSS/CardDashboard.css'

const DashboardData = () => {
  //get username and access token
  const { username, accessToken } = useAuth();

  useEffect(() => {

  }, [username, accessToken]);

  const data = [
    { title: 'Registered users', value: 17, cssClass: 'card-registered-users teal-card' },
    { title: 'Total Book', value: 100, cssClass: 'card-total-books blue-card' },
    { title: 'Total Book Copy\'s', value: 400, cssClass: 'card-total-copies red-card' },
    { title: 'Book Issue ', value: 1, cssClass: 'card-issue-book green-card' },
    { title: 'Book Return ', value: 5, cssClass: 'card-return-book orange-card' },
  ];
  return (
    <div className="main-content-dashboard-data">
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {data.map((item, idx) => (
            <Col key={idx} xs={6} className="custom-col">
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
