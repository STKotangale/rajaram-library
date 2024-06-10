import React, { useState } from 'react';
import { Container, Button, Form, Row } from 'react-bootstrap';
import './CSS/Report.css'; 

const OnlyMemberName = () => {
    const [memberName, setMemberName] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        const reportData = {
            memberName,
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

export default OnlyMemberName;
