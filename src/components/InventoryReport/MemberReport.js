import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import './CSS/Report.css'; 

const MemberReport = () => {
    const [memberName, setMemberName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reportData = {
            memberName,
            fromDate,
            toDate,
        };

        try {
            const response = await fetch('https://your-api-endpoint.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                console.log('Report submitted successfully');
            } else {
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='member-report'>
            <div className="overlay">
                <div className="centered-form">
                    <Container>
                        <div className="form-header">
                            <h2>Report Format</h2>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Form.Group controlId="memberName">
                                    <Form.Label>Member Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Member name"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="small-input"
                                    />
                                </Form.Group>
                            </Row>
                            <div className='d-flex justify-content-end'> 
                            <Button className='button-color' type="submit">
                                Submit
                            </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>
        </div>

    );
};

export default MemberReport;
